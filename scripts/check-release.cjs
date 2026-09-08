const fs=require('node:fs'),path=require('node:path');
function checkRelease(root,{youtube=false}={}){
 const failures=[];
 for(const file of ['main.cjs','preload.cjs','renderer.js','preferences.js','youtube.cjs','youtube-stream.cjs','youtube-i18n.js','extra-i18n.js','legal-i18n.js','legal-ui.js','policy.cjs','updates.cjs','features.js','features-i18n.js','audio-outputs.cjs','output-ui.js','output-i18n.js','youtube-latency.js','latency-i18n.js','latency-ui.js','encoder-progress.cjs','support.json','TERMS-AND-PRIVACY.md','assets/app.ico','assets/logo.png','bin/audio/VRStreamAudio.exe','bin/audio/coreclr.dll','node_modules/ffmpeg-static/ffmpeg.exe']){
  if(!fs.existsSync(path.join(root,file)))failures.push('Missing runtime file: '+file);
 }
 for(const name of fs.readdirSync(root))if(/^(youtube-account|\.env(?:\.|$))/.test(name))failures.push('Personal data must not be included: '+name);
 if(youtube){
  try{const raw=JSON.parse(fs.readFileSync(path.join(root,'youtube-client.json'),'utf8'));const c=raw.installed||raw;
   if(raw.web||!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(c.client_id)||/^(test|example|replace)/i.test(c.client_id))throw Error();
  }catch{failures.push('YouTube release requires the publisher\'s real Desktop OAuth client in youtube-client.json.');}
 }
 return failures;
}
if(require.main===module){const root=path.resolve(__dirname,'..');const failures=checkRelease(root,{youtube:process.argv.includes('--youtube')});if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('Runtime files checked. Real Google sign-in and PC/Quest playback still require release acceptance testing.');}
module.exports={checkRelease};
