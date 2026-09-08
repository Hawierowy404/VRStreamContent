(()=>{
 const slider=$('yt-latency'),keys=['latencyUltra','latencyLow','latencyNormal'];
 const saved=Number(pref.get('youtubeLatency')??0);slider.value=Number.isInteger(saved)&&saved>=0&&saved<=2?saved:0;
 function render(){
  if(!running){const minimum=YouTubeLatency.minimum($('quality').value);slider.min=String(minimum);if(Number(slider.value)<minimum)slider.value=String(minimum);}
  slider.disabled=running||starting||stopping||$('provider').value!=='youtube';
  const label=t(keys[Number(slider.value)]);$('yt-latency-value').textContent=label;slider.setAttribute('aria-valuetext',label);
 }
 slider.oninput=()=>{pref.set('youtubeLatency',slider.value);render();};
 for(const id of ['quality','provider'])$(id).addEventListener('change',render);
 document.addEventListener('language-rendered',render);setInterval(render,250);render();
})();
