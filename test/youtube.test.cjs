const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {EventEmitter}=require('node:events');
const {YouTube}=require('../youtube.cjs');
const {YouTubeSession,youtubeArgs,ingestUrl}=require('../youtube-stream.cjs');
test('YouTube RTMPS endpoint is accepted while unrelated or credential-bearing endpoints are refused',()=>{
 const stream=address=>({cdn:{ingestionInfo:{rtmpsIngestionAddress:address,streamName:'private-key'}}});
 assert.equal(ingestUrl(stream('rtmps://a.rtmps.youtube.com:443/live2')),'rtmps://a.rtmps.youtube.com:443/live2/private-key');
 for(const url of ['rtmp://a.rtmps.youtube.com/live2','rtmps://a.rtmps.youtube.com.evil.example/live2','rtmps://user:pass@a.rtmps.youtube.com/live2','rtmps://a.rtmps.youtube.com/live2?x=1','rtmps://a.rtmps.youtube.com:444/live2','not a URL'])assert.throws(()=>ingestUrl(stream(url)),/ERR_YT_INGEST/);
});
test('YouTube error diagnostics include status and known reason but never response secrets',async()=>{
 const logs=[],y=new YouTube({directory:__dirname,diagnostics:{add:(event,detail)=>logs.push({event,detail})},fetcher:async()=>Response.json({error:{message:'private-key secret-token',errors:[{reason:'invalidLatencyPreferenceOptions'}]}},{status:400})});
 await assert.rejects(y.json('https://www.googleapis.com/youtube/v3/liveBroadcasts'),/ERR_YT_LATENCY/);
 assert.match(JSON.stringify(logs),/invalidLatencyPreferenceOptions/);assert.doesNotMatch(JSON.stringify(logs),/private-key|secret-token/);
 y.fetcher=async()=>Response.json({error:{errors:[{reason:'secret-token'}]}},{status:403});
 await assert.rejects(y.json('https://www.googleapis.com/youtube/v3/liveStreams'),/ERR_YT_API/);assert.doesNotMatch(JSON.stringify(logs),/secret-token/);
});
function fixture(){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-yt-test-'));const configFile=path.join(directory,'client.json');fs.writeFileSync(configFile,JSON.stringify({installed:{client_id:'test.apps.googleusercontent.com',client_secret:'desktop-test'}}));return {directory,configFile,safeStorage:{isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s),decryptString:b=>b.toString()}};}
test('OAuth uses system browser, state, PKCE and loopback; only account name returned',async()=>{
 const f=fixture();let challenge,redirect,exchanged=false;
 const youtube=new YouTube({...f,openExternal:async address=>{const u=new URL(address);challenge=u.searchParams.get('code_challenge');redirect=u.searchParams.get('redirect_uri');
  assert.equal(u.origin,'https://accounts.google.com');assert.equal(u.searchParams.get('code_challenge_method'),'S256');
  assert.equal((await fetch(redirect+'?state=wrong&code=bad')).status,400);
  assert.equal((await fetch(redirect+'?state='+u.searchParams.get('state')+'&code=good')).status,200);
 },fetcher:async(address,options)=>{if(address.includes('/token')){const p=options.body;assert.equal(p.get('redirect_uri'),redirect);assert.equal(p.get('code'),'good');assert.equal(crypto.createHash('sha256').update(p.get('code_verifier')).digest('base64url'),challenge);exchanged=true;return Response.json({refresh_token:'private-refresh',access_token:'private-access',expires_in:3600});}
  assert.equal(options.headers.Authorization,'Bearer private-access');return Response.json({items:[{snippet:{title:'Test channel'}}]});}});
 try{assert.deepEqual(await youtube.connect(),{configured:true,connected:true,channel:'Test channel'});assert.ok(exchanged);assert.ok(!JSON.stringify(youtube.status()).includes('private-'));}finally{fs.rmSync(f.directory,{recursive:true,force:true});}
});
test('Missing OAuth config fails before opening browser',async()=>{const f=fixture();fs.unlinkSync(f.configFile);let opened=false;try{const y=new YouTube({...f,openExternal:()=>opened=true});await assert.rejects(y.connect(),/ERR_YT_CONFIG/);assert.equal(opened,false);}finally{fs.rmSync(f.directory,{recursive:true,force:true});}});
test('Refresh token is reused without browser and disconnect removes local token',async()=>{const f=fixture();let refreshes=0;const y=new YouTube({...f,fetcher:async(url,opts)=>{if(url.includes('/token')){refreshes++;assert.equal(opts.body.get('refresh_token'),'refresh');return Response.json({access_token:'renewed',expires_in:3600});}return new Response('',{status:200});}});try{y.save({refresh_token:'refresh',expires_at:0});assert.deepEqual(await Promise.all([y.token(),y.token()]),['renewed','renewed']);assert.equal(refreshes,1);await y.disconnect();assert.equal(y.status().connected,false);assert.equal(fs.existsSync(y.file),false);}finally{fs.rmSync(f.directory,{recursive:true,force:true});}});
function apiFixture(){const calls=[];let state='ready';const api=async(resource,params,body,method)=>{calls.push({resource,params,body,method});
 if(resource==='liveBroadcasts'&&body)return {id:'broadcast-id',status:{privacyStatus:'unlisted'}};
 if(resource==='liveStreams'&&body)return {id:'stream-id',cdn:{ingestionInfo:{rtmpsIngestionAddress:'rtmps://a.rtmps.youtube.com/live2',streamName:'SECRET'}}};
 if(resource==='liveBroadcasts'&&!method)return {items:[{status:{lifeCycleStatus:state,privacyStatus:'unlisted'}}]};return {};};
 let spawns=0;const spawn=()=>{spawns++;const e=new EventEmitter();e.pid=42;e.exitCode=null;e.stdout=new EventEmitter();e.stderr=new EventEmitter();e.stdin=new EventEmitter();e.stdin.writable=true;e.stdin.write=(_b,cb)=>cb();e.stdin.end=()=>{e.exitCode=0;queueMicrotask(()=>e.emit('exit',0));};e.kill=e.stdin.end;return e;};return {calls,api,spawn,setState:s=>state=s,spawns:()=>spawns};}
test('Creates unlisted stream, only enables link after live; quality keeps same broadcast and stop completes it',async()=>{const f=apiFixture(),events=[];const s=new YouTubeSession(f,'ffmpeg',x=>events.push(x),undefined,f.spawn);
 try{await s.start('720',0,30,{title:'Test',madeForKids:false});assert.equal(s.ready,false);assert.equal(s.url,'https://www.youtube.com/watch?v=broadcast-id');assert.equal(f.calls[0].body.status.privacyStatus,'unlisted');assert.equal(f.calls[0].body.contentDetails.enableAutoStart,true);await s.check();assert.equal(s.ready,false);f.setState('live');await s.check();assert.equal(s.ready,true);await s.reconfigure('1080',0,60);assert.equal(f.spawns(),2);assert.equal(f.calls.filter(x=>x.resource==='liveBroadcasts'&&x.body).length,1);await s.write(Buffer.from('test'));await s.stop();assert.ok(f.calls.some(x=>x.resource==='liveBroadcasts/transition'&&x.params.broadcastStatus==='complete'));assert.ok(!JSON.stringify(events).includes('SECRET'));}finally{await s.stop();}});
test('Privacy mismatch prevents capture publishing and cleans created broadcast',async()=>{const f=apiFixture();const api=f.api;f.api=async(...args)=>{const result=await api(...args);if(args[0]==='liveBroadcasts'&&args[2])result.status.privacyStatus='public';return result;};const s=new YouTubeSession(f,'ffmpeg',()=>{},undefined,f.spawn);await assert.rejects(s.start('720',0,30,{title:'Test',madeForKids:false}),/ERR_YT_PRIVACY/);await s.stop();assert.equal(f.spawns(),0);assert.ok(f.calls.some(x=>x.method==='DELETE'));});
test('Stop during creation cancels publishing and cleans only resources of this attempt',async()=>{const f=apiFixture();let release;const base=f.api;f.api=async(...args)=>{if(args[0]==='liveBroadcasts'&&args[2])await new Promise(r=>release=r);return base(...args);};const s=new YouTubeSession(f,'ffmpeg',()=>{},undefined,f.spawn);const start=s.start('720',0,30,{title:'Test',madeForKids:false});const stop=s.stop();release();await Promise.all([start,stop]);assert.equal(f.spawns(),0);assert.ok(f.calls.some(x=>x.method==='DELETE'&&x.params.id==='broadcast-id'));});
test('RTMPS only uses YouTube ingestion host; encoder keeps H264/AAC and removes HLS',()=>{assert.throws(()=>ingestUrl({cdn:{ingestionInfo:{rtmpsIngestionAddress:'rtmps://evil.example/live',streamName:'key'}}}),/ERR_YT_INGEST/);const a=youtubeArgs('rtmps://a.rtmps.youtube.com/live2/key',720,0,30);assert.equal(a[a.lastIndexOf('-f')+1],'flv');assert.equal(a.includes('-hls_time'),false);assert.ok(a.includes('libx264'));assert.ok(a.includes('aac'));assert.equal(a[a.indexOf('-g')+1],'60');});
test('Accounts are isolated per user directory and per publisher client',()=>{
 const a=fixture(),b=fixture();try{
  const first=new YouTube(a);first.save({refresh_token:'alice',channel:'Alice'});
  assert.equal(new YouTube(b).status().connected,false);
  assert.equal(new YouTube(a).status().channel,'Alice');
  fs.writeFileSync(a.configFile,JSON.stringify({installed:{client_id:'different.apps.googleusercontent.com'}}));
  assert.equal(new YouTube(a).status().connected,false);
 }finally{fs.rmSync(a.directory,{recursive:true,force:true});fs.rmSync(b.directory,{recursive:true,force:true});}
});
test('Disconnect during token refresh cannot silently restore account',async()=>{
 const f=fixture();let resolveRefresh;
 const y=new YouTube({...f,fetcher:async url=>url.includes('/token')?await new Promise(r=>resolveRefresh=r):new Response('',{status:200})});
 try{y.save({refresh_token:'old',expires_at:0});const refreshing=y.token();refreshing.catch(()=>{});await y.disconnect();resolveRefresh(Response.json({access_token:'late',expires_in:3600}));await assert.rejects(refreshing,/ERR_YT_LOGIN/);assert.equal(y.status().connected,false);assert.equal(fs.existsSync(y.file),false);}finally{fs.rmSync(f.directory,{recursive:true,force:true});}
});
test('YouTube release check refuses missing config, web credentials and personal token files',()=>{
 const {checkRelease}=require('../scripts/check-release.cjs');const f=fixture();
 try{
  assert.ok(checkRelease(f.directory,{youtube:true}).some(s=>s.includes('Desktop OAuth')));
  fs.writeFileSync(path.join(f.directory,'youtube-client.json'),JSON.stringify({web:{client_id:'real.apps.googleusercontent.com'}}));
  assert.ok(checkRelease(f.directory,{youtube:true}).some(s=>s.includes('Desktop OAuth')));
  fs.writeFileSync(path.join(f.directory,'youtube-client.json'),JSON.stringify({installed:{client_id:'123456789-real.apps.googleusercontent.com'}}));
  assert.equal(checkRelease(f.directory,{youtube:true}).some(s=>s.includes('Desktop OAuth')),false);
  fs.writeFileSync(path.join(f.directory,'youtube-account.bin'),'private');
  assert.ok(checkRelease(f.directory).some(s=>s.includes('Personal data')));
 }finally{fs.rmSync(f.directory,{recursive:true,force:true});}
});

test('latency follows resolution and blocks unsupported changes before restarting encoding',async()=>{for(const quality of [720,1080,1440,2160]){const f=apiFixture(),s=new YouTubeSession(f,'ffmpeg',()=>{},undefined,f.spawn);try{await s.start(quality,0,30,{title:'Test',madeForKids:false});assert.equal(f.calls[0].body.contentDetails.latencyPreference,quality===2160?'normal':quality===1440?'low':'ultraLow');if(quality<=1080)await assert.rejects(s.reconfigure(1440,0,30),/ERR_4K_RESTART/);if(quality<2160)await assert.rejects(s.reconfigure(2160,0,30),/ERR_4K_RESTART/);else await s.reconfigure(2160,0,60);}finally{await s.stop();}}});
test('encoder reconnect reuses the existing broadcast and ends cleanly',async()=>{const f=apiFixture(),events=[],s=new YouTubeSession(f,'ffmpeg',x=>events.push(x),undefined,f.spawn);try{await s.start(720,0,30,{title:'Test',madeForKids:false});s.requestReconnect();s.requestReconnect();assert.equal(events.filter(x=>x.state==='reconnecting').length,1);await s.write(Buffer.from('discard obsolete recorder data'));await s.reconfigure(720,0,30);assert.equal(s.recovering,false);assert.equal(f.spawns(),2);assert.equal(f.calls.filter(x=>x.resource==='liveBroadcasts'&&x.body).length,1);assert.equal(s.url,'https://www.youtube.com/watch?v=broadcast-id');}finally{await s.stop();}s.requestReconnect();assert.equal(events.filter(x=>x.state==='reconnecting').length,1);});
test('selected latency reaches YouTube and controls live quality limits',async()=>{for(const latency of ['ultraLow','low','normal']){const f=apiFixture(),s=new YouTubeSession(f,'ffmpeg',()=>{},undefined,f.spawn);try{await s.start(720,0,30,{title:'Test',madeForKids:false,latency});assert.equal(f.calls[0].body.contentDetails.latencyPreference,latency);if(latency==='normal')await s.reconfigure(2160,0,30);else await assert.rejects(s.reconfigure(2160,0,30),/ERR_4K_RESTART/);}finally{await s.stop();}}const f=apiFixture(),s=new YouTubeSession(f,'ffmpeg',()=>{},undefined,f.spawn);await assert.rejects(s.start(2160,0,30,{title:'Test',madeForKids:false,latency:'ultraLow'}),/ERR_YT_LATENCY/);assert.equal(f.calls.length,0);});
