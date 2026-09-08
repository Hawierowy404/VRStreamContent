const VideoSettings=(()=>{
  const sizes={480:{width:854,height:480,bitrate:1200000},720:{width:1280,height:720,bitrate:2800000},1080:{width:1920,height:1080,bitrate:5000000},1440:{width:2560,height:1440,bitrate:8500000},2160:{width:3840,height:2160,bitrate:18000000}};
  function resolve(height=720,fps=30){
    const size=sizes[Number(height)];fps=Number(fps);
    if(!size||![15,30,60].includes(fps))throw Error('ERR_SETTINGS');
    const multiplier=fps===60?1.7:fps===15?0.65:1;
    const bitrate=Math.round(size.bitrate*multiplier);
    return {...size,fps,bitrate,maxrate:Math.round(bitrate*1.3),bufsize:Math.round(bitrate*2.6),captureBitrate:Math.round(bitrate*1.4)};
  }
  return {resolve};
})();
if(typeof module!=='undefined')module.exports=VideoSettings;

