(async()=>{
 const config=await window.testBridge.config();
 const source=document.createElement('canvas');source.width=320;source.height=180;
 const draw=()=>{const c=source.getContext('2d');c.fillStyle='#3366aa';c.fillRect(0,0,source.width,source.height);};
 draw();const raw=source.captureStream(0);let audioContext,oscillator;
 if(config.audio){audioContext=new AudioContext();const destination=audioContext.createMediaStreamDestination(),gain=audioContext.createGain();gain.gain.value=0;oscillator=audioContext.createConstantSource();oscillator.connect(gain).connect(destination);oscillator.start();await audioContext.resume();raw.addTrack(destination.stream.getAudioTracks()[0]);}
 // Deliver exactly one source frame, then leave the simulated window static.
 setTimeout(()=>{draw();raw.getVideoTracks()[0].requestFrame();},100);
 const pipeline=await createCapturePipeline(raw,config.height,{fps:config.fps});
 const recorder=new MediaRecorder(pipeline.stream,{mimeType:'video/webm;codecs=vp8,opus',videoBitsPerSecond:1500000});
 let bytes=0,chunks=0,pending=Promise.resolve(),failed;
 recorder.ondataavailable=event=>{if(event.data.size){bytes+=event.data.size;chunks++;pending=pending.then(async()=>window.testBridge.chunk(await event.data.arrayBuffer())).catch(e=>{failed=e.message;});}};
 recorder.start(250);
 const resize=setTimeout(()=>{source.width=180;source.height=320;draw();raw.getVideoTracks()[0].requestFrame();},5000);
 await new Promise(r=>setTimeout(r,config.seconds*1000));
 await new Promise(resolve=>{recorder.onstop=resolve;recorder.stop();});await pending;
 const stats=pipeline.stats();await pipeline.dispose();clearTimeout(resize);raw.getTracks().forEach(t=>t.stop());oscillator?.stop();await audioContext?.close();
 await window.testBridge.finish({bytes,chunks,stats,failed});
})().catch(error=>window.testBridge.finish({error:error.stack}));