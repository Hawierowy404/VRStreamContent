const {app,BrowserWindow,ipcMain}=require('electron'),fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert/strict');
const {StreamSession,createMediaServer}=require('../stream.cjs'),{HlsTimeline}=require('../hls-timeline.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-live-capture-'));app.setPath('userData',path.join(root,'profile'));
let session,win,timer;
app.whenReady().then(async()=>{
 const directory=path.join(root,'media');fs.mkdirSync(directory);
 session=new StreamSession(root,require('ffmpeg-static'),'unused',s=>{if(s.state==='error')throw Error(s.message);});
 Object.assign(session,{directory,timeline:new HlsTimeline(directory),prefix:'r0-',generation:0});
 session.server=createMediaServer(directory,'test',()=>{session.timeline.ingest(session.prefix);return session.timeline.render();});
 await new Promise(r=>session.server.listen(0,'127.0.0.1',r));session.spawnEncoder(480,0,15);
 ipcMain.handle('chunk',(_,data)=>session.write(data));ipcMain.handle('change',()=>session.reconfigure(720,0,60));
 ipcMain.handle('finish',async(_,result)=>{
  clearInterval(timer);
  try{assert.ok(!result.error,result.error);assert.equal(result.stats.fps,60);assert.equal(result.stats.height,720);assert.ok(result.stats.frames>420);
   await session.reconfigure(480,0,15);
   const playlist=session.timeline.render();assert.match(playlist,/#EXT-X-DISCONTINUITY\n/);assert.match(playlist,/r1-segment/);
   console.log('PASS real Electron recorder restart, AudioWorklet PCM, minimized window, SD15 to HD60, continuous HLS: '+JSON.stringify(result.stats));
   await session.stop();app.exit(0);
  }catch(error){console.error(error);await session.stop();app.exit(1);}
 });
 win=new BrowserWindow({show:false,webPreferences:{preload:path.join(__dirname,'live-capture-preload.cjs'),sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}});
 let position=0;timer=setInterval(()=>{const samples=new Float32Array(960);for(let i=0;i<480;i++){samples[i*2]=samples[i*2+1]=0.04*Math.sin(2*Math.PI*440*(position++)/48000);}if(!win.isDestroyed())win.webContents.send('samples',new Uint8Array(samples.buffer));},10);
 await win.loadFile(path.join(__dirname,'live-capture.html'));
});
setTimeout(async()=>{clearInterval(timer);console.error('live capture timeout');await session?.stop();app.exit(1);},40000).unref();
