const appAudioWorkletUrl=new URL('./audio-worklet.js',document.currentScript.src).href;
async function createAppAudio(){
 const context=new AudioContext({sampleRate:48000});
 let unsubscribe,node;
 try {
  await context.audioWorklet.addModule(appAudioWorkletUrl);
  node=new AudioWorkletNode(context,'app-audio',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});
  const destination=context.createMediaStreamDestination();node.connect(destination);
  unsubscribe=window.vrshare.onAudio(data=>{const copy=new Uint8Array(data).slice();node.port.postMessage(copy.buffer,[copy.buffer]);});
  await context.resume();
  return {stream:destination.stream,dispose:async()=>{unsubscribe();node.disconnect();destination.stream.getTracks().forEach(t=>t.stop());await context.close();}};
 }catch(error){unsubscribe?.();node?.disconnect();await context.close();throw error;}
}

