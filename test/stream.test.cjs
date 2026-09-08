const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {createMediaServer,encodingArgs}=require('../stream.cjs');
test('Serwer publikuje tylko pliki transmisji pod nieprzewidywalnym adresem',async()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrshare-test-'));
  fs.writeFileSync(path.join(directory,'live.m3u8'),'#EXTM3U\n');
  fs.writeFileSync(path.join(directory,'secret.txt'),'private');
  const server=createMediaServer(directory,'abc123');
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const response=await fetch(base+'/abc123/live.m3u8');assert.equal(response.status,200);assert.equal(await response.text(),'#EXTM3U\n');
    assert.equal(response.headers.get('cache-control'),'no-store');
    for(const route of ['/live.m3u8','/wrong/live.m3u8','/abc123/secret.txt','/abc123/segment999.ts','/abc123/%2e%2e/secret.txt'])assert.equal((await fetch(base+route)).status,404);
    assert.equal((await fetch(base+'/abc123/live.m3u8',{method:'POST'})).status,404);
    const head=await fetch(base+'/abc123/live.m3u8',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.rmSync(directory,{recursive:true,force:true});}
});
test('Rzeczywisty WebM z obrazem i dźwiękiem jest kodowany do HLS H264/AAC',async()=>{
  const ffmpeg=require('ffmpeg-static');
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'vrshare-encode-'));
  const encoder=spawn(ffmpeg,encodingArgs(directory),{windowsHide:true});
  const producer=spawn(ffmpeg,['-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=size=640x360:rate=30','-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','9','-c:v','libvpx','-deadline','realtime','-c:a','libopus','-f','webm','pipe:1'],{windowsHide:true});
  producer.stdout.pipe(encoder.stdin);let log='';encoder.stderr.on('data',d=>log+=d);producer.stderr.on('data',d=>log+=d);
  const finished=p=>new Promise((resolve,reject)=>{p.once('error',reject);p.once('close',resolve);});
  try{const codes=await Promise.all([finished(producer),finished(encoder)]);assert.deepEqual(codes,[0,0],log);
    const playlist=fs.readFileSync(path.join(directory,'live.m3u8'),'utf8');assert.match(playlist,/#EXTM3U/);assert.match(playlist,/segment\d+\.ts/);
    const segment=fs.readdirSync(directory).find(x=>x.endsWith('.ts'));
    const probe=spawn(ffmpeg,['-hide_banner','-i',path.join(directory,segment),'-f','null','-'],{windowsHide:true});let info='';probe.stderr.on('data',d=>info+=d);assert.equal(await finished(probe),0);assert.match(info,/Video: h264/);assert.match(info,/Audio: aac/);
  }finally{producer.kill();encoder.kill();fs.rmSync(directory,{recursive:true,force:true});}
});
