const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process');
const {HlsTimeline}=require('../hls-timeline.cjs'),{StreamSession,createMediaServer}=require('../stream.cjs');
test('Quality changes retain the HTTP endpoint and join real encoder generations with a discontinuity',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-live-test-'));
 const failures=[];const session=new StreamSession(directory,require('ffmpeg-static'),'unused',s=>{if(s.state==='error')failures.push(s);});
 session.directory=directory;session.timeline=new HlsTimeline(directory);session.generation=0;session.prefix='r0-';
 session.server=createMediaServer(directory,'test',()=>{session.timeline.ingest(session.prefix);return session.timeline.render();});
 await new Promise(r=>session.server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+session.server.address().port+'/test/live.m3u8';
 async function feed(height,fps){
  const child=spawn(require('ffmpeg-static'),['-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=size=320x180:rate='+fps,'-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','4','-c:v','libvpx','-deadline','realtime','-c:a','libopus','-f','webm','pipe:1'],{windowsHide:true});
  let errors='';child.stderr.on('data',d=>errors+=d);
  for await(const data of child.stdout)await session.write(data);
  if(child.exitCode===null)await new Promise(r=>child.once('exit',r));
  assert.equal(child.exitCode,0,errors);
 }
 try{
  session.spawnEncoder(480,0,15);await feed(480,15);await session.reconfigure(720,0,60);
  const first=await(await fetch(url)).text();assert.match(first,/r0-segment/);assert.doesNotMatch(first,/ENDLIST/);
  await feed(720,60);await session.reconfigure(1080,0,30);
  const second=await(await fetch(url)).text();assert.match(second,/#EXT-X-DISCONTINUITY\n/);assert.match(second,/r1-segment/);assert.match(second,/r0-segment/);
  const segment=second.trim().split('\n').filter(s=>s.endsWith('.ts')).at(-1);
  const response=await fetch(url.replace('live.m3u8',segment));assert.equal(response.status,200);
  const file=path.join(directory,segment);let log='';
  const probe=spawn(require('ffmpeg-static'),['-hide_banner','-i',file,'-f','null','-'],{windowsHide:true});probe.stderr.on('data',d=>log+=d);
  await new Promise(r=>probe.once('exit',r));assert.match(log,/1280x720/);assert.match(log,/60 fps/);assert.deepEqual(failures,[]);
 }finally{await session.stop();}
});
test('HLS discontinuity numbering survives a sliding window',()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-timeline-'));try{
 const timeline=new HlsTimeline(directory);
 const write=(prefix,start,count)=>{fs.writeFileSync(path.join(directory,prefix+'live.m3u8'),'#EXTM3U\n'+Array.from({length:count},(_,i)=>'#EXTINF:1,\n'+prefix+'segment'+(start+i)+'.ts\n').join(''));timeline.ingest(prefix);};
 write('r0-',0,10);write('r1-',0,10);assert.equal(timeline.items.length,6);assert.match(timeline.render(),/#EXT-X-MEDIA-SEQUENCE:14/);
 const before=timeline.render();timeline.ingest('r1-');assert.equal(timeline.render(),before,'Repeated reads must not reinsert old segments');
 write('r1-',10,12);assert.match(timeline.render(),/#EXT-X-DISCONTINUITY-SEQUENCE:1/);assert.doesNotMatch(timeline.render(),/#EXT-X-DISCONTINUITY\n/);
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
});

