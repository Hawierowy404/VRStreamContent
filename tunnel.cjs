const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');

function sshPath(){return path.join(process.env.SystemRoot||'C:\\Windows','System32','OpenSSH','ssh.exe');}
function launchTunnel({port,root,cloudflared,onAddress,onConnected,onLost,diagnostics,spawnProcess=spawn}){
 const ssh=sshPath(),alternate=fs.existsSync(ssh);
 const provider=alternate?'localhost.run':'cloudflare';
 // Isolate SSH from personal keys, agents and configuration. Remember the first
 // server key in the app's own file; a changed key must fail verification.
 const args=alternate?['-F','NUL','-o','BatchMode=yes','-o','StrictHostKeyChecking=accept-new',
  '-o','UserKnownHostsFile='+path.join(root,'tunnel-known-hosts'),'-o','IdentityAgent=none',
  '-o','IdentitiesOnly=yes','-o','IdentityFile=none','-o','ConnectTimeout=15',
  '-o','ServerAliveInterval=15','-o','ServerAliveCountMax=3','-o','ExitOnForwardFailure=yes',
  '-T','-R','80:127.0.0.1:'+port,'nokey@localhost.run']:
  ['tunnel','--url','http://127.0.0.1:'+port,'--protocol','http2','--no-autoupdate'];
 const child=spawnProcess(alternate?ssh:cloudflared,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});
 diagnostics.add('tunnel-provider',provider);
 let buffer='',address,ended=false;
 const consume=data=>{
  buffer=(buffer+data.toString()).slice(-16000);
  const pattern=alternate?/https:\/\/[a-z0-9-]+\.(?:lhr\.life|lhr\.rocks|localhost\.run)(?=[\s\x1b]|$)/g:/https:\/\/[a-z0-9-]+\.trycloudflare\.com(?=[\s\x1b]|$)/g;
  const found=[...buffer.matchAll(pattern)].at(-1)?.[0];
  if(found&&found!==address){address=found;onAddress(found);if(alternate)onConnected();}
  if(!alternate&&/Registered tunnel connection/.test(data.toString()))onConnected();
 };
 const lost=error=>{if(ended)return;ended=true;diagnostics.add('tunnel-disconnected',error?.code||'exit');onLost();};
 child.stdout.on('data',consume);child.stderr.on('data',consume);
 child.once('error',lost);child.once('exit',lost);
 return child;
}
module.exports={launchTunnel,sshPath};
