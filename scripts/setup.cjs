const path=require('node:path'),fs=require('node:fs'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
process.env.electron_config_cache=process.env.electron_config_cache||path.join(root,'.cache','electron');
function run(file){const result=spawnSync(process.execPath,[file],{cwd:root,env:process.env,stdio:'inherit',windowsHide:true});if(result.status!==0)process.exit(result.status||1);}
if(!fs.existsSync(path.join(root,'node_modules','electron','dist','electron.exe')))run(path.join(root,'node_modules','electron','install.js'));
if(!fs.existsSync(require('ffmpeg-static')))run(path.join(root,'node_modules','ffmpeg-static','install.js'));
if(!fs.existsSync(path.join(root,'bin','cloudflared.exe')))run(path.join(root,'download-tunnel.cjs'));

if(!fs.existsSync(path.join(root,'bin','audio','VRStreamAudio.exe')))run(path.join(root,'scripts','build-audio.cjs'));
