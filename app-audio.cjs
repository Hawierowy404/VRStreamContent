const {spawn}=require('node:child_process');
const path=require('node:path'),fs=require('node:fs');
class AppAudio {
 constructor(exe,journal,onData,onEvent){Object.assign(this,{exe,journal,onData,onEvent});this.requests=new Map();this.nextRequest=0;}
 route(target){
  if(this.stopping||!this.child?.stdin.writable)return Promise.reject(Error('ERR_AUDIO_DEVICE'));
  const id=++this.nextRequest;
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{this.requests.delete(id);reject(Error('ERR_AUDIO_DEVICE'));},5000);this.requests.set(id,{resolve,reject,timer});this.child.stdin.write(JSON.stringify({id,target})+'\n');});
 }
 start(source){
  if(!/^window:\d+:/.test(source))return Promise.reject(Error('ERR_SOURCE'));
  if(!fs.existsSync(this.exe))return Promise.reject(Error('ERR_AUDIO_TOOLS'));
  return new Promise((resolve,reject)=>{
   const child=this.child=spawn(this.exe,[source.split(':')[1],String(process.pid),this.journal],{windowsHide:true,stdio:['pipe','pipe','pipe']});
   let ready=false,text='',remainder=Buffer.alloc(0);
   const timeout=setTimeout(()=>{reject(Error('ERR_APP_AUDIO'));void this.stop();},20000);
   child.stdin.on('error',()=>{});
   child.stdout.on('data',data=>{const buffer=Buffer.concat([remainder,data]);const end=buffer.length-buffer.length%8;remainder=buffer.subarray(end);if(end&&!this.stopping)this.onData(buffer.subarray(0,end));});
   child.stderr.on('data',data=>{
    text+=data.toString();let index;
    while((index=text.indexOf('\n'))>=0){const line=text.slice(0,index);text=text.slice(index+1);try{
     const event=JSON.parse(line);
     if(event.type==='route-result'){const request=this.requests.get(event.id);if(request){clearTimeout(request.timer);this.requests.delete(event.id);event.ok?request.resolve(true):request.reject(Error('ERR_AUDIO_DEVICE'));}continue;}
     this.onEvent(event);
     if(event.type==='ready'){ready=true;clearTimeout(timeout);resolve(true);}
     if(event.type==='error'&&!ready){clearTimeout(timeout);reject(Error(event.message));}
    }catch{}}
   });
   child.on('error',()=>{clearTimeout(timeout);reject(Error('ERR_AUDIO_TOOLS'));});
   child.on('exit',()=>{clearTimeout(timeout);if(!ready)reject(Error('ERR_APP_AUDIO'));else if(!this.stopping)this.onEvent({type:'error',message:'ERR_APP_AUDIO'});});
  });
 }
 stop(){
  for(const request of this.requests.values()){clearTimeout(request.timer);request.reject(Error('ERR_AUDIO_DEVICE'));}this.requests.clear();
  if(this.stopPromise)return this.stopPromise;this.stopping=true;
  return this.stopPromise=new Promise(resolve=>{
   const child=this.child;if(!child||child.exitCode!==null||!child.pid)return resolve();
   const timeout=setTimeout(()=>{this.onEvent({type:'pending',message:'ERR_AUDIO_RESTORE'});child.kill();resolve();},10000);
   child.once('exit',()=>{clearTimeout(timeout);resolve();});
   child.stdin.end('stop\n');
  });
 }
 static recover(exe,journal,onEvent){
  if(!fs.existsSync(journal)||!fs.existsSync(exe))return Promise.resolve();
  return new Promise(resolve=>{
   const child=spawn(exe,['recover',journal],{windowsHide:true,stdio:['ignore','ignore','pipe']});
   child.stderr.on('data',data=>{for(const line of data.toString().trim().split('\n'))try{onEvent(JSON.parse(line));}catch{}});
   child.on('error',resolve);child.on('exit',resolve);
  });
 }
}
module.exports={AppAudio};
