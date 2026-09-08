const {spawn}=require('node:child_process');
const {encodingArgs}=require('./stream.cjs');
function youtubeArgs(destination,quality,offset,fps){
 const args=encodingArgs('.',quality,offset,fps);args.splice(args.indexOf('-f',args.indexOf('-c:a')),Infinity,'-f','flv','-flvflags','no_duration_filesize',destination);
 args.splice(args.length-1,0,'-rw_timeout','15000000');
 args[args.indexOf('-g')+1]=String(Number(fps)*2);args[args.indexOf('-keyint_min')+1]=String(Number(fps)*2);
 return args;
}
function ingestUrl(stream){const info=stream?.cdn?.ingestionInfo;
 let u;try{u=new URL(info?.rtmpsIngestionAddress);}catch{throw Error('ERR_YT_INGEST');}
 if(u.protocol!=='rtmps:'||!/(^|\.)rtmps?\.youtube\.com$/.test(u.hostname)||u.username||u.password||u.search||u.hash||(u.port&&u.port!=='443')||!/^\/live2\/?$/.test(u.pathname)||typeof info.streamName!=='string'||!info.streamName||/[\s/?#]/.test(info.streamName))throw Error('ERR_YT_INGEST');
 return u.href.replace(/\/$/,'')+'/'+info.streamName;
}
class YouTubeSession {
 constructor(youtube,ffmpeg,onStatus,diagnostics={add(){}},spawnProcess=spawn){Object.assign(this,{youtube,ffmpeg,onStatus,diagnostics,spawnProcess});this.stopped=false;this.ready=false;this.failures=0;}
 start(q,offset=0,fps=30,options={}){this.startPromise=this.prepare(q,offset,fps,options);return this.startPromise;}
 async prepare(q,offset,fps,options){
  youtubeArgs('rtmps://a.rtmp.youtube.com/live2/test',q,offset,fps);
  if(!options.title?.trim()||options.title.length>100||typeof options.madeForKids!=='boolean')throw Error('ERR_YT_DETAILS');
  const latency=require('./youtube-latency.js').resolve(q,options.latency);
  this.started=Date.now();this.normalLatency=latency==='normal';this.ultraLatency=latency==='ultraLow';
  const b=await this.youtube.api('liveBroadcasts',{part:'id,snippet,status,contentDetails'},{snippet:{title:options.title.trim(),scheduledStartTime:new Date(Date.now()+60000).toISOString()},status:{privacyStatus:'unlisted',selfDeclaredMadeForKids:options.madeForKids},contentDetails:{enableAutoStart:true,enableAutoStop:false,enableDvr:false,latencyPreference:latency,monitorStream:{enableMonitorStream:false}}});
  this.broadcast=b.id;if(!this.broadcast||b.status?.privacyStatus!=='unlisted')throw Error('ERR_YT_PRIVACY');
  if(this.stopped)return;
  const s=await this.youtube.api('liveStreams',{part:'id,snippet,cdn,contentDetails'},{snippet:{title:options.title.trim()},cdn:{ingestionType:'rtmp',resolution:'variable',frameRate:'variable'},contentDetails:{isReusable:false}});
  this.streamId=s.id;try{this.destination=ingestUrl(s);}catch(error){this.diagnostics.add('youtube-ingest',error.message);throw error;}if(this.stopped)return;
  await this.youtube.api('liveBroadcasts/bind',{part:'id',id:this.broadcast,streamId:this.streamId},{ });if(this.stopped)return;
  this.url='https://www.youtube.com/watch?v='+encodeURIComponent(this.broadcast);
  this.onStatus({state:'link',url:this.url,message:'ytWaiting'});
  this.spawnEncoder(q,offset,fps);
  this.timer=setInterval(()=>{this.check().catch(error=>this.fail(error.message));},5000);
 }
 spawnEncoder(q,offset,fps){
  const e=this.encoder=this.spawnProcess(this.ffmpeg,youtubeArgs(this.destination,q,offset,fps),{windowsHide:true,stdio:['pipe','pipe','pipe']});
  e.stdin.on('error',()=>{if(!e.expectedExit)this.requestReconnect();});
  e.on('error',()=>this.requestReconnect());
  // FFmpeg errors may contain the private ingest key: never log its stderr.
  e.stderr.on('data',()=>{});e.stdout.on('data',require('./encoder-progress.cjs').progressReader(event=>this.onStatus(event)));
  e.on('exit',()=>{if(!e.expectedExit&&!this.stopped)this.requestReconnect();});
 }
 requestReconnect(){if(this.stopped||this.recovering)return;this.recovering=true;this.ready=false;this.onStatus({state:'reconnecting',message:'reconnectingLive'});}
 async check(){if(this.stopped||this.checking||this.recovering)return;this.checking=true;
  try{const result=await this.youtube.api('liveBroadcasts',{part:'status',id:this.broadcast});if(this.stopped)return;
   const b=result.items?.[0];if(!b)throw Error('ERR_YT_API');
   if(b.status.privacyStatus!=='unlisted')throw Error('ERR_YT_PRIVACY');
   if(b.status.lifeCycleStatus==='live'){this.ready=true;this.onStatus({state:'live',url:this.url});}
   else if(['complete','revoked'].includes(b.status.lifeCycleStatus))throw Error('ERR_YT_ENDED');
   else if(Date.now()-this.started>180000)throw Error('ERR_YT_TIMEOUT');
   this.failures=0;
  }catch(e){if(e.message==='ERR_YT_NETWORK'&&this.failures<12){this.failures++;this.onStatus({state:'warning',message:'WARN_CONNECTION'});}else if(++this.failures>=3||!['ERR_YT_NETWORK','ERR_YT_API'].includes(e.message))throw e;}
  finally{this.checking=false;}
 }
 async write(data){if(this.recovering&&!this.stopped)return;if(this.stopped||!this.encoder?.stdin.writable)throw Error('ERR_STOPPED');if(data.byteLength>16*1024*1024)throw Error('ERR_CHUNK');
  await new Promise((resolve,reject)=>this.encoder.stdin.write(Buffer.from(data),error=>error?(this.requestReconnect(),resolve()):resolve()));}
 async reconfigure(q,offset,fps){if((Number(q)===2160&&!this.normalLatency)||(Number(q)>1080&&this.ultraLatency))throw Error('ERR_4K_RESTART');youtubeArgs(this.destination,q,offset,fps);if(this.stopped||this.reconfiguring)throw Error('ERR_STOPPED');this.reconfiguring=true;
  try{await this.endEncoder();if(this.stopped)throw Error('ERR_STOPPED');this.recovering=false;this.started=Date.now();this.spawnEncoder(q,offset,fps);}finally{this.reconfiguring=false;}}
 async endEncoder(){const e=this.encoder;if(!e||e.exitCode!==null||!e.pid)return;e.expectedExit=true;
  await new Promise(resolve=>{const timer=setTimeout(()=>{e.kill();resolve();},3000);e.once('exit',()=>{clearTimeout(timer);resolve();});e.stdin.end();});}
 fail(message){if(this.stopped)return;this.onStatus({state:'error',message});void this.stop();}
 stop(){if(this.stopPromise)return this.stopPromise;this.stopped=true;this.ready=false;clearInterval(this.timer);
  this.stopPromise=(async()=>{
   await this.startPromise?.catch(()=>{});await this.endEncoder();
   if(!this.broadcast)return;
   try{const result=await this.youtube.api('liveBroadcasts',{part:'status',id:this.broadcast});const state=result.items?.[0]?.status.lifeCycleStatus;
    if(['live','testing'].includes(state))await this.youtube.api('liveBroadcasts/transition',{part:'status',id:this.broadcast,broadcastStatus:'complete'},{});
    else if(state&&state!=='complete')await this.youtube.api('liveBroadcasts',{id:this.broadcast},undefined,'DELETE');
    if(this.streamId)await this.youtube.api('liveStreams',{id:this.streamId},undefined,'DELETE');
   }catch{this.stopFailed=true;this.onStatus({state:'warning',message:'ERR_YT_STOP'});this.diagnostics.add('youtube-stop','ERR_YT_STOP');}
  })();return this.stopPromise;}
}
module.exports={YouTubeSession,youtubeArgs,ingestUrl};
