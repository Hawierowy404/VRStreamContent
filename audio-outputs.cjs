const {execFile}=require('node:child_process');
function invoke(exe,args){return new Promise((resolve,reject)=>{execFile(exe,args,{windowsHide:true,timeout:15000,maxBuffer:128*1024},(error,stdout)=>{if(error)return reject(Error('ERR_AUDIO_DEVICE'));try{resolve(JSON.parse(stdout));}catch{reject(Error('ERR_AUDIO_DEVICE'));}});});}
function validDevice(id){if(typeof id!=='string'||!/^\{0\.0\.0\.\d+\}\.\{[a-fA-F0-9-]{36}\}$/.test(id))throw Error('ERR_AUDIO_DEVICE');return id;}
module.exports={invoke,validDevice};
