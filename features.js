(()=>{
 let startedAt=0,muted=false,normal4k=false,lastProgress=0,encoderFps=0,retries=0,retryTimer=null,retrying=false,stableAt=0;
 let reconnectQueued=false,serviceWarning=false,ultraLive=false;
 let updateBusy=false,checkedRepository='',updateResult=null;
 const savedVolume=Number(pref.get('streamVolume')??100);$('stream-volume').value=Number.isFinite(savedVolume)?Math.max(0,Math.min(100,savedVolume)):100;
 let appliedVolume=Number($('stream-volume').value),applyingAudio=false;
 function applyVolume(){pipeline?.setVolume(appliedVolume/100);pipeline?.setMuted(muted);}
 function audioControls(){const draft=Number($('stream-volume').value);$('volume-value').textContent=draft+'%';$('apply-audio').disabled=applyingAudio||starting||stopping||switching||(draft===appliedVolume&&$('audio').checked===activeAudioEnabled);$('audio').disabled=applyingAudio||starting||stopping||switching;}
 $('stream-volume').oninput=()=>{$('audio-applied').textContent='';audioControls();};
 $('audio').addEventListener('change',()=>{$('audio-applied').textContent='';audioControls();});
 $('apply-audio').onclick=async()=>{if($('apply-audio').disabled)return;applyingAudio=true;audioControls();try{if(running&&$('audio').checked!==activeAudioEnabled){const ok=await changeLiveSource({id:selected,name:selectedLabel,thumbnail:selectedThumbnail},true,$('audio').checked);if(!ok)return;}activeAudioEnabled=$('audio').checked;appliedVolume=Number($('stream-volume').value);pref.set('streamVolume',String(appliedVolume));applyVolume();$('audio-applied').textContent=t('audioApplied');}finally{applyingAudio=false;audioControls();}};
 document.addEventListener('source-changed',applyVolume);document.addEventListener('capture-ready',()=>{muted=false;applyVolume();});applyVolume();
 const profiles={weak:[480,15],standard:[720,30],best:[2160,60]};
 function render(){
  audioControls();
  $('apply-quality').hidden=false;
  $('updates-alert').hidden=updateResult?.key!=='updateAvailable';$('updates-alert').textContent=t('updateAvailable')+' '+(updateResult?.version||'');
  $('mute-live').textContent=t(muted?'unmuteLive':'muteLive');
  $('fourk-hint').hidden=$('quality').value!=='2160';
  $('profile').disabled=running||starting;
  $('quality').querySelector('option[value="2160"]').disabled=running&&$('provider').value==='youtube'&&!normal4k;
  $('quality').querySelector('option[value="1440"]').disabled=running&&$('provider').value==='youtube'&&ultraLive;
  if(updateResult)$('update-result').textContent=t(updateResult.key)+(updateResult.version?' '+updateResult.version:'');
 }
 $('profile').onchange=()=>{const profile=profiles[$('profile').value];if(!profile||running)return;for(const [i,id] of ['quality','fps'].entries()){$(id).value=String(profile[i]);$(id).dispatchEvent(new Event('change'));}pref.set('profile',$('profile').value);};
 for(const id of ['quality','fps'])$(id).addEventListener('change',()=>{if(document.activeElement===$(id))$('profile').value='custom';render();});
 $('mute-live').onclick=()=>{if(!pipeline||!running)return;muted=!muted;pipeline.setMuted(muted);render();};
 window.vrshare.onShortcut(command=>{if(command==='mute'&&running)$('mute-live').click();if(command==='stop'&&running&&!stopping)void stop();});
 window.vrshare.shortcutsStatus().then(result=>{if(!result.mute||!result.stop){$('shortcut-status').dataset.i18n='shortcutUnavailable';$('shortcut-status').textContent=t('shortcutUnavailable');}}).catch(()=>{});
 document.addEventListener('capture-ready',()=>{normal4k=$('yt-latency').value==='2';ultraLive=$('yt-latency').value==='0';startedAt=0;muted=false;retries=0;stableAt=0;lastProgress=Date.now();encoderFps=0;render();});
 document.addEventListener('broadcast-live',()=>{if(!startedAt)startedAt=Date.now();if(!stableAt)stableAt=Date.now();});
 document.addEventListener('capture-stopped',()=>{clearTimeout(retryTimer);retryTimer=null;retrying=false;reconnectQueued=false;startedAt=0;encoderFps=0;lastProgress=0;render();});
 window.vrshare.onStatus(event=>{if(['warning','checking','reconnecting'].includes(event.state))serviceWarning=true;if(event.state==='live')serviceWarning=false;if(event.state==='telemetry'&&running){encoderFps=Number.isFinite(event.fps)?event.fps:0;lastProgress=Date.now();}});
 document.addEventListener('reconnect-live',()=>{
  if(!running||stopping)return;if(retrying){reconnectQueued=true;return;}
  if(stableAt&&Date.now()-stableAt>60000)retries=0;stableAt=0;
  if(++retries>3){void stop('ERR_RECONNECT',true);return;}
  retrying=true;publicReady=false;$('copy').disabled=true;$('open-watch').disabled=true;status('reconnectingLive','connecting');
  retryTimer=setTimeout(async()=>{
   retryTimer=null;if(!running||stopping){retrying=false;return;}if(switching){retrying=false;document.dispatchEvent(new Event('reconnect-live'));return;}
   switching=true;controls();
   try{if(recorder&&recorder.state!=='inactive')await new Promise(resolve=>{recorder.addEventListener('stop',resolve,{once:true});recorder.stop();});await pending;if(stopping||!running)return;
    const profile=VideoSettings.resolve(appliedProfile.height,appliedProfile.fps);await window.vrshare.reconfigure(profile.height,Number($('offset').value),profile.fps);if(stopping||!running)return;startRecorder(profile);lastProgress=Date.now();
   }catch{if(running&&!stopping)void stop('ERR_RECONNECT',true);}finally{switching=false;retrying=false;controls();if(reconnectQueued&&running&&!stopping){reconnectQueued=false;document.dispatchEvent(new Event('reconnect-live'));}}
  },Math.min(10000,2000*retries));
 });
 setInterval(()=>{
  $('mute-live').disabled=!running||!pipeline||!stream?.getAudioTracks().length;
  $('audio-meter').value=pipeline?.level?.()||0;
  const seconds=startedAt?Math.floor((Date.now()-startedAt)/1000):0;$('live-time').textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(x=>String(x).padStart(2,'0')).join(':');
  $('live-fps').textContent=(running&&lastProgress&&Date.now()-lastProgress<10000?encoderFps.toFixed(1):'—')+' FPS';
  const key=!running?'healthIdle':retrying?'reconnectingLive':!publicReady?'healthPreparing':(serviceWarning||Date.now()-lastProgress>10000)?'healthTrouble':'healthStable';$('live-health').textContent=t(key);$('live-health').dataset.health=key;
  render();
 },250);
 $('updates-alert').onclick=()=>{$('preferences-dialog').showModal();$('update-download').focus();};
 $('update-repo').value=pref.get('updateRepository')||'';$('update-auto').checked=pref.get('updateAuto')==='true';
 $('update-repo').onchange=()=>{pref.set('updateRepository',$('update-repo').value.trim());$('update-download').hidden=true;updateResult=null;};
 $('update-auto').onchange=()=>pref.set('updateAuto',String($('update-auto').checked));
 $('update-check').onclick=async()=>{if(updateBusy)return;updateBusy=true;$('update-check').disabled=true;updateResult={key:'updateChecking'};render();try{const repo=$('update-repo').value.trim();const result=await window.vrshare.checkUpdates(repo);checkedRepository=repo;updateResult={key:result.available?'updateAvailable':result.empty?'updateEmpty':'updateCurrent',version:result.version};$('update-download').hidden=!result.available;}catch(error){updateResult={key:errorKey(error)};$('update-download').hidden=true;}finally{updateBusy=false;$('update-check').disabled=false;render();}};
 $('update-download').onclick=()=>window.vrshare.openUpdates(checkedRepository).catch(()=>{updateResult={key:'ERR_UPDATE_NETWORK'};render();});
 document.addEventListener('language-rendered',render);render();
 window.vrshare.termsStatus().then(s=>{if(s.accepted&&$('update-auto').checked&&$('update-repo').value)$('update-check').click();}).catch(()=>{});
})();
