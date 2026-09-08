(()=>{
 let busyOutput=false,loaded=false;
 const section=document.createElement('details');section.className='output-settings';section.open=true;
 section.innerHTML='<summary data-i18n="outputTitle"></summary><label for="output-device" data-i18n="outputDevice"></label><select id="output-device"></select><div class="output-buttons"><button id="output-refresh" class="text-button" data-i18n="refresh"></button><button id="output-app" class="secondary" data-i18n="outputApp"></button><button id="output-system" class="secondary" data-i18n="outputSystem"></button></div><p class="hint" data-i18n="outputHint"></p><p id="output-result" class="hint" role="status"></p>';
 document.querySelector('.audio-panel').append(section);
 function state(){const blocked=busyOutput||!running||starting||stopping||switching||!$('output-device').value;$('output-app').disabled=blocked||!nativeAudio;$('output-system').disabled=blocked;$('output-refresh').disabled=busyOutput;$('output-device').disabled=busyOutput;}
 async function refreshOutputs(){try{const chosen=$('output-device').value;const list=await window.vrshare.audioOutputs();$('output-device').replaceChildren();for(const d of list){const option=document.createElement('option');option.value=d.id;option.textContent=d.name+(d.isDefault?' ★':'');$('output-device').append(option);}if(list.some(d=>d.id===chosen))$('output-device').value=chosen;loaded=true;}catch{$('output-result').textContent=t('ERR_AUDIO_DEVICE');}state();}
 section.addEventListener('toggle',()=>{if(section.open&&!loaded)void refreshOutputs();});$('output-refresh').onclick=refreshOutputs;
 async function change(system){if(busyOutput||!running||starting||stopping||switching)return;busyOutput=true;state();$('output-result').textContent=t('outputChanging');try{const id=$('output-device').value;if(system){await window.vrshare.systemOutput(id);if(running&&!stopping&&selected?.startsWith('screen:')&&activeAudioEnabled)await changeLiveSource({id:selected,name:selectedLabel,thumbnail:selectedThumbnail},true);}else await window.vrshare.audioRoute(id);$('output-result').textContent=t('outputChanged');await refreshOutputs();}catch{$('output-result').textContent=t('ERR_AUDIO_DEVICE');}finally{busyOutput=false;state();}}
 $('output-app').onclick=()=>change(false);$('output-system').onclick=()=>change(true);
 document.addEventListener('language-rendered',()=>{section.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));});
 section.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));setInterval(state,250);state();
})();
