const {app,BrowserWindow,desktopCapturer,session,ipcMain,clipboard,powerSaveBlocker,shell,safeStorage,globalShortcut}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const {StreamSession}=require('./stream.cjs');
const {YouTube}=require('./youtube.cjs');
const {YouTubeSession}=require('./youtube-stream.cjs');
const {Policy,LINKS}=require('./policy.cjs');
let youtube,policy;
const {Diagnostics}=require('./diagnostics.cjs');
const {AppAudio}=require('./app-audio.cjs');
const outputs=require('./audio-outputs.cjs');
let outputQueue=Promise.resolve(),outputJournal;
function queueOutput(action){const result=outputQueue.then(action);outputQueue=result.catch(()=>{});return result;}
function restoreOutput(){return queueOutput(()=>outputs.invoke(audioExe,['system-restore',outputJournal])).catch(()=>{audioEvent({type:'pending',message:'ERR_AUDIO_RESTORE'});return false;});}
let appAudio,recovery;
const audioExe=path.join(__dirname,'bin','audio','VRStreamAudio.exe');
const audioEvent=event=>{diagnostics.add('app-audio',JSON.stringify(event));if(win&&!win.isDestroyed())win.webContents.send('audio-event',event);};
async function stopAudio(){const previous=appAudio;appAudio=null;await previous?.stop();}
let win,active,selected,busy=false,blocker=null;
const diagnostics=new Diagnostics();
function releasePower(){if(blocker!==null&&powerSaveBlocker.isStarted(blocker))powerSaveBlocker.stop(blocker);blocker=null;}
app.setName('VRStreamConrtent');
if(!app.requestSingleInstanceLock())app.quit();
app.whenReady().then(()=>{
  policy=new Policy(app.getPath('userData'));
  diagnostics.add('app',app.getVersion());
  youtube=new YouTube({directory:app.getPath('userData'),configFile:path.join(__dirname,'youtube-client.json'),safeStorage,diagnostics,openExternal:url=>shell.openExternal(url)});
  recovery=AppAudio.recover(audioExe,path.join(app.getPath('userData'),'audio-routing.json'),audioEvent);
  outputJournal=path.join(app.getPath('userData'),'system-output.json');
  void restoreOutput();
  win=new BrowserWindow({width:1180,height:930,minWidth:900,minHeight:760,backgroundColor:'#10131d',title:'VRStreamConrtent',icon:path.join(__dirname,'assets','app.ico'),autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:false}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',event=>event.preventDefault());
  win.webContents.on('render-process-gone',(_event,details)=>{diagnostics.add('renderer-gone',details.reason);active?.stop();void stopAudio();releasePower();});
  session.defaultSession.setDisplayMediaRequestHandler(async(request,callback)=>{
    try{
      if(request.frame!==win.webContents.mainFrame)return callback({});
      const sources=await desktopCapturer.getSources({types:['screen','window'],thumbnailSize:{width:0,height:0}});
      const source=sources.find(s=>s.id===selected);
      if(!source){diagnostics.add('capture-source-missing');return callback({});}
      diagnostics.add('capture-request',JSON.stringify({kind:source.id.split(':')[0],audio:request.audioRequested}));
      callback({video:source,...(request.audioRequested&&source.id.startsWith('screen:')?{audio:'loopback'}:{})});
    }catch(error){diagnostics.add('capture-request-error',error.message);callback({});}
  });
  function handle(name,fn){ipcMain.handle(name,(event,...args)=>{
    if(event.sender!==win.webContents||event.senderFrame!==win.webContents.mainFrame)throw Error('ERR_DENIED');
    if(['sources','select','youtube-connect','preflight','start','audio-start'].includes(name))policy.require();
    return fn(...args);
  });}
  handle('terms-status',()=>policy.status());
  handle('terms-accept',version=>policy.accept(version));
  handle('quit',()=>app.quit());
  handle('external-link',key=>{if(!Object.hasOwn(LINKS,key))throw Error('ERR_URL');return shell.openExternal(LINKS[key]);});
  const discord=()=>{try{const url=new URL(require('./support.json').discordInvite);if(url.protocol!=='https:'||url.username||url.password||url.port||url.search||url.hash)return null;const parts=url.pathname.split('/');return (url.hostname==='discord.gg'&&parts.length===2&&/^[a-zA-Z0-9-]+$/.test(parts[1]))||(url.hostname==='discord.com'&&parts.length===3&&parts[1]==='invite'&&/^[a-zA-Z0-9-]+$/.test(parts[2]))?url.href:null;}catch{return null;}};
  handle('support-status',()=>Boolean(discord()));
  handle('support-open',()=>{const url=discord();if(!url)throw Error('ERR_SUPPORT');return shell.openExternal(url);});
  handle('sources',async()=>(await desktopCapturer.getSources({types:['screen','window'],thumbnailSize:{width:320,height:180}})).map(s=>({id:s.id,name:s.name,thumbnail:s.thumbnail.toDataURL()})));
  handle('select',id=>{if(typeof id!=='string'||! /^(window|screen):/.test(id))throw Error('ERR_SOURCE');selected=id;});
  handle('youtube-status',()=>youtube.status());
  handle('youtube-connect',()=>{if(active||busy)throw Error('ERR_ACTIVE');return youtube.connect();});
  handle('youtube-disconnect',()=>{if(active||busy)throw Error('ERR_ACTIVE');return youtube.disconnect();});
  handle('preflight',async options=>{
    if(busy||active||youtube.connecting)throw Error('ERR_ACTIVE');
    if(!options||!['tunnel','youtube'].includes(options.provider))throw Error('ERR_YT_DETAILS');
    if(options.provider==='youtube'){
      youtube.config();
      if(!youtube.status().connected)throw Error('ERR_YT_LOGIN');
      await youtube.api('liveBroadcasts',{part:'id',mine:'true',maxResults:'1'});
      if(typeof options.title!=='string'||!options.title.trim()||options.title.length>100||typeof options.madeForKids!=='boolean')throw Error('ERR_YT_DETAILS');
    }
    return true;
  });
  handle('start',async(quality,offset=0,fps=30,options={})=>{
    if(busy||active||youtube.connecting)throw Error('ERR_ACTIVE');busy=true;
    try{
      const tunnel=path.join(__dirname,'bin','cloudflared.exe'),ffmpeg=require('ffmpeg-static');
      if(!fs.existsSync(ffmpeg)||(options.provider!=='youtube'&&!fs.existsSync(tunnel)))throw Error('ERR_TOOLS');
      const root=path.join(app.getPath('temp'),'vrshare');fs.mkdirSync(root,{recursive:true});
      blocker=powerSaveBlocker.start('prevent-app-suspension');
      if(!['tunnel','youtube'].includes(options.provider||'tunnel'))throw Error('ERR_YT_DETAILS');
      const onStatus=status=>{
        if(status.state==='error'){releasePower();void stopAudio();}
        if(!win.isDestroyed())win.webContents.send('status',status);
      };
      active=options.provider==='youtube'?new YouTubeSession(youtube,ffmpeg,onStatus,diagnostics):new StreamSession(root,ffmpeg,tunnel,onStatus,diagnostics);
      await active.start(quality,offset,fps,options);return true;
    }catch(error){await active?.stop();active=null;releasePower();throw error;}finally{busy=false;}
  });
  handle('audio-stop',()=>stopAudio());
  handle('audio-outputs',()=>outputs.invoke(audioExe,['outputs']));
  handle('audio-route',id=>{policy.require();if(!active||!appAudio)throw Error('ERR_AUDIO_DEVICE');return appAudio.route(outputs.validDevice(id));});
  handle('system-output',id=>{policy.require();if(!active)throw Error('ERR_STOPPED');outputs.validDevice(id);return queueOutput(()=>{if(!active)throw Error('ERR_STOPPED');return outputs.invoke(audioExe,['system-output',outputJournal,id]);});});
  handle('audio-start',async()=>{if(!active||appAudio||!selected?.startsWith('window:'))throw Error('ERR_SOURCE');await recovery;appAudio=new AppAudio(audioExe,path.join(app.getPath('userData'),'audio-routing.json'),data=>{if(!win.isDestroyed())win.webContents.send('app-audio',data);},audioEvent);try{return await appAudio.start(selected);}catch(error){await stopAudio();throw error;}});
  handle('reconfigure',async(q,offset,fps)=>{if(!active)throw Error('ERR_STOPPED');await active.reconfigure(q,offset,fps);});
  handle('chunk',async data=>{if(!active)throw Error('ERR_STOPPED');await active.write(data);});
  handle('stop',async()=>{const current=active;const result=await Promise.all([current?.stop(),stopAudio(),restoreOutput()]);active=null;releasePower();return {youtubeStopFailed:Boolean(current?.stopFailed),audioRestoreFailed:result[2]===false};});
  handle('report',data=>{
    if(!data||typeof data!=='object')return;
    const safe={};for(const key of ['fps','frames','bytes','queued','width','height'])if(Number.isFinite(data[key]))safe[key]=data[key];
    if(['running','suspended','closed','none'].includes(data.audio))safe.audio=data.audio;
    if(typeof data.event==='string')safe.event=data.event.slice(0,60);
    if(typeof data.error==='string')safe.error=data.error.slice(0,120);
    diagnostics.add('capture',JSON.stringify(safe));
  });
  handle('diagnostics',()=>{clipboard.writeText(diagnostics.text());return true;});
  handle('open-watch',async()=>{if(!active?.ready||!active.url)throw Error('ERR_PUBLIC');await shell.openExternal(active.url.replace(/live\.m3u8$/,'watch'));});
  handle('copy',url=>{if(!active?.ready||typeof url!=='string'||url!==active.url)throw Error('ERR_URL');clipboard.writeText(url);});
  handle('updates-check',repository=>require('./updates.cjs').check(repository,app.getVersion()));
  handle('updates-open',repository=>shell.openExternal(require('./updates.cjs').releasePage(repository)));
  const shortcuts={};for(const [command,accelerator] of [['mute','Control+Alt+M'],['stop','Control+Alt+End']])shortcuts[command]=globalShortcut.register(accelerator,()=>{if(!win.isDestroyed())win.webContents.send('shortcut',command);});
  handle('shortcuts-status',()=>shortcuts);
  win.loadFile(path.join(__dirname,'index.html'));
});
let quitting=false;
app.on('before-quit',event=>{if(outputJournal&&!quitting){event.preventDefault();quitting=true;Promise.all([active?.stop(),stopAudio(),restoreOutput()]).finally(()=>{releasePower();app.quit();});}else releasePower();});
app.on('will-quit',()=>globalShortcut.unregisterAll());
app.on('window-all-closed',()=>app.quit());

