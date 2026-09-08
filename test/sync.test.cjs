const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const ffmpeg=require('ffmpeg-static');
const {encodingArgs}=require('../stream.cjs');
function run(args,input){const p=spawnSync(ffmpeg,['-hide_banner','-loglevel','error',...args],{windowsHide:true,input,maxBuffer:64*1024*1024,timeout:60000});assert.equal(p.status,0,p.stderr?.toString()||p.error?.message);return p.stdout;}
function groups(times){return times.filter((time,i)=>i===0||time-times[i-1]>.4);}
test('A/V timestamps remain aligned across an audio timestamp gap and signed manual correction',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-sync-'));
 try{
 const input=run(['-f','lavfi','-i',"color=black:size=320x180:rate=30:duration=10,drawbox=color=white:t=fill:enable='between(t,2,2.2)+between(t,7.5,7.7)'",
 '-f','lavfi','-i',"aevalsrc=if(between(t\\,2\\,2.2)+between(t\\,7\\,7.2)\\,0.5*sin(2*PI*880*t)\\,0):s=48000:d=10",
 '-af',"asetpts=PTS+gte(T\\,4)*0.5/TB",'-c:v','libvpx','-deadline','realtime','-c:a','libopus','-f','webm','pipe:1']);
 for(const offset of [0,500,-500]){
  const out=path.join(dir,String(offset));fs.mkdirSync(out);
  // This ten-second fixture needs both flashes. Retain its complete recording
  // instead of the shorter production live window.
  const args=encodingArgs(out,'720',offset);args[args.indexOf('-hls_list_size')+1]='0';
  run(args,input);
  const playlist=path.join(out,'live.m3u8');
  const video=run(['-i',playlist,'-an','-vf','scale=16:16','-pix_fmt','gray','-f','rawvideo','pipe:1']);
  const audio=run(['-i',playlist,'-vn','-ac','1','-ar','48000','-f','s16le','pipe:1']);
  const flashes=[],tones=[];
  for(let i=0;i<video.length;i+=256){if(video[i]>200)flashes.push(i/256/30);}
  for(let i=0;i+1<audio.length;i+=2){if(Math.abs(audio.readInt16LE(i))>5000)tones.push(i/2/48000);}
  const v=groups(flashes),a=groups(tones);assert.equal(v.length,2);assert.equal(a.length,2);
  for(let i=0;i<2;i++)assert.ok(Math.abs((a[i]-v[i])-offset/1000)<.12,JSON.stringify({offset,flash:v[i],tone:a[i]}));
 }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('All four languages cover the same strings',()=>{
 const translations=require('../i18n.js'),keys=Object.keys(translations.en).sort();
 for(const lang of ['pl','en','ru','ja']){assert.deepEqual(Object.keys(translations[lang]).sort(),keys);for(const value of Object.values(translations[lang]))assert.ok(typeof value==='string'&&value.length>0);}
});
test('Manual correction rejects invalid values',()=>{for(const offset of [NaN,Infinity,-10001,10001,'bad'])assert.throws(()=>encodingArgs('unused','720',offset),/INVALID_OFFSET/);});
