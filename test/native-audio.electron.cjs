const {app,BrowserWindow}=require('electron'),{spawn}=require('child_process'),path=require('path'),fs=require('fs'),os=require('os'),assert=require('assert/strict');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'vrstream-native-test-'));app.setPath('userData',path.join(root,'profile'));
let child,win,done=false;
app.on('window-all-closed',()=>{});
app.whenReady().then(async()=>{
 try{
  win=new BrowserWindow({show:false,webPreferences:{sandbox:true,backgroundThrottling:false,autoplayPolicy:'no-user-gesture-required'}});
  await win.loadURL('data:text/html,<title>VRStream controlled audio test</title>');
  await win.webContents.executeJavaScript('globalThis.ctx=new AudioContext();globalThis.osc=ctx.createOscillator();const gain=ctx.createGain();gain.gain.value=0;osc.connect(gain).connect(ctx.destination);osc.start();ctx.resume()');
  await new Promise(r=>setTimeout(r,700));
  const handle=win.getNativeWindowHandle();const hwnd=handle.length===8?handle.readBigUInt64LE().toString():String(handle.readUInt32LE());
  const journal=path.join(root,'routing.json');
  child=spawn(path.join(__dirname,'..','bin','audio','VRStreamAudio.exe'),[hwnd,String(process.pid),journal],{windowsHide:true});
  let ready=false,bytes=0,log='';child.stdout.on('data',d=>bytes+=d.length);child.stdin.on('error',()=>{});
  child.stderr.on('data',data=>{const line=data.toString();log+=line;if(!ready&&line.includes('"ready"')){ready=true;setTimeout(()=>child.stdin.end('stop\n'),2200);}});
  child.on('exit',code=>{
   try{assert.equal(code,0,log);assert.ok(ready,log);assert.ok(bytes>48000*8,log);assert.equal(fs.existsSync(journal),false,log);console.log('PASS native window audio: real Chromium audio session, capture, route-or-warning, restoration; bytes='+bytes);}
   catch(error){console.error(error);process.exitCode=1;}
   done=true;win.destroy();app.exit(process.exitCode||0);
  });
 }catch(error){console.error(error);child?.stdin.end('stop\n');app.exit(1);}
});
setTimeout(()=>{if(!done){child?.stdin.end('stop\n');setTimeout(()=>app.exit(1),3000);}},20000).unref();

