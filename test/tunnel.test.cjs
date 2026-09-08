const test=require('node:test'),assert=require('node:assert/strict'),{EventEmitter}=require('node:events');
const {launchTunnel,sshPath}=require('../tunnel.cjs');
test('Alternate tunnel parses split HTTPS output and reports process loss once',{skip:!require('fs').existsSync(sshPath())},()=>{
 const child=new EventEmitter();child.stdout=new EventEmitter();child.stderr=new EventEmitter();let address,lost=0,connected=0;
 launchTunnel({port:1234,root:require('os').tmpdir(),diagnostics:{add(){}},onAddress:u=>address=u,onConnected:()=>connected++,onLost:()=>lost++,spawnProcess:(file,args)=>{assert.ok(args.includes('IdentityAgent=none'));assert.ok(args.includes('StrictHostKeyChecking=accept-new'));assert.ok(args.includes('80:127.0.0.1:1234'));return child;}});
 child.stdout.emit('data',Buffer.from('https://admin.localhost.run/\nhttps://abcd.lhr.'));assert.equal(address,undefined);
 child.stdout.emit('data',Buffer.from('life\n'));assert.equal(address,'https://abcd.lhr.life');assert.equal(connected,1);
 child.emit('error',Error('failure'));child.emit('exit',1);assert.equal(lost,1);
});
