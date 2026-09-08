const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {gzipSync}=require('node:zlib');
const {spawn} = require('node:child_process');
const {verifyPublicStream}=require('./public-check.cjs');
const {HlsTimeline}=require('./hls-timeline.cjs');
const {launchTunnel}=require('./tunnel.cjs');
const VideoSettings=require('./video-settings.js');

function encodingArgs(directory, quality='720', audioOffset=0, fps=30, prefix='') {
  const profile=VideoSettings.resolve(quality,fps);const height=profile.height;fps=profile.fps;
  const offset=Number(audioOffset);
  if(!Number.isFinite(offset)||Math.abs(offset)>10000)throw Error('INVALID_OFFSET');
  // Keep both tracks on the input timeline. Do not independently reset STARTPTS.
  // A negative audio correction delays video; a positive one delays audio.
  const videoDelay=offset<0?`setpts=PTS+${-offset/1000}/TB,`:'';
  const audioDelay=offset>0?`,adelay=${Math.round(offset)}:all=1`:'';
  return ['-hide_banner','-loglevel','warning','-progress','pipe:1','-nostats','-fflags','+genpts','-probesize','1048576','-analyzeduration','500000','-f','webm','-i','pipe:0',
    '-map','0:v:0','-map','0:a:0?','-vf',`${videoDelay}fps=${fps}:start_time=0,scale=-2:${height}:force_original_aspect_ratio=decrease,pad=ceil(iw/2)*2:ceil(ih/2)*2`,
    '-af',`aresample=48000:async=1000:min_hard_comp=0.100:first_pts=0${audioDelay}`,
    '-fps_mode','cfr','-c:v','libx264','-preset','ultrafast','-tune','zerolatency','-pix_fmt','yuv420p',
    '-b:v',String(profile.bitrate),'-maxrate',String(profile.maxrate),'-bufsize',String(profile.bufsize),
    '-g',String(fps),'-keyint_min',String(fps),'-sc_threshold','0','-c:a','aac','-b:a','160k','-ar','48000',
    '-f','hls','-hls_time','1','-hls_list_size','6','-hls_delete_threshold','12',
    '-hls_flags','delete_segments+independent_segments+temp_file',
    '-hls_segment_filename',path.join(directory,prefix+'segment%06d.ts'),path.join(directory,prefix+'live.m3u8')];
}
function createMediaServer(directory,token,playlist){
  return http.createServer((req,res)=>{
    const page=(req.url||'').split('?')[0].match(new RegExp('^/'+token+'/(watch|player\\.js|player\\.css|hls\\.js|logo\\.png)$'));
    if(page&&['GET','HEAD'].includes(req.method)){
      const assets={
        watch:[path.join(__dirname,'watch','index.html'),'text/html; charset=utf-8'],
        'player.js':[path.join(__dirname,'watch','player.js'),'application/javascript; charset=utf-8'],
        'player.css':[path.join(__dirname,'watch','player.css'),'text/css; charset=utf-8'],
        'hls.js':[path.join(__dirname,'node_modules','hls.js','dist','hls.min.js'),'application/javascript'],
        'logo.png':[path.join(__dirname,'assets','logo.png'),'image/png']
      };
      const [file,type]=assets[page[1]];
      fs.readFile(file,(error,bytes)=>{if(error){res.writeHead(404);return res.end();}if(res.destroyed)return;
        const compressed=/\bgzip\b/.test(req.headers['accept-encoding']||'')&&/javascript|text\//.test(type);
        if(compressed)bytes=gzipSync(bytes);
        if(compressed)res.setHeader('Content-Encoding','gzip');
        res.setHeader('Vary','Accept-Encoding');
        res.writeHead(200,{'Content-Type':type,'Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'"});
        res.end(req.method==='HEAD'?undefined:bytes);
      });return;
    }


    const match=(req.url||'').split('?')[0].match(new RegExp('^/'+token+'/(live\\.m3u8|(?:r[0-9]+-)?segment[0-9]+\\.ts)$'));
    if(!match||!['GET','HEAD'].includes(req.method)){res.writeHead(404);return res.end();}
    const file=path.join(directory,match[1]);
    const headers=(length,type)=>({'Content-Type':type,'Content-Length':length,'Cache-Control':'no-store','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'});
    if(file.endsWith('.m3u8')){
      if(playlist){const text=playlist();if(!text){res.writeHead(404);return res.end();}const bytes=Buffer.from(text);res.writeHead(200,headers(bytes.length,'application/vnd.apple.mpegurl'));res.end(req.method==='HEAD'?undefined:bytes);return;}
      // The encoder atomically replaces playlists. Derive Content-Length from
      // the bytes we actually send, not a stat of a previous playlist version.
      fs.readFile(file,(error,bytes)=>{
        if(res.destroyed)return;
        if(error){res.writeHead(404);return res.end();}
        res.writeHead(200,headers(bytes.length,'application/vnd.apple.mpegurl'));
        res.end(req.method==='HEAD'?undefined:bytes);
      });
      return;
    }
    fs.open(file,'r',(error,fd)=>{
      if(error){if(!res.destroyed){res.writeHead(404);res.end();}return;}
      fs.fstat(fd,(error,stat)=>{
        if(error||!stat.isFile()||res.destroyed){fs.close(fd,()=>{});if(!res.destroyed){res.writeHead(404);res.end();}return;}
        res.writeHead(200,headers(stat.size,'video/mp2t'));
        if(req.method==='HEAD'){fs.close(fd,()=>{});return res.end();}
        const input=fs.createReadStream(file,{fd,autoClose:true});
        input.on('error',()=>res.destroy());res.on('close',()=>input.destroy());input.pipe(res);
      });
    });
  });
}

class StreamSession {
  constructor(root,ffmpeg,tunnel,onStatus,diagnostics={add(){}}){Object.assign(this,{root,ffmpeg,tunnel,onStatus,diagnostics});this.stopped=false;this.bytes=0;}
  async start(quality,audioOffset=0,fps=30){
    encodingArgs('placeholder',quality,audioOffset,fps); // Validate before starting any resources.
    this.token=crypto.randomBytes(24).toString('hex');
    this.directory=fs.mkdtempSync(path.join(this.root,'stream-'));
    this.diagnostics.add('start',JSON.stringify({quality,audioOffset,fps}));
    this.timeline=new HlsTimeline(this.directory);this.generation=0;this.prefix='r0-';
    this.server=createMediaServer(this.directory,this.token,()=>{this.timeline.ingest(this.prefix);return this.timeline.render();});
    await new Promise((resolve,reject)=>{this.server.once('error',reject);this.server.listen(0,'127.0.0.1',resolve);});
    this.spawnEncoder(quality,audioOffset,fps);
    const port=this.server.address().port;
    this.startTunnel(port);
    this.started=Date.now();this.lastWrite=this.started;
    this.timer=setInterval(()=>this.check().catch(error=>this.diagnostics.add('health-error',error.message)),500);
  }
  startTunnel(port){
    this.proxy=launchTunnel({port,root:this.root,cloudflared:this.tunnel,diagnostics:this.diagnostics,
      onAddress:address=>{if(this.stopped)return;this.publicBase=address;this.url=address+'/'+this.token+'/live.m3u8';this.ready=false;this.nextProbe=0;this.onStatus({state:'link',url:this.url});},
      onConnected:()=>{this.connected=true;this.nextProbe=0;},
      onLost:()=>{
        if(this.stopped)return;
        this.connected=false;this.ready=false;this.publicBase=null;this.url=null;
        this.onStatus({state:'checking',message:'WARN_CONNECTION'});
        if((this.reconnects||0)>=3){this.fail('ERR_TUNNEL');return;}
        this.reconnects=(this.reconnects||0)+1;
        this.reconnectTimer=setTimeout(()=>{if(!this.stopped)this.startTunnel(port);},2000);
      }
    });
  }
  spawnEncoder(quality,audioOffset,fps){
    const encoder=this.encoder=spawn(this.ffmpeg,encodingArgs(this.directory,quality,audioOffset,fps,this.prefix),{windowsHide:true,stdio:['pipe','pipe','pipe']});
    encoder.stdin.on('error',error=>{if(!this.stopped&&!encoder.expectedExit){this.diagnostics.add('encoder-input-error',error.message);this.fail('ERR_ENCODER');}});
    encoder.on('error',error=>{this.diagnostics.add('encoder-error',error.message);this.fail('ERR_ENCODER');});
    encoder.stderr.on('data',data=>this.diagnostics.add('encoder',data.toString()));
    encoder.stdout.on('data',require('./encoder-progress.cjs').progressReader(event=>this.onStatus(event)));
    encoder.stdout.on('data',data=>{
      const now=Date.now();if(!this.lastProgressLog||now-this.lastProgressLog>10000){this.diagnostics.add('encoder-progress',data.toString().trim());this.lastProgressLog=now;}
    });
    encoder.on('exit',(code,signal)=>{this.diagnostics.add('encoder-exit',JSON.stringify({code,signal}));if(!this.stopped&&!encoder.expectedExit)this.fail('ERR_ENCODER');});
  }
  async reconfigure(quality,audioOffset=0,fps=30){
    encodingArgs('placeholder',quality,audioOffset,fps);
    if(this.stopped||this.reconfiguring)throw Error('ERR_STOPPED');
    this.reconfiguring=true;
    try{
      const old=this.encoder;old.expectedExit=true;
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>{old.kill();reject(Error('ERR_ENCODER'));},10000);
        old.once('exit',()=>{clearTimeout(timeout);resolve();});old.stdin.end();
      });
      this.timeline.ingest(this.prefix);
      if(this.stopped)throw Error('ERR_STOPPED');
      this.prefix='r'+(++this.generation)+'-';
      this.spawnEncoder(quality,audioOffset,fps);this.lastWrite=Date.now();
      this.diagnostics.add('quality-changed',JSON.stringify({quality,fps}));
    }finally{this.reconfiguring=false;}
  }

  async check(){
    if(this.stopped||this.checking)return;
    let media=null;
    if(this.timeline){this.timeline.ingest(this.prefix);this.timeline.prune(this.prefix);if(this.timeline.items.length)media={mtimeMs:this.timeline.updated};}
    else{try{media=fs.statSync(path.join(this.directory,'live.m3u8'));}catch{}}
    const now=Date.now(),stale=!media||now-media.mtimeMs>20000;
    if(media&&stale){this.ready=false;if(!this.warned){this.warned=true;this.onStatus({state:'checking',message:'WARN_STALLED'});}return;}
    if(!media){if(now-this.started>90000)this.fail('ERR_MEDIA');return;}
    if(!this.publicBase||!this.connected){
      if(now-this.started>90000&&!this.publicBase)this.fail('ERR_PUBLIC');
      return;
    }
    if(now<(this.nextProbe||0)&&!this.warned)return;
    this.url=this.publicBase+'/'+this.token+'/live.m3u8';
    this.checking=true;this.nextProbe=now+5000;const checkedUrl=this.url;
    try{
      const result=await (this.verify||verifyPublicStream)(this.url);
      if(this.stopped||this.url!==checkedUrl||!this.connected)return;
      // A scoped diagnostic DNS lookup cannot make the URL reachable in VRChat.
      if(result?.dnsFallback)throw Object.assign(Error('LOCAL_DNS_UNAVAILABLE'),{code:'ENOTFOUND'});
      this.ready=true;this.warned=false;this.dnsWarning=Boolean(result?.dnsFallback);
      this.publicFailures=0;
      this.nextProbe=Date.now()+20000;
      this.diagnostics.add('public-verified',JSON.stringify({dnsFallback:this.dnsWarning}));
      this.onStatus({state:'live',url:this.url,message:this.dnsWarning?'WARN_LOCAL_DNS':undefined});
    }catch(error){
      if(this.stopped||this.url!==checkedUrl)return;
      this.ready=false;
      const code=error.code||error.cause?.code||error.name;
      this.diagnostics.add('public-check-failed',code);
      this.onStatus({state:'checking',url:this.url,message:now-this.started<30000?'publicChecking':(code==='ENOTFOUND'||code==='EAI_AGAIN'?'WARN_PUBLIC_DNS':'WARN_PUBLIC_LINK')});
      this.publicFailures=(this.publicFailures||0)+1;
      if(this.publicFailures>=3&&this.proxy&&!this.stopped){this.publicFailures=0;this.proxy.kill();}
    }finally{this.checking=false;}
  }


  async write(data){
    if(this.stopped||!this.encoder?.stdin.writable)throw Error('ERR_STOPPED');
    if(data.byteLength>16*1024*1024)throw Error('ERR_CHUNK');
    this.bytes+=data.byteLength;this.lastWrite=Date.now();
    await new Promise((resolve,reject)=>this.encoder.stdin.write(Buffer.from(data),error=>error?reject(error):resolve()));
  }
  fail(message){if(this.stopped)return;this.diagnostics.add('failure',message);this.onStatus({state:'error',message});void this.stop();}
  stop(){
    if(this.stopPromise)return this.stopPromise;
    this.stopped=true;clearInterval(this.timer);clearTimeout(this.reconnectTimer);
    this.stopPromise=this.cleanup();return this.stopPromise;
  }
  async cleanup(){
    this.diagnostics.add('stop',JSON.stringify({bytes:this.bytes}));
    await Promise.all([this.encoder,this.proxy].filter(Boolean).map(child=>new Promise(resolve=>{
      if(child.exitCode!==null||!child.pid)return resolve();
      const timeout=setTimeout(resolve,3000);
      child.once('exit',()=>{clearTimeout(timeout);resolve();});child.kill();
    })));
    if(this.server){this.server.closeAllConnections();await new Promise(resolve=>this.server.close(resolve));}
    if(this.directory)await fs.promises.rm(this.directory,{recursive:true,force:true,maxRetries:5,retryDelay:200}).catch(error=>this.diagnostics.add('cleanup',error.code));
  }
}
module.exports={StreamSession,createMediaServer,encodingArgs};
