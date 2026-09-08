const http=require('node:http'),https=require('node:https');
function requestBytes(url,{lookup,limit=131072,partial=false}={}){
 return new Promise((resolve,reject)=>{
  const parsed=new URL(url),client=parsed.protocol==='https:'?https:http;
  const request=client.get(parsed,{lookup,signal:AbortSignal.timeout(7000),headers:partial?{Range:'bytes=0-1023'}:{}},response=>{
   if(![200,206].includes(response.statusCode)){response.resume();const error=Error('HTTP_'+response.statusCode);error.code=error.message;return reject(error);}
   let length=0,chunks=[],settled=false;
   const done=()=>{if(settled)return;settled=true;resolve(Buffer.concat(chunks,length));};
   response.on('data',chunk=>{
    const remaining=limit-length;chunks.push(chunk.subarray(0,remaining));length+=Math.min(chunk.length,remaining);
    if(length>=limit){if(partial){done();response.destroy();}else{response.destroy();reject(Object.assign(Error('PLAYLIST_TOO_LARGE'),{code:'PLAYLIST_TOO_LARGE'}));}}
   });
   response.on('end',done);response.on('error',error=>{if(!settled)reject(error);});
  });
  request.on('error',reject);
 });
}
async function publicLookup(host){
 const response=await fetch('https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(host)+'&type=A',{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw Error('DNS_CHECK_FAILED');const data=await response.json();
 const address=data.Answer?.find(a=>a.type===1&&/^(\d{1,3}\.){3}\d{1,3}$/.test(a.data))?.data;
 if(!address)throw Object.assign(Error('DNS_NOT_READY'),{code:'ENOTFOUND'});
 return (_hostname,options,callback)=>options?.all?callback(null,[{address,family:4}]):callback(null,address,4);
}
async function verifyPublicStream(url,{read=requestBytes,resolve=publicLookup}={}){
 let lookup,dnsFallback=false,bytes;
 try{bytes=await read(url);}catch(error){
  if(!['ENOTFOUND','EAI_AGAIN'].includes(error.code)||!new URL(url).hostname.endsWith('.trycloudflare.com'))throw error;
  lookup=await resolve(new URL(url).hostname);dnsFallback=true;bytes=await read(url,{lookup});
 }
 const playlist=bytes.toString('utf8');
 if(!playlist.startsWith('#EXTM3U'))throw Object.assign(Error('INVALID_PLAYLIST'),{code:'INVALID_PLAYLIST'});
 const names=playlist.split(/\r?\n/).filter(line=>/^(?:r\d+-)?segment\d+\.ts$/.test(line));
 if(!names.length)throw Object.assign(Error('NO_SEGMENTS'),{code:'NO_SEGMENTS'});
 const segment=await read(new URL(names.at(-1),url).href,{lookup,limit:1024,partial:true});
 if(segment.length<377||segment[0]!==0x47||segment[188]!==0x47||segment[376]!==0x47)throw Object.assign(Error('INVALID_SEGMENT'),{code:'INVALID_SEGMENT'});
 return {dnsFallback,segment:names.at(-1)};
}
module.exports={verifyPublicStream,requestBytes};

