const https=require('node:https'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pipeline}=require('node:stream/promises');
const expected='83e726ed18ea78c5ad5213c4c3a3a27051393950d2bc8ed4de69bec12d14eaae';
const target=path.join(__dirname,'bin','cloudflared.exe'),temporary=target+'.part';
function response(url,n=0){return new Promise((resolve,reject)=>{
if(n>8)return reject(Error('Too many redirects'));
const request=https.get(url,res=>{
if(res.statusCode>=300&&res.statusCode<400){res.resume();return response(new URL(res.headers.location,url),n+1).then(resolve,reject);}
if(res.statusCode!==200){res.resume();return reject(Error('HTTP '+res.statusCode));}resolve(res);
});request.setTimeout(30000,()=>request.destroy(Error('Download timeout')));request.on('error',reject);
});}
async function setup(){
fs.mkdirSync(path.dirname(target),{recursive:true});
if(fs.existsSync(target)&&crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')===expected)return;
await pipeline(await response('https://github.com/cloudflare/cloudflared/releases/download/2026.8.3/cloudflared-windows-amd64.exe'),fs.createWriteStream(temporary));
if(crypto.createHash('sha256').update(fs.readFileSync(temporary)).digest('hex')!==expected)throw Error('cloudflared checksum mismatch');
fs.renameSync(temporary,target);
}
setup().catch(e=>{fs.rmSync(temporary,{force:true});console.error(e.message);process.exitCode=1;});

