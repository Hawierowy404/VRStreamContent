const fs=require('node:fs'),path=require('node:path');
class HlsTimeline {
 constructor(directory){this.directory=directory;this.items=[];this.seen=new Set();this.lastSegment=new Map();this.next=0;this.discontinuitySequence=0;this.lastGeneration=null;this.updated=0;}
 ingest(prefix){
  let text;try{text=fs.readFileSync(path.join(this.directory,prefix+'live.m3u8'),'utf8');}catch{return;}
  const pattern=/#EXTINF:([\d.]+),[^\n]*\n([^\r\n]+)/g;let match;
  while((match=pattern.exec(text))){
   const name=match[2];if(!new RegExp('^'+prefix+'segment[0-9]+\\.ts$').test(name)||this.seen.has(name))continue;
   const index=Number(name.match(/segment([0-9]+)\.ts$/)[1]);
   if(index<=(this.lastSegment.get(prefix)??-1))continue;
   this.lastSegment.set(prefix,index);
   this.seen.add(name);
   const discontinuity=this.lastGeneration!==null&&this.lastGeneration!==prefix;
   this.items.push({name,duration:Number(match[1]),sequence:this.next++,discontinuity});
   this.lastGeneration=prefix;this.updated=Date.now();
  }
  while(this.items.length>6){const removed=this.items.shift();this.seen.delete(removed.name);if(removed.discontinuity)this.discontinuitySequence++;}
 }
 render(){
  if(!this.items.length)return null;
  return '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:'+2+'\n#EXT-X-MEDIA-SEQUENCE:'+this.items[0].sequence+'\n#EXT-X-DISCONTINUITY-SEQUENCE:'+this.discontinuitySequence+'\n#EXT-X-INDEPENDENT-SEGMENTS\n'+this.items.map(s=>(s.discontinuity?'#EXT-X-DISCONTINUITY\n':'')+'#EXTINF:'+s.duration.toFixed(6)+',\n'+s.name+'\n').join('');
 }
 prune(prefix){
  const retained=new Set(this.items.map(s=>s.name));
  for(const name of fs.readdirSync(this.directory)){
   if(!/^r\d+-(?:segment\d+\.ts|live\.m3u8)$/.test(name)||name.startsWith(prefix)||retained.has(name))continue;
   const file=path.join(this.directory,name);try{if(Date.now()-fs.statSync(file).mtimeMs>60000){fs.unlinkSync(file);this.seen.delete(name);}}catch{}
  }
 }
}
module.exports={HlsTimeline};
