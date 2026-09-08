const test=require('node:test'),assert=require('node:assert/strict');
const {validDevice}=require('../audio-outputs.cjs');
test('output selection accepts Windows endpoint IDs and rejects paths and command options',()=>{assert.equal(validDevice('{0.0.0.00000000}.{12345678-1234-1234-1234-123456789abc}'),'{0.0.0.00000000}.{12345678-1234-1234-1234-123456789abc}');for(const input of [null,'--help','C:\\Windows\\file','{bad}','device\nstop',''])assert.throws(()=>validDevice(input),/ERR_AUDIO_DEVICE/);});
