(()=>{
 const dialog=document.getElementById('preferences-dialog');
 const open=document.getElementById('settings-open');
 const setTheme=value=>{
  const theme=['dark','light','rgb','rainbow'].includes(value)?value:'dark';
  document.documentElement.dataset.theme=theme;
  document.querySelectorAll('input[name="theme"]').forEach(input=>input.checked=input.value===theme);
  document.getElementById('motion-stop').hidden=!['rgb','rainbow'].includes(theme);
  pref.set('theme',theme);
 };
 // Animated mode requires deliberate activation on every app launch.
 setTheme(['light','rgb'].includes(pref.get('theme'))?pref.get('theme'):'dark');
 open.onclick=()=>dialog.showModal();
 document.getElementById('settings-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>open.focus());
 document.querySelectorAll('input[name="theme"]').forEach(input=>input.onchange=()=>setTheme(input.value));
 document.getElementById('motion-stop').onclick=()=>setTheme('dark');
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&['rgb','rainbow'].includes(document.documentElement.dataset.theme))setTheme('dark');});
})();
