const words={
pl:{language:'Język',title:'Podgląd transmisji na żywo',loading:'Łączenie z transmisją…',ready:'Gotowe. Naciśnij odtwarzanie, aby oglądać z dźwiękiem.',playing:'Transmisja na żywo',failed:'Nie można odtworzyć transmisji. Nadawca musi mieć włączoną aplikację i aktywny live.',unsupported:'Ta przeglądarka nie obsługuje tego strumienia.',retry:'Połącz ponownie',hint:'To podgląd w przeglądarce. Do VRChat wklej link .m3u8 z aplikacji. Zamknięcie aplikacji nadawcy wyłącza transmisję.'},
en:{language:'Language',title:'Live stream preview',loading:'Connecting to the stream…',ready:'Ready. Press play to watch with sound.',playing:'Live streaming',failed:'Cannot play the stream. The broadcaster must keep the app and live running.',unsupported:'This browser does not support this stream.',retry:'Reconnect',hint:'This is the browser preview. Paste the app’s .m3u8 link into VRChat. Closing the broadcaster’s app ends the stream.'},
ru:{language:'Язык',title:'Предпросмотр прямого эфира',loading:'Подключение к эфиру…',ready:'Готово. Нажмите воспроизведение для просмотра со звуком.',playing:'Прямой эфир',failed:'Не удалось воспроизвести. У ведущего должны быть открыты приложение и эфир.',unsupported:'Браузер не поддерживает этот поток.',retry:'Подключиться снова',hint:'Это предпросмотр в браузере. В VRChat вставьте ссылку .m3u8 из приложения. Закрытие приложения ведущего завершает эфир.'},
ja:{language:'言語',title:'ライブ配信のプレビュー',loading:'配信に接続中…',ready:'準備完了。再生を押すと音声付きで視聴できます。',playing:'ライブ配信中',failed:'再生できません。配信者がアプリを開き、配信を続けている必要があります。',unsupported:'このブラウザーは対応していません。',retry:'再接続',hint:'ブラウザー用のプレビューです。VRChatにはアプリの.m3u8リンクを貼り付けてください。配信者がアプリを閉じると終了します。'}};
let lang=words[navigator.language.slice(0,2)]?navigator.language.slice(0,2):'en',state='loading',hls;
const $=id=>document.getElementById(id),video=$('video');
function render(){document.documentElement.lang=lang;$('language').value=lang;for(const id of ['title','retry','hint'])$(id).textContent=words[lang][id];$('language-label').textContent=words[lang].language;$('status').textContent=words[lang][state];}
function status(value){state=value;render();}
function connect(){hls?.destroy();status('loading');const url=new URL('live.m3u8',location.href).href;
 if(typeof Hls==='undefined'){
  const script=document.createElement('script');script.src='hls.js';
  script.onload=()=>{script.remove();connect();};script.onerror=()=>{script.remove();status('failed');};
  document.head.appendChild(script);return;
 }
 if(Hls.isSupported()){hls=new Hls({liveSyncDurationCount:2,liveMaxLatencyDurationCount:3,maxLiveSyncPlaybackRate:1.1,backBufferLength:6});hls.on(Hls.Events.MANIFEST_PARSED,()=>status('ready'));hls.on(Hls.Events.ERROR,(_event,data)=>{if(data.fatal)status('failed');});hls.loadSource(url);hls.attachMedia(video);}
 else if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=url;video.addEventListener('loadedmetadata',()=>status('ready'),{once:true});}
 else status('unsupported');
}
video.addEventListener('playing',()=>status('playing'));video.addEventListener('error',()=>status('failed'));$('retry').onclick=connect;$('language').onchange=()=>{lang=$('language').value;render();};render();connect();
