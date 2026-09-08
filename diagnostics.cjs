class Diagnostics {
  constructor(){this.lines=[];}
  add(event,detail=''){
    const clean=String(detail).replace(/https?:\/\/[^\s"']+/g,'[url]').replace(/[a-f0-9]{48}/gi,'[stream-id]').replace(/[A-Z]:[\\/][^\r\n"]+/gi,'[path]').slice(0,1200);
    this.lines.push(new Date().toISOString()+' '+event+' '+clean);
    if(this.lines.length>160)this.lines.shift();
  }
  text(){return this.lines.join('\n');}
}
module.exports={Diagnostics};
