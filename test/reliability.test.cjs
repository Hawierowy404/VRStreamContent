const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createMediaServer,StreamSession}=require('../stream.cjs');
const {Diagnostics}=require('../diagnostics.cjs');
test('Playlist bytes and Content-Length agree while the encoder replaces the file',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-http-'));const file=path.join(directory,'live.m3u8');
 fs.writeFileSync(file,'#EXTM3U\n#A\n');const server=createMediaServer(directory,'token');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port+'/token/live.m3u8';let stop=false;
 const writer=(async()=>{let n=0;while(!stop){fs.writeFileSync(file+'.tmp','#EXTM3U\n#'+(n++%2?'x'.repeat(16000):'y')+'\n');try{fs.renameSync(file+'.tmp',file);}catch(error){if(!['EPERM','EBUSY','EACCES'].includes(error.code))throw error;}await new Promise(r=>setTimeout(r,1));}})();
 try{
  await Promise.all(Array.from({length:6},async()=>{for(let i=0;i<30;i++){const response=await fetch(base);const body=await response.arrayBuffer();assert.equal(response.status,200);assert.equal(body.byteLength,Number(response.headers.get('content-length')));assert.ok(Buffer.from(body).toString().startsWith('#EXTM3U\n'));}}));
 }finally{stop=true;await writer;server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.rmSync(directory,{recursive:true,force:true});}
});
test('Startup differentiates absent media from an unavailable tunnel',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-state-'));
 try{
 const s=new StreamSession(directory,'unused','unused',()=>{});s.directory=directory;s.started=Date.now()-91000;let reason;s.fail=message=>{reason=message;};
 await s.check();assert.equal(reason,'ERR_MEDIA');
 fs.writeFileSync(path.join(directory,'live.m3u8'),'#EXTM3U');await s.check();assert.equal(reason,'ERR_PUBLIC');
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
test('Stalled media warns without killing a live session and recovers',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-health-'));
 try{
 const file=path.join(directory,'live.m3u8');fs.writeFileSync(file,'#EXTM3U');fs.utimesSync(file,new Date(0),new Date(0));
 const events=[];const s=new StreamSession(directory,'unused','unused',e=>events.push(e));s.directory=directory;s.ready=true;s.url='test';s.lastWrite=Date.now();
 await s.check();assert.equal(events[0].message,'WARN_STALLED');assert.equal(s.stopped,false);
 s.publicBase='https://test.trycloudflare.com';s.connected=true;s.token='test';s.verify=async()=>({dnsFallback:false});fs.utimesSync(file,new Date(),new Date());await s.check();assert.equal(events[1].state,'live');
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
test('Diagnostic output hides stream URLs and local paths',()=>{
 const d=new Diagnostics();d.add('test','https://example.trycloudflare.com/'+ 'a'.repeat(48)+'/live.m3u8');d.add('test','C:\\Users\\PrivateName\\secret.txt');
 assert.ok(!d.text().includes('PrivateName'));assert.ok(!d.text().includes('example.trycloudflare'));assert.ok(!d.text().includes('a'.repeat(48)));
 for(let i=0;i<200;i++)d.add('test',i);assert.equal(d.lines.length,160);
});

