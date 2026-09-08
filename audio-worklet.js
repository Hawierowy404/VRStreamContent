class AppAudioProcessor extends AudioWorkletProcessor {
 constructor(){super();this.buffer=new Float32Array(48000);this.read=0;this.write=0;this.count=0;
 this.port.onmessage=({data})=>{const values=new Float32Array(data);for(let i=0;i<values.length;i++){this.buffer[this.write]=values[i];this.write=(this.write+1)%this.buffer.length;if(this.count<this.buffer.length)this.count++;else this.read=(this.read+1)%this.buffer.length;}
 // Bound latency even after the renderer stalls; never accumulate seconds of audio.
 const max=14400;if(this.count>max){const drop=this.count-max;this.read=(this.read+drop)%this.buffer.length;this.count=max;}
 };}
 process(_inputs,outputs){const channels=outputs[0];for(let i=0;i<channels[0].length;i++){
  const available=this.count>=2;for(let c=0;c<2;c++){const value=available?this.buffer[this.read]:0;if(available){this.read=(this.read+1)%this.buffer.length;this.count--;}if(channels[c])channels[c][i]=value;}
 }return true;}
}
registerProcessor('app-audio',AppAudioProcessor);
