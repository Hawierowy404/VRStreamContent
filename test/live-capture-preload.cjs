const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('vrshare',{onAudio:callback=>{const listener=(_,d)=>callback(d);ipcRenderer.on('samples',listener);return ()=>ipcRenderer.removeListener('samples',listener);}});
contextBridge.exposeInMainWorld('testBridge',{chunk:data=>ipcRenderer.invoke('chunk',data),change:()=>ipcRenderer.invoke('change'),finish:result=>ipcRenderer.invoke('finish',result)});
