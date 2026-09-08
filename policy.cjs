const fs=require('node:fs'),path=require('node:path');
const VERSION='2026-09-07.1';
class Policy {
 constructor(directory){this.file=path.join(directory,'terms-acceptance.json');}
 status(){try{return {version:VERSION,accepted:JSON.parse(fs.readFileSync(this.file,'utf8')).version===VERSION};}catch{return {version:VERSION,accepted:false};}}
 require(){if(!this.status().accepted)throw Error('ERR_TERMS');}
 accept(version){if(version!==VERSION)throw Error('ERR_TERMS');try{fs.mkdirSync(path.dirname(this.file),{recursive:true});fs.writeFileSync(this.file+'.tmp',JSON.stringify({version:VERSION,acceptedAt:new Date().toISOString()}));fs.renameSync(this.file+'.tmp',this.file);}catch{throw Error('ERR_TERMS_SAVE');}return this.status();}
}
const LINKS=Object.freeze({youtubeTerms:'https://www.youtube.com/t/terms',googlePrivacy:'https://policies.google.com/privacy',googleAccess:'https://myaccount.google.com/permissions',youtubeStudio:'https://studio.youtube.com/',localhostPrivacy:'https://localhost.run/docs/security/',cloudflarePrivacy:'https://www.cloudflare.com/privacypolicy/'});
module.exports={Policy,VERSION,LINKS};
