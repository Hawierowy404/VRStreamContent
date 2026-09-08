const {app,BrowserWindow,ipcMain}=require('electron');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {encodingArgs}=require('../stream.cjs');
const VideoSettings=require('../video-settings.js');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-capture-test-'));
app.setPath('userData',path.join(root,'profile'));
const seconds=Number(process.env.CAPTURE_TEST_SECONDS||20);
const sessions=new Map();let completed=0,failed=false;
app.on('window-all-closed',()=>{});
app.whenReady().then(()=>{
 ipcMain.handle('test-config',event=>sessions.get(event.sender.id).config);
 ipcMain.handle('test-chunk',(event,data)=>new Promise((resolve,reject)=>sessions.get(event.sender.id).encoder.stdin.write(Buffer.from(data),error=>error?reject(error):resolve())));
 ipcMain.handle('test-finish',async(event,result)=>{
  const s=sessions.get(event.sender.id);clearInterval(s.health);clearTimeout(s.minimize);
  try{
   assert.ok(!result.error,result.error);assert.ok(!result.failed,result.failed);assert.ok(result.bytes>1000);assert.ok(result.chunks>seconds);
   assert.ok(result.stats.frames>seconds*s.config.fps*0.7,JSON.stringify(result));
   assert.equal(result.stats.width,s.profile.width);assert.equal(result.stats.height,s.profile.height);
   const ended=new Promise(resolve=>s.encoder.once('exit',resolve));s.encoder.stdin.end();assert.equal(await ended,0,s.log);
   assert.ok(s.observations>=Math.floor(seconds/5)-2);assert.ok(s.lastSegment>0);
   assert.ok(!s.stalled,'HLS stopped updating while window was minimized');
   console.log('PASS capture: '+JSON.stringify({audio:s.config.audio,fps:s.config.fps,height:s.config.height,seconds,frames:result.stats.frames,chunks:result.chunks,playlistChecks:s.observations}));
  }catch(error){failed=true;console.error(error);s.encoder.kill();}
  completed++;s.win.destroy();
  if(completed===2){for(const name of ['audio','silent'])fs.rmSync(path.join(root,name),{recursive:true,force:true,maxRetries:5,retryDelay:200});app.exit(failed?1:0);}
 });
 for(const audio of [false,true]){
  const directory=path.join(root,audio?'audio':'silent');fs.mkdirSync(directory);
  const profile=VideoSettings.resolve(audio?720:480,audio?60:15);
  const encoder=spawn(require('ffmpeg-static'),encodingArgs(directory,String(profile.height),0,profile.fps),{windowsHide:true});
  const win=new BrowserWindow({show:true,width:320,height:200,webPreferences:{preload:path.join(__dirname,'capture-preload.cjs'),contextIsolation:true,sandbox:true,nodeIntegration:false,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}});
  const s={encoder,win,config:{audio,seconds,height:profile.height,fps:profile.fps},profile,log:'',observations:0,lastSegment:0,stalled:false};
  sessions.set(win.webContents.id,s);
  encoder.stderr.on('data',d=>{s.log=(s.log+d).slice(-3000);});encoder.stdout.on('data',()=>{});encoder.stdin.on('error',()=>{});
  s.minimize=setTimeout(()=>win.minimize(),2000);
  let lastMtime=0;
  s.health=setInterval(()=>{
   const file=path.join(directory,'live.m3u8');
   if(fs.existsSync(file)){const stat=fs.statSync(file);s.observations++;if(stat.mtimeMs===lastMtime)s.stalled=true;lastMtime=stat.mtimeMs;s.lastSegment=stat.size;}
  },5000);
  win.loadFile(path.join(__dirname,'capture-harness.html'));
 }
});
setTimeout(()=>{for(const s of sessions.values())s.encoder.kill();console.error('Capture test timed out');app.exit(1);},(seconds+30)*1000).unref();
