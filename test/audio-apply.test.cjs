const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('audio draft is applied only by its own button, including source enablement',async()=>{
 const file=fs.readFileSync(require.resolve('../features.js'),'utf8');const code=file.slice(file.indexOf(' const savedVolume='),file.indexOf(' const profiles='));
 const elements={};for(const id of ['stream-volume','volume-value','apply-audio','audio-applied','audio'])elements[id]={value:'',checked:true,disabled:false,addEventListener(){}};
 const gains=[],switches=[],stored={};const context={Number,Math,Boolean,String,muted:false,starting:false,stopping:false,switching:false,running:true,activeAudioEnabled:true,selected:'window:1',selectedLabel:'Window',selectedThumbnail:'',t:x=>x,$:id=>elements[id],pref:{get:()=>null,set:(k,v)=>stored[k]=v},pipeline:{setVolume:v=>gains.push(v),setMuted(){}},document:{addEventListener(){}},changeLiveSource:async(source,force,audio)=>{switches.push(audio);return true;}};
 vm.createContext(context);vm.runInContext(code,context);
 elements['stream-volume'].value='25';elements['stream-volume'].oninput();assert.deepEqual(gains,[1]);assert.equal(elements['apply-audio'].disabled,false);
 await elements['apply-audio'].onclick();assert.deepEqual(gains,[1,.25]);assert.equal(stored.streamVolume,'25');assert.deepEqual(switches,[]);assert.equal(elements['apply-audio'].disabled,true);
 elements.audio.checked=false;vm.runInContext('audioControls()',context);await elements['apply-audio'].onclick();assert.deepEqual(switches,[false]);assert.equal(context.activeAudioEnabled,false);
});
