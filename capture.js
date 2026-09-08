// Feed the recorder a steady-size, steady-cadence video track, even if
// desktop capture only emits a new frame when the selected window changes.
async function createCapturePipeline(input, height, options={}) {
  let profile=VideoSettings.resolve(height,options.fps??30);
  const canvas=document.createElement('canvas');
  canvas.width=profile.width;canvas.height=profile.height;
  const context=canvas.getContext('2d',{alpha:false});
  const video=document.createElement('video');video.muted=true;video.playsInline=true;video.srcObject=input;
  let volume=1,muted=false;
  let timer,audioContext,silence,audioSource,output,analyser,gain,disposed=false,frames=0;
  const dispose=async()=>{
    if(disposed)return;disposed=true;clearInterval(timer);
    output?.getVideoTracks().forEach(t=>t.stop());
    video.pause();video.srcObject=null;
    silence?.stop();audioSource?.disconnect();
    if(audioContext&&audioContext.state!=='closed')await audioContext.close();
    output?.getAudioTracks().forEach(t=>t.stop());
  };
  try {
    await new Promise((resolve,reject)=>{
      const cleanup=()=>{clearTimeout(timeout);video.removeEventListener('loadeddata',ready);input.getVideoTracks()[0]?.removeEventListener('ended',ended);options.signal?.removeEventListener('abort',ended);};
      const ready=()=>{if(video.readyState>=2&&video.videoWidth){cleanup();resolve();}};
      const ended=()=>{cleanup();reject(Error('ERR_SOURCE_FRAME'));};
      const timeout=setTimeout(ended,15000);
      video.addEventListener('loadeddata',ready);
      input.getVideoTracks()[0]?.addEventListener('ended',ended);
      options.signal?.addEventListener('abort',ended,{once:true});
      if(options.signal?.aborted)return ended();
      video.play().then(ready,e=>{cleanup();reject(e);});
    });
    output=canvas.captureStream(0);
    const track=output.getVideoTracks()[0];
    // Prefer preserving readable detail when the recorder is under load.
    track.contentHint='detail';
    if(typeof track.requestFrame!=='function')throw Error('ERR_SOURCE_FRAME');
    if(input.getAudioTracks().length||options.ensureAudio){
      audioContext=new AudioContext({sampleRate:48000});
      const destination=audioContext.createMediaStreamDestination();
      // Keep the audio timeline alive even when Windows loopback has no samples.
      const silentGain=audioContext.createGain();silentGain.gain.value=0;
      silence=audioContext.createConstantSource();silence.connect(silentGain).connect(destination);silence.start();
      if(input.getAudioTracks().length){audioSource=audioContext.createMediaStreamSource(new MediaStream(input.getAudioTracks()));gain=audioContext.createGain();analyser=audioContext.createAnalyser();analyser.fftSize=256;audioSource.connect(gain).connect(analyser).connect(destination);}
      await audioContext.resume();
      if(audioContext.state!=='running')throw Error('ERR_AUDIO');
      destination.stream.getAudioTracks().forEach(t=>output.addTrack(t));
    }
    function draw(){
      if(disposed)return;
      if(video.readyState>=2&&video.videoWidth&&video.videoHeight){
        const scale=Math.min(canvas.width/video.videoWidth,canvas.height/video.videoHeight);
        const width=Math.round(video.videoWidth*scale),height=Math.round(video.videoHeight*scale);
        context.fillStyle='#000';context.fillRect(0,0,canvas.width,canvas.height);
        context.drawImage(video,Math.floor((canvas.width-width)/2),Math.floor((canvas.height-height)/2),width,height);
      }
      track.requestFrame();frames++;
    }
    draw();timer=setInterval(draw,1000/profile.fps);
    return {stream:output,dispose,setVolume:value=>{volume=Math.max(0,Math.min(1,Number(value)||0));if(gain)gain.gain.value=muted?0:volume;},setMuted:value=>{muted=Boolean(value);if(gain)gain.gain.value=muted?0:volume;},level:()=>{if(!analyser)return 0;const data=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(data);return Math.min(1,Math.sqrt(data.reduce((n,x)=>n+x*x,0)/data.length)*4);},reconfigure:async(height,fps)=>{profile=VideoSettings.resolve(height,fps);clearInterval(timer);canvas.width=profile.width;canvas.height=profile.height;draw();timer=setInterval(draw,1000/profile.fps);await new Promise(resolve=>setTimeout(resolve,Math.ceil(2000/profile.fps)));},stats:()=>({frames,fps:profile.fps,width:canvas.width,height:canvas.height,audio:audioContext?.state||'none'})};
  } catch(error){await dispose();throw error;}
}
if(typeof module!=='undefined')module.exports={createCapturePipeline};
