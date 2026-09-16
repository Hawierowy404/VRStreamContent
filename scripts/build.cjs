const path=require('node:path'),fs=require('node:fs');
(async()=>{
 const {packager}=await import('@electron/packager');
 const root=path.resolve(__dirname,'..');
 const {checkRelease}=require('./check-release.cjs');
 const failures=checkRelease(root,{youtube:process.argv.includes('--youtube')});
 if(failures.length)throw Error(failures.join('\n'));
 if(!fs.existsSync(path.join(root,'bin','audio','VRStreamAudio.exe')))throw Error('Run npm run setup to build the Windows audio module first.');
 const result=await packager({dir:root,name:'VRStreamContent',platform:'win32',arch:'x64',out:path.join(root,'release'),overwrite:true,asar:false,electronZipDir:process.env.VRSTREAM_ELECTRON_ZIP_DIR||undefined,icon:path.join(root,'assets','app.ico'),ignore:[/^\/(release|native|work|test|scripts|\.github|\.cache|\.git)(\/|$)/],download:{cacheRoot:process.env.electron_config_cache||path.join(root,'.cache','electron')}});
 console.log(result.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});
