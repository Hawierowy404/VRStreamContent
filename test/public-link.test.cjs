const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),os=require('os');
const {verifyPublicStream}=require('../public-check.cjs'),{StreamSession,createMediaServer}=require('../stream.cjs');
const segment=Buffer.alloc(600);segment[0]=segment[188]=segment[376]=0x47;
const playlist=Buffer.from('#EXTM3U\n#EXTINF:1,\nr0-segment000001.ts\n');
test('Public readiness requires both playlist and real media bytes',async()=>{
 let count=0;assert.deepEqual(await verifyPublicStream('https://test.trycloudflare.com/token/live.m3u8',{read:async()=>++count===1?playlist:segment}),{dnsFallback:false,segment:'r0-segment000001.ts'});assert.equal(count,2);
 await assert.rejects(verifyPublicStream('https://test.trycloudflare.com/token/live.m3u8',{read:async()=>Buffer.from('<html>Cloudflare error</html>')}),/INVALID_PLAYLIST/);
 let n=0;await assert.rejects(verifyPublicStream('https://test.trycloudflare.com/token/live.m3u8',{read:async()=>++n===1?playlist:Buffer.from('not video')}),/INVALID_SEGMENT/);
});
test('DNS fallback reports local DNS failure and preserves the original HTTPS hostname',async()=>{
 let calls=0;const lookup=()=>{};
 const result=await verifyPublicStream('https://test.trycloudflare.com/token/live.m3u8',{resolve:async host=>{assert.equal(host,'test.trycloudflare.com');return lookup;},read:async(url,options)=>{
  assert.ok(url.startsWith('https://test.trycloudflare.com/token/'));if(++calls===1)throw Object.assign(Error('DNS'),{code:'ENOTFOUND'});assert.equal(options.lookup,lookup);return calls===2?playlist:segment;
 }});assert.equal(result.dnsFallback,true);
});
test('Unavailable public link keeps recording, retries, and only then announces live',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-public-state-'));
 try{
  fs.writeFileSync(path.join(dir,'live.m3u8'),playlist);const events=[];const s=new StreamSession(dir,'unused','unused',e=>events.push(e));
  Object.assign(s,{directory:dir,publicBase:'https://test.trycloudflare.com',token:'test',connected:true,started:Date.now()-45000,verify:async()=>{throw Object.assign(Error('HTTP_530'),{code:'HTTP_530'});}});
  await s.check();assert.equal(s.ready,false);assert.equal(s.stopped,false);assert.equal(events.at(-1).state,'checking');
  s.nextProbe=0;s.verify=async()=>({dnsFallback:true});await s.check();assert.equal(s.ready,false);assert.equal(events.at(-1).state,'checking');assert.equal(events.at(-1).message,'WARN_PUBLIC_DNS');
  s.nextProbe=0;s.verify=async()=>({dnsFallback:false});await s.check();assert.equal(s.ready,true);assert.equal(events.at(-1).state,'live');
  s.nextProbe=0;s.verify=async()=>{throw Error('network');};await s.check();assert.equal(s.ready,false);assert.equal(s.stopped,false);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Browser preview assets are served under the same private stream path',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-watch-'));const server=createMediaServer(dir,'test');await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{for(const file of ['watch','player.js','player.css','hls.js','logo.png']){const response=await fetch(base+'/test/'+file);assert.equal(response.status,200,file);assert.ok((await response.arrayBuffer()).byteLength>50);assert.ok(response.headers.get('content-security-policy'));}
 assert.equal((await fetch(base+'/wrong/watch')).status,404);
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});}
});

