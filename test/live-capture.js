(async()=>{
 const canvas=document.createElement('canvas');canvas.width=320;canvas.height=180;canvas.getContext('2d').fillRect(0,0,320,180);
 const source=canvas.captureStream(0);setTimeout(()=>source.getVideoTracks()[0].requestFrame(),100);
 const audio=await createAppAudio();audio.stream.getAudioTracks().forEach(t=>source.addTrack(t));
 const pipeline=await createCapturePipeline(source,480,{fps:15});let pending=Promise.resolve(),recorder;
 function record(){recorder=new MediaRecorder(pipeline.stream,{mimeType:'video/webm;codecs=vp8,opus'});recorder.ondataavailable=event=>{if(event.data.size)pending=pending.then(async()=>testBridge.chunk(await event.data.arrayBuffer()));};recorder.start(250);}
 async function finish(){await new Promise(r=>{recorder.onstop=r;recorder.stop();});await pending;}
 record();await new Promise(r=>setTimeout(r,7000));await finish();
 await testBridge.change();await pipeline.reconfigure(720,60);record();await new Promise(r=>setTimeout(r,7000));await finish();
 const stats=pipeline.stats();await pipeline.dispose();await audio.dispose();source.getTracks().forEach(t=>t.stop());await testBridge.finish({stats});
})().catch(e=>testBridge.finish({error:e.stack||String(e)}));
