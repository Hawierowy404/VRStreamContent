// Google OAuth stays in the main process. No tokens or ingest keys reach the renderer.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const SCOPE='https://www.googleapis.com/auth/youtube.force-ssl';
function apiError(data,status){
 const reason=data?.error?.errors?.[0]?.reason||data?.error;
 if(['liveStreamingNotEnabled','livePermissionBlocked','insufficientLivePermissions'].includes(reason))return Error('ERR_YT_CHANNEL');
 if(['quotaExceeded','dailyLimitExceeded'].includes(reason))return Error('ERR_YT_QUOTA');
 if(['insufficientPermissions','insufficientPermissionsForAccess'].includes(reason)||status===401)return Error('ERR_YT_LOGIN');
 if(['userBroadcastsExceedLimit','userRequestsExceedRateLimit'].includes(reason))return Error('ERR_YT_LIMIT');
 if(reason==='invalidLatencyPreferenceOptions')return Error('ERR_YT_LATENCY');
 if(['accessNotConfigured','serviceDisabled'].includes(reason))return Error('ERR_YT_DISABLED');
 if(reason==='invalid_grant')return Error('ERR_YT_LOGIN');
 return Error('ERR_YT_API');
}
class YouTube {
 constructor({directory,configFile,safeStorage,openExternal,fetcher=fetch,diagnostics={add(){}}}){
  Object.assign(this,{directory,configFile,safeStorage,openExternal,fetcher,diagnostics});
  this.file=path.join(directory,'youtube-account.bin');
  this.accountGeneration=0;
 }
 config(){try{const raw=JSON.parse(fs.readFileSync(this.configFile,'utf8'));const c=raw.installed||raw;
  if(raw.web||!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(c.client_id))throw Error();return c;
 }catch{throw Error('ERR_YT_CONFIG');}}
 load(){if(this.tokens)return this.tokens;try{const stored=JSON.parse(this.safeStorage.decryptString(fs.readFileSync(this.file)));
  // A different publisher's build must never reuse this account's credentials.
  if(stored.client_id!==this.config().client_id)return {};
  this.tokens=stored;return this.tokens;}catch{return {};}}
 save(tokens){if(!this.safeStorage.isEncryptionAvailable())throw Error('ERR_YT_STORAGE');
  tokens={...tokens,client_id:this.config().client_id};
  fs.mkdirSync(this.directory,{recursive:true});fs.writeFileSync(this.file+'.tmp',this.safeStorage.encryptString(JSON.stringify(tokens)));fs.renameSync(this.file+'.tmp',this.file);this.tokens=tokens;}
 status(){let configured=false;try{this.config();configured=true;}catch{}
  const account=this.load();return {configured,connected:Boolean(account.refresh_token),channel:account.channel||''};}
 async json(url,options={}){let response;try{response=await this.fetcher(url,{...options,signal:AbortSignal.timeout(20000)});}catch{throw Error('ERR_YT_NETWORK');}
  const data=await response.json().catch(()=>({}));if(!response.ok){
   const known=new Set(['liveStreamingNotEnabled','livePermissionBlocked','insufficientLivePermissions','quotaExceeded','dailyLimitExceeded','invalid_grant','insufficientPermissions','insufficientPermissionsForAccess','userBroadcastsExceedLimit','userRequestsExceedRateLimit','invalidLatencyPreferenceOptions','accessNotConfigured','serviceDisabled','invalidAutoStart','invalidAutoStop','invalidEmbedSetting','invalidPrivacyStatus','invalidScheduledStartTime','invalidTitle','invalidResolution','invalidFrameRate','invalidIngestionType','forbidden','badRequest']);
   const raw=data?.error?.errors?.[0]?.reason||data?.error;const reason=known.has(raw)?raw:'unknown';
   const parsed=new URL(url);const operation=parsed.hostname==='oauth2.googleapis.com'?'oauth':parsed.pathname.split('/').slice(-2).join('/');
   this.diagnostics.add('youtube-api',JSON.stringify({operation,http:response.status,reason}));
   throw apiError(data,response.status);
  }return data;}
 async tokenRequest(params){const c=this.config();return this.json('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({...params,client_id:c.client_id,...(c.client_secret?{client_secret:c.client_secret}:{})})});}
 async token(){const old=this.load();if(old.access_token&&old.expires_at>Date.now()+60000)return old.access_token;
  if(!old.refresh_token)throw Error('ERR_YT_LOGIN');
  const generation=this.accountGeneration;
  if(!this.refreshing)this.refreshing=this.tokenRequest({grant_type:'refresh_token',refresh_token:old.refresh_token}).then(t=>{if(generation!==this.accountGeneration)throw Error('ERR_YT_LOGIN');this.save({...old,...t,expires_at:Date.now()+t.expires_in*1000});return t.access_token;}).finally(()=>this.refreshing=null);
  return this.refreshing;
 }
 async api(resource,params={},body,method=body?'POST':'GET'){
  const token=await this.token();return this.json('https://www.googleapis.com/youtube/v3/'+resource+'?'+new URLSearchParams(params),{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 }
 async connect(){
  if(this.connecting)throw Error('ERR_YT_BUSY');const c=this.config();if(!this.safeStorage.isEncryptionAvailable())throw Error('ERR_YT_STORAGE');this.connecting=true;const generation=++this.accountGeneration;
  const state=crypto.randomBytes(32).toString('base64url'),verifier=crypto.randomBytes(48).toString('base64url');
  let server,timer;
  try{
   let accept,deny;const callback=new Promise((resolve,reject)=>{accept=resolve;deny=reject;});callback.catch(()=>{});
   server=http.createServer((req,res)=>{
    const u=new URL(req.url,'http://127.0.0.1');res.setHeader('Content-Type','text/plain; charset=utf-8');res.setHeader('Cache-Control','no-store');
    if(req.method!=='GET'||u.pathname!=='/oauth/callback'||u.searchParams.get('state')!==state){res.writeHead(400);res.end('Invalid callback');return;}
    if(u.searchParams.get('error')||!u.searchParams.get('code')){res.end('Sign-in cancelled. Return to VRStreamContent.');deny(Error('ERR_YT_LOGIN'));return;}
    res.end('You can close this page and return to VRStreamContent.');accept(u.searchParams.get('code'));
   });
   await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
   const redirect_uri='http://127.0.0.1:'+server.address().port+'/oauth/callback';
   timer=setTimeout(()=>deny(Error('ERR_YT_LOGIN')),180000);
   this.cancelConnect=()=>deny(Error('ERR_YT_LOGIN'));
   const query=new URLSearchParams({client_id:c.client_id,redirect_uri,response_type:'code',scope:SCOPE,state,code_challenge:crypto.createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',access_type:'offline',prompt:'consent'});
   await this.openExternal('https://accounts.google.com/o/oauth2/v2/auth?'+query);
   const code=await callback;const tokens=await this.tokenRequest({grant_type:'authorization_code',code,redirect_uri,code_verifier:verifier});
   if(generation!==this.accountGeneration||!tokens.refresh_token)throw Error('ERR_YT_LOGIN');
   this.save({...tokens,expires_at:Date.now()+tokens.expires_in*1000});
   const channels=await this.api('channels',{part:'snippet',mine:'true'});
   if(!channels.items?.length){await this.disconnect();throw Error('ERR_YT_CHANNEL');}
   if(generation!==this.accountGeneration)throw Error('ERR_YT_LOGIN');
   this.save({...this.load(),channel:channels.items[0].snippet.title});return this.status();
  }finally{clearTimeout(timer);server?.closeAllConnections();server?.close();this.connecting=false;this.cancelConnect=null;}
 }
 async disconnect(){this.accountGeneration++;this.cancelConnect?.();const token=this.load().refresh_token;this.tokens={};fs.rmSync(this.file,{force:true});fs.rmSync(this.file+'.tmp',{force:true});
  if(token){try{const result=await this.fetcher('https://oauth2.googleapis.com/revoke',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token}),signal:AbortSignal.timeout(10000)});if(!result.ok)throw Error();}catch{throw Error('ERR_YT_REVOKE');}}
  return this.status();
 }
}
module.exports={YouTube,apiError};
