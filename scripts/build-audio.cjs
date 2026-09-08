const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const args=['publish',path.join(root,'native','AudioBridge','AudioBridge.csproj'),'-c','Release','-r','win-x64','--self-contained','true','-o',path.join(root,'bin','audio')];
const result=spawnSync(process.env.DOTNET_EXE||'dotnet',args,{cwd:root,env:process.env,stdio:'inherit',windowsHide:true});
if(result.error)console.error('Install .NET 10 SDK to build from source. The portable Windows release includes its runtime.');
process.exitCode=result.status??1;


if(result.status===0){for(const [from,to] of [['DotNet-LICENSE.txt','LICENSE.txt'],['DotNet-ThirdPartyNotices.txt','ThirdPartyNotices.txt']])fs.copyFileSync(path.join(root,'licenses',from),path.join(root,'bin','audio',to));}

