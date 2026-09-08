const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const ffmpeg=require('ffmpeg-static'),settings=require('../video-settings.js'),{encodingArgs,StreamSession}=require('../stream.cjs');
function run(args,input){const p=spawnSync(ffmpeg,['-hide_banner',...args],{windowsHide:true,input,maxBuffer:32*1024*1024,timeout:60000});assert.equal(p.status,0,p.stderr?.toString()||p.error?.message);return p;}
test('All 15 resolution/FPS combinations produce H264 at the requested size and frame rate',()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-presets-'));
 try{
  const input=run(['-loglevel','error','-f','lavfi','-i','color=blue:size=320x180:rate=30:duration=2.2','-c:v','libvpx','-deadline','realtime','-f','webm','pipe:1']).stdout;
  for(const height of [480,720,1080,1440,2160])for(const fps of [15,30,60]){
   const out=path.join(directory,height+'-'+fps);fs.mkdirSync(out);
   run(encodingArgs(out,String(height),0,fps),input);
   const result=run(['-i',path.join(out,'live.m3u8'),'-frames:v','1','-f','null','-']).stderr.toString();
   const profile=settings.resolve(height,fps);
   assert.ok(result.includes(profile.width+'x'+profile.height),result);
   assert.ok(result.includes(fps+' fps'),result);
  }
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
test('Invalid resolution and FPS cannot reach the encoder',()=>{for(const [h,f] of [[360,30],[720,24],[0,60],[1440,Infinity],['bad',30]])assert.throws(()=>settings.resolve(h,f),/ERR_SETTINGS/);});
