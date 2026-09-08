const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('vrshare',{
  checkUpdates:repository=>ipcRenderer.invoke('updates-check',repository),openUpdates:repository=>ipcRenderer.invoke('updates-open',repository),shortcutsStatus:()=>ipcRenderer.invoke('shortcuts-status'),onShortcut:callback=>ipcRenderer.on('shortcut',(_event,command)=>callback(command)),
  termsStatus:()=>ipcRenderer.invoke('terms-status'),termsAccept:version=>ipcRenderer.invoke('terms-accept',version),quit:()=>ipcRenderer.invoke('quit'),
  externalLink:key=>ipcRenderer.invoke('external-link',key),supportStatus:()=>ipcRenderer.invoke('support-status'),supportOpen:()=>ipcRenderer.invoke('support-open'),
  preflight:options=>ipcRenderer.invoke('preflight',options),
  youtubeStatus:()=>ipcRenderer.invoke('youtube-status'),
  youtubeConnect:()=>ipcRenderer.invoke('youtube-connect'),
  youtubeDisconnect:()=>ipcRenderer.invoke('youtube-disconnect'),
  audioStop:()=>ipcRenderer.invoke('audio-stop'),
  audioOutputs:()=>ipcRenderer.invoke('audio-outputs'),audioRoute:id=>ipcRenderer.invoke('audio-route',id),systemOutput:id=>ipcRenderer.invoke('system-output',id),
  audioStart:()=>ipcRenderer.invoke('audio-start'),
  reconfigure:(q,offset,fps)=>ipcRenderer.invoke('reconfigure',q,offset,fps),
  onAudio:callback=>{const listener=(_event,data)=>callback(data);ipcRenderer.on('app-audio',listener);return ()=>ipcRenderer.removeListener('app-audio',listener);},
  onAudioEvent:callback=>ipcRenderer.on('audio-event',(_event,data)=>callback(data)),
  sources:()=>ipcRenderer.invoke('sources'),select:id=>ipcRenderer.invoke('select',id),
  start:(q,offset,fps,options)=>ipcRenderer.invoke('start',q,offset,fps,options),chunk:data=>ipcRenderer.invoke('chunk',data),
  report:data=>ipcRenderer.invoke('report',data),diagnostics:()=>ipcRenderer.invoke('diagnostics'),
  openWatch:()=>ipcRenderer.invoke('open-watch'),
  stop:()=>ipcRenderer.invoke('stop'),copy:url=>ipcRenderer.invoke('copy',url),
  onStatus:callback=>ipcRenderer.on('status',(_event,status)=>callback(status))
});
