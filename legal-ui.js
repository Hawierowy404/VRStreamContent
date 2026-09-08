(()=>{
 const languages=[['pl','Polski'],['en','English'],['ru','Русский'],['ja','日本語'],['de','Deutsch'],['fr','Français'],['ko','한국어'],['zh','中文（简体）']];
 const dialog=$('terms-dialog');let accepted=false,version=null,initialized=false;
 for(const [code,name] of languages){const option=document.createElement('option');option.value=code;option.textContent=name;$('language').append(option);}
 function picker(host){
  host.className='language-picker';
  const trigger=document.createElement('button');trigger.className='secondary language-trigger';trigger.type='button';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
  const list=document.createElement('div');list.className='language-list';list.id=host.id+'-list';list.setAttribute('role','listbox');list.hidden=true;trigger.setAttribute('aria-controls',list.id);
  function close(focus=false){list.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}
  function choose(code){$('language').value=code;$('language').dispatchEvent(new Event('change'));close(true);}
  function content(element,code,name){element.replaceChildren();const img=document.createElement('img');img.src='assets/flags/'+code+'.svg';img.alt='';img.width=24;img.height=16;const text=document.createElement('span');text.textContent=name;element.append(img,text);}
  for(const [code,name] of languages){const button=document.createElement('button');button.type='button';button.setAttribute('role','option');button.dataset.language=code;content(button,code,name);button.onclick=()=>choose(code);list.append(button);}
  function open(){list.hidden=false;trigger.setAttribute('aria-expanded','true');list.querySelector('[aria-selected="true"]')?.focus();}
  trigger.onclick=()=>list.hidden?open():close();
  trigger.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();}};
  list.onkeydown=e=>{const buttons=[...list.children],i=buttons.indexOf(document.activeElement);let next;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);return;}if(e.key==='ArrowDown')next=(i+1)%buttons.length;if(e.key==='ArrowUp')next=(i-1+buttons.length)%buttons.length;if(e.key==='Home')next=0;if(e.key==='End')next=buttons.length-1;if(next!==undefined){e.preventDefault();buttons[next].focus();}};
  host.addEventListener('focusout',e=>{if(!host.contains(e.relatedTarget))close();});
  document.addEventListener('click',e=>{if(!host.contains(e.target))close();});
  function render(){const name=languages.find(([code])=>code===language)[1];content(trigger,language,name);trigger.setAttribute('aria-label',t('language')+': '+name);list.setAttribute('aria-label',t('language'));for(const button of list.children)button.setAttribute('aria-selected',String(button.dataset.language===language));}
  host.append(trigger,list);document.addEventListener('language-rendered',render);render();
 }
 picker($('settings-language-picker'));picker($('terms-language-picker'));
 function render(){const body=$('terms-body');body.replaceChildren();for(const [title,text] of legalDocuments[language]){const h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=text;body.append(h,p);}$('terms-version').textContent=version||'';}
 document.addEventListener('language-rendered',render);
 function show(){render();$('terms-check').checked=false;$('terms-accept').disabled=true;for(const id of ['terms-check-row','terms-accept','terms-decline'])$(id).hidden=accepted;$('terms-close').hidden=!accepted;$('terms-error').textContent='';dialog.showModal();}
 dialog.addEventListener('cancel',event=>{if(!accepted)event.preventDefault();});
 $('terms-open').onclick=show;$('terms-close').onclick=()=>dialog.close();
 $('terms-check').onchange=()=>{$('terms-accept').disabled=!$('terms-check').checked;};
 $('terms-decline').onclick=()=>window.vrshare.quit();
 $('terms-accept').onclick=async()=>{if(!$('terms-check').checked)return;$('terms-accept').disabled=true;try{const result=await window.vrshare.termsAccept(version);if(!result.accepted)throw Error('ERR_TERMS_SAVE');accepted=true;dialog.close();await initialize();}catch{$('terms-error').textContent=t('ERR_TERMS_SAVE');$('terms-accept').disabled=false;}};
 async function initialize(){if(initialized)return;initialized=true;await initializeApplication();}
 for(const button of document.querySelectorAll('[data-external]'))button.onclick=()=>window.vrshare.externalLink(button.dataset.external).catch(()=>{$('terms-error').textContent=t('genericError');});
 $('support').onclick=async()=>{try{await window.vrshare.supportOpen();}catch{$('diagnostics-result').textContent=t('ERR_SUPPORT');}};
 window.vrshare.supportStatus().then(enabled=>{$('support').disabled=!enabled;}).catch(()=>{});
 renderLanguage();
 window.vrshare.termsStatus().then(async state=>{version=state.version;accepted=state.accepted;if(accepted)await initialize();else show();}).catch(()=>{show();$('terms-error').textContent=t('ERR_TERMS_SAVE');});
})();
