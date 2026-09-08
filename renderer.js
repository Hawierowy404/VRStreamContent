const $=id=>document.getElementById(id);
const pref={get:k=>{try{return localStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}}};
let language=pref.get('language')||navigator.language.slice(0,2);if(!translations[language])language='en';
let publicReady=false,publicDnsWarning=false;
let appliedProfile=null;
let selectedLabel='',selectedThumbnail='';
let selected=null,stream=null,recorder=null,running=false,stopping=false,starting=false,pending=Promise.resolve(),queued=0,noAudio=false;
let nativeAudio=null,switching=false,activeAudioEnabled=true;
let pipeline=null,healthTimer=null,startupPromise=null,bytes=0,diagnosticsCopied=false;
let statusKey='idle',badgeKey='ready',copied=false;
const t=key=>translations[language][key]||translations.en[key]||key;
function updateSelection(){
 $('selected-name').textContent=selectedLabel||t('noSelection');
 $('audio-summary').textContent=t(!$('audio').checked?'audioOff':selected?.startsWith('screen:')?'audioScreen':selected?.startsWith('window:')?'audioWindow':'audioPick');
 $('badge').dataset.state=badgeKey;
 const empty=$('sources').querySelector('.source-empty');if(empty)empty.textContent=t('empty');
}
function renderLanguage(){document.documentElement.lang=language;$('language').value=language;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$('url').placeholder=t('urlPlaceholder');$('url').setAttribute('aria-label',t('urlLabel'));$('status').textContent=t(statusKey);$('badge').textContent=t(badgeKey);$('copy').textContent=t(copied?'copied':'copy');$('diagnostics-result').textContent=diagnosticsCopied?t('copied'):'';updateSelection();document.dispatchEvent(new Event('language-rendered'));}
function status(key,badge){statusKey=key;if(badge)badgeKey=badge;$('status').textContent=t(key);$('badge').textContent=t(badgeKey);$('badge').dataset.state=badgeKey;}
function errorKey(error){const code=String(error?.message||error).match(/ERR_[A-Z_]+|WARN_[A-Z_]+|INVALID_OFFSET/)?.[0];return code&&translations.en[code]?code:'genericError';}
function controls(){ for(const id of ['provider','yt-title','yt-kids','yt-connect','yt-disconnect'])$(id).disabled=running; $('yt-connect').disabled=running||$('yt-connect').dataset.connected==='true'; $('start').disabled=running||!selected;$('stop').disabled=!running||stopping||starting||switching;for(const id of ['refresh','audio','offset','reset-offset'])$(id).disabled=running;for(const id of ['quality','fps'])$(id).disabled=starting||stopping||switching;$('apply-quality').disabled=!running||starting||stopping||switching||!appliedProfile||(String(appliedProfile.height)===$('quality').value&&String(appliedProfile.fps)===$('fps').value);$('refresh').disabled=starting||stopping||switching;document.querySelectorAll('.source').forEach(b=>b.disabled=starting||stopping||switching);$('start').hidden=running;$('stop').hidden=!running;$('apply-quality').hidden=!running;$('selected-preview').hidden=running||!selectedThumbnail;updateSelection(); }
async function refresh(){try{const sources=await window.vrshare.sources();$('sources').replaceChildren();if(!running){selected=null;selectedLabel='';selectedThumbnail='';}
for(const source of sources){const b=document.createElement('button');b.className='source';const img=document.createElement('img');img.src=source.thumbnail;img.alt='';const title=document.createElement('span');title.textContent=source.name;b.append(img,title);b.title=source.name;b.dataset.sourceId=source.id;b.classList.toggle('selected',source.id===selected);b.setAttribute('aria-pressed',String(source.id===selected));b.onclick=()=>{if(running){void changeLiveSource(source);return;}selected=source.id;selectedLabel=source.name;selectedThumbnail=source.thumbnail;$('selected-preview').src=selectedThumbnail;document.querySelectorAll('.source').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});controls();};$('sources').append(b);}if(!sources.length){const empty=document.createElement('p');empty.className='source-empty';empty.textContent=t('empty');$('sources').append(empty);}if(!running)status(sources.length?'idle':'empty','ready');controls();
}catch(e){status(errorKey(e),'error');}}
async function stop(key='ended',error=false){
if(stopping)return;stopping=true;clearInterval(healthTimer);controls();
if(recorder&&recorder.state!=='inactive')recorder.stop();
await pipeline?.dispose();pipeline=null;await nativeAudio?.dispose();nativeAudio=null;stream?.getTracks().forEach(t=>t.stop());stream=null;$('preview').srcObject=null;$('placeholder').hidden=false;
await startupPromise?.catch(()=>{});startupPromise=null;
const result=await window.vrshare.stop().catch(()=>({youtubeStopFailed:true}));if(result?.youtubeStopFailed){key='ERR_YT_STOP';error=true;}if(result?.audioRestoreFailed){key='ERR_AUDIO_RESTORE';error=true;}await pending.catch(()=>{});pending=Promise.resolve();queued=0;
running=false;stopping=false;document.dispatchEvent(new Event('capture-stopped'));publicReady=false;$('open-watch').disabled=true;$('url').value='';$('copy').disabled=true;controls();status(key,error?'error':'stopped');
}
function startRecorder(profile){
appliedProfile={height:profile.height,fps:profile.fps};
const mime=['video/webm;codecs=vp8,opus','video/webm'].find(x=>MediaRecorder.isTypeSupported(x));
recorder=new MediaRecorder(pipeline.stream,{mimeType:mime,videoBitsPerSecond:profile.captureBitrate,audioBitsPerSecond:160000});
recorder.ondataavailable=event=>{
if(!event.data.size||stopping)return;
queued+=event.data.size;bytes+=event.data.size;
if(queued>32*1024*1024){stop('overload',true);return;}
pending=pending.then(async()=>{try{const bytes=await event.data.arrayBuffer();for(let offset=0;offset<bytes.byteLength&&!stopping;offset+=512*1024)await window.vrshare.chunk(bytes.slice(offset,offset+512*1024));}finally{queued-=event.data.size;}})
.catch(e=>{if(!stopping)stop(errorKey(e),true);});
};
recorder.onerror=event=>{window.vrshare.report({event:'recorder-error',error:event.error?.name}).catch(()=>{});stop('ERR_RECORDER',true);};
recorder.onstop=()=>{if(running&&!stopping&&!switching)stop('ERR_RECORDER',true);};
recorder.start(250);
}
$('start').onclick=async()=>{
if(starting||running)return;starting=true;$('start').disabled=true;
const options={provider:$('provider').value,title:$('yt-title').value,madeForKids:$('yt-kids').value==='yes',latency:YouTubeLatency.modes[Number($('yt-latency').value)]};
try{
 if(options.provider==='youtube'&&!$('yt-kids').value)throw Error('ERR_YT_DETAILS');
 status('checkingReady','connecting');if(!selected)throw Error('ERR_SOURCE');await window.vrshare.preflight(options);
}catch(e){starting=false;controls();status(errorKey(e),'error');if(options.provider==='youtube')$('preferences-dialog').showModal();return;}
running=true;starting=true;activeAudioEnabled=$('audio').checked;publicReady=false;publicDnsWarning=false;controls();status('preparing','connecting');
try{
const profile=VideoSettings.resolve($('quality').value,$('fps').value);
await window.vrshare.select(selected);
if($('provider').value==='youtube'&&(!$('yt-title').value.trim()||!$('yt-kids').value))throw Error('ERR_YT_DETAILS');
startupPromise=window.vrshare.start($('quality').value,Number($('offset').value),profile.fps,options);
startupPromise.catch(()=>{});
await startupPromise;
stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:profile.fps,max:profile.fps},height:{ideal:Number($('quality').value),max:Number($('quality').value)}},audio:$('audio').checked&&selected.startsWith('screen:')});
if(!running||stopping){stream.getTracks().forEach(t=>t.stop());return;}
stream.getVideoTracks()[0].contentHint='detail';
$('preview').srcObject=stream;$('placeholder').hidden=true;
stream.getVideoTracks()[0].addEventListener('ended',()=>{if(running&&!stopping&&!switching)stop('ERR_SOURCE_CLOSED',true);});
if($('audio').checked&&selected.startsWith('window:')){await startupPromise;nativeAudio=await createAppAudio();await window.vrshare.audioStart();nativeAudio.stream.getAudioTracks().forEach(track=>stream.addTrack(track));}
noAudio=!stream.getAudioTracks().length;
pipeline=await createCapturePipeline(stream,profile.height,{fps:profile.fps,ensureAudio:$('provider').value==='youtube'});
await window.vrshare.report({event:'pipeline-ready',...pipeline.stats()});
await startupPromise;
startRecorder(profile);
document.dispatchEvent(new Event('capture-ready'));
bytes=0;healthTimer=setInterval(()=>{if(pipeline)window.vrshare.report({event:'health',...pipeline.stats(),bytes,queued}).catch(()=>{});},10000);
status(noAudio?'noAudio':'waiting','connecting');
}catch(e){await window.vrshare.report({event:'start-error',error:e.message}).catch(()=>{});await stop(errorKey(e)==='genericError'?'captureError':errorKey(e),true);}finally{starting=false;controls();}
};
$('stop').onclick=()=>stop();$('refresh').onclick=refresh;
$('open-watch').onclick=async()=>{try{await window.vrshare.openWatch();}catch(e){status(errorKey(e),'warning');}};
$('copy').onclick=async()=>{try{await window.vrshare.copy($('url').value);copied=true;renderLanguage();setTimeout(()=>{copied=false;renderLanguage();},1800);}catch(e){status(errorKey(e),'error');}};
$('diagnostics').onclick=async()=>{await window.vrshare.diagnostics();diagnosticsCopied=true;renderLanguage();setTimeout(()=>{diagnosticsCopied=false;renderLanguage();},2500);};
$('language').onchange=()=>{language=$('language').value;pref.set('language',language);renderLanguage();};
function updateOffset(){const value=Number($('offset').value);$('offset-value').textContent=(value>0?'+':'')+value+' ms';pref.set('audioOffset',String(value));}
const savedOffset=Number(pref.get('audioOffset'));$('offset').value=Number.isFinite(savedOffset)?Math.max(-10000,Math.min(10000,savedOffset)):0;
$('offset').oninput=updateOffset;$('reset-offset').onclick=()=>{$('offset').value=0;updateOffset();};updateOffset();
window.vrshare.onStatus(s=>{
 if(!running||stopping)return;
 if(s.state==='reconnecting'){publicReady=false;document.dispatchEvent(new Event('reconnect-live'));return;}
 if(s.state==='error'){publicReady=false;stop(errorKey(s.message),true);}
 if(s.state==='link'||s.state==='checking'){
  publicReady=false;if(s.url)$('url').value=s.url;$('copy').disabled=true;$('open-watch').disabled=true;
  status(s.message||'publicChecking',s.message?.startsWith('WARN_')?'warning':'connecting');
 }
 if(s.state==='warning')status(errorKey(s.message),'warning');
 if(s.state==='live'){
  document.dispatchEvent(new Event('broadcast-live'));
  publicReady=true;publicDnsWarning=s.message==='WARN_LOCAL_DNS';$('url').value=s.url;$('copy').disabled=false;$('open-watch').disabled=false;
  status(s.message||(noAudio?'liveSilent':'liveStatus'),publicDnsWarning?'warning':'live');
 }
});


for(const [id,fallback] of [['quality','720'],['fps','30']]){const saved=pref.get(id);$(id).value=[...$(id).options].some(o=>o.value===saved)?saved:fallback;$(id).onchange=()=>{pref.set(id,$(id).value);controls();};}
$('apply-quality').onclick=async()=>{
 if(!running||starting||stopping||switching||$('apply-quality').disabled)return;
 switching=true;controls();status('changingQuality','connecting');
 try{
  const profile=VideoSettings.resolve($('quality').value,$('fps').value);
  if(recorder?.state!=='inactive')await new Promise(resolve=>{recorder.addEventListener('stop',resolve,{once:true});recorder.stop();});
  await pending;
  await window.vrshare.reconfigure(profile.height,Number($('offset').value),profile.fps);
  await stream.getVideoTracks()[0].applyConstraints({height:{ideal:profile.height,max:profile.height},frameRate:{ideal:profile.fps,max:profile.fps}});
  await pipeline.reconfigure(profile.height,profile.fps);
  startRecorder(profile);status(publicReady?(publicDnsWarning?'WARN_LOCAL_DNS':noAudio?'liveSilent':'liveStatus'):'publicChecking',publicReady&&!publicDnsWarning?'live':'connecting');
 }catch(error){await stop(errorKey(error),true);}finally{switching=false;controls();}
};
window.vrshare.onAudioEvent(event=>{
 if(event.type==='routed')$('audio-route').textContent=t('routedTo')+': '+event.message;
 if(event.type==='warning')$('audio-route').textContent=t(event.message);
 if(event.type==='restored')$('audio-route').textContent=t('audioRestored');
 if(event.type==='pending')$('audio-route').textContent=t('ERR_AUDIO_RESTORE');
 if(event.type==='error'&&running&&!stopping&&!starting&&!switching)stop(errorKey(event.message),true);
});
$('audio').onchange=updateSelection;
$('info').onclick=()=>{$('help-dialog').showModal();};
$('help-dialog').addEventListener('close',()=>{document.getElementById('info').focus();});
for(const id of ['help-close','help-done'])$(id).onclick=()=>$('help-dialog').close();
$('help-dialog').addEventListener('click',event=>{if(event.target!==$('help-dialog'))return;const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();});
renderLanguage();


let ytAccount=null;
function showYouTubeAccount(){if(!ytAccount)return;$('yt-account').textContent=ytAccount.connected?ytAccount.channel:t(ytAccount.configured?'ytDisconnected':'ERR_YT_CONFIG');$('yt-connect').hidden=false;$('yt-connect').dataset.connected=String(ytAccount.connected);$('yt-connect').dataset.i18n=ytAccount.connected?'ytConnected':'ytConnect';$('yt-connect').textContent=t($('yt-connect').dataset.i18n);$('yt-connect').disabled=running||ytAccount.connected;$('yt-disconnect').hidden=!ytAccount.connected;}
for(const id of ['provider','yt-title','yt-kids']){const v=pref.get(id);if(v!==null)$(id).value=v;$(id).addEventListener('change',()=>pref.set(id,$(id).value));}
if(!['youtube','tunnel'].includes($('provider').value))$('provider').value='tunnel';
async function updateYouTube(){ytAccount=await window.vrshare.youtubeStatus();showYouTubeAccount();}
$('yt-connect').onclick=async()=>{if(ytAccount?.connected)return;$('yt-connect').disabled=true;$('yt-account').textContent=t('ytSigningIn');try{ytAccount=await window.vrshare.youtubeConnect();$('provider').value='youtube';pref.set('provider','youtube');showYouTubeAccount();}catch(e){$('yt-account').textContent=t(errorKey(e));}finally{$('yt-connect').disabled=running||Boolean(ytAccount?.connected);}};
$('yt-disconnect').onclick=async()=>{$('yt-disconnect').disabled=true;try{await window.vrshare.youtubeDisconnect();$('provider').value='tunnel';pref.set('provider','tunnel');await updateYouTube();}catch(e){await updateYouTube();$('yt-account').textContent=t(errorKey(e));}finally{$('yt-disconnect').disabled=running;}};
$('language').addEventListener('change',showYouTubeAccount);
async function initializeApplication(){await refresh();updateYouTube().catch(()=>{$('yt-account').textContent=t('ERR_YT_API');});}

// Capture replacement preserves the existing service session and public URL.
async function changeLiveSource(source,force=false,audioEnabled=activeAudioEnabled){
 if(!running||starting||stopping||switching||(!force&&source.id===selected))return;
 switching=true;controls();status('switchingSource','connecting');
 const previousId=selected;let next=null,nextPipeline=null,committed=false;
 try{
  const profile=VideoSettings.resolve(appliedProfile.height,appliedProfile.fps);
  await window.vrshare.select(source.id);
  next=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:profile.fps,max:profile.fps},height:{ideal:profile.height,max:profile.height}},audio:audioEnabled&&source.id.startsWith('screen:')});
  if(stopping||!running)return;
  next.getVideoTracks()[0].contentHint='detail';
  // Validate that the replacement provides frames before interrupting the old source.
  nextPipeline=await createCapturePipeline(next,profile.height,{fps:profile.fps,ensureAudio:true});
  if(stopping||!running)return;
  committed=true;
  if(recorder?.state!=='inactive')await new Promise(resolve=>{recorder.addEventListener('stop',resolve,{once:true});recorder.stop();});
  await pending;
  await pipeline?.dispose();pipeline=null;
  await nativeAudio?.dispose();nativeAudio=null;await window.vrshare.audioStop();
  stream?.getTracks().forEach(track=>track.stop());stream=null;
  if(stopping||!running)return;
  if(audioEnabled&&source.id.startsWith('window:')){
   await nextPipeline.dispose();nextPipeline=null;
   nativeAudio=await createAppAudio();await window.vrshare.audioStart();
   nativeAudio.stream.getAudioTracks().forEach(track=>next.addTrack(track));
   nextPipeline=await createCapturePipeline(next,profile.height,{fps:profile.fps,ensureAudio:true});
  }
  if(stopping||!running)return;
  await window.vrshare.reconfigure(profile.height,Number($('offset').value),profile.fps);
  if(stopping||!running)return;
  stream=next;next=null;pipeline=nextPipeline;nextPipeline=null;
  selected=source.id;selectedLabel=source.name;selectedThumbnail=source.thumbnail;activeAudioEnabled=audioEnabled;
  const currentStream=stream;
  stream.getVideoTracks()[0].addEventListener('ended',()=>{if(stream===currentStream&&running&&!stopping)void stop('ERR_SOURCE_CLOSED',true);});
  noAudio=!stream.getAudioTracks().length;$('preview').srcObject=stream;
  document.dispatchEvent(new Event('source-changed'));startRecorder(profile);
  document.querySelectorAll('.source').forEach(b=>{const active=b.dataset.sourceId===selected;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  status(publicReady?(noAudio?'liveSilent':'liveStatus'):'waiting',publicReady?'live':'connecting');
  return true;
 }catch(error){
  if(committed){await stop(errorKey(error),true);}
  else{await window.vrshare.select(previousId).catch(()=>{});if(running&&!stopping){if(stream?.getVideoTracks()[0]?.readyState==='ended')await stop('ERR_SOURCE_CLOSED',true);else status('sourceSwitchFailed','warning');}}
 }finally{await nextPipeline?.dispose();next?.getTracks().forEach(track=>track.stop());if(!running||stopping){await nativeAudio?.dispose();nativeAudio=null;await window.vrshare.audioStop().catch(()=>{});}switching=false;controls();}
}
