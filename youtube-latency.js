(function(root){
 const modes=['ultraLow','low','normal'];
 function minimum(quality){return Number(quality)>1440?2:Number(quality)>1080?1:0;}
 function resolve(quality,mode){const index=mode===undefined?minimum(quality):modes.indexOf(mode);if(index<minimum(quality)||index<0)throw Error('ERR_YT_LATENCY');return modes[index];}
 const api={modes,minimum,resolve};if(typeof module!=='undefined')module.exports=api;else root.YouTubeLatency=api;
})(typeof window!=='undefined'?window:this);
