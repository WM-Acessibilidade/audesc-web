const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const repo='11111111-1111-4111-8111-111111111111',roteiro='22222222-2222-4222-8222-222222222222',event='33333333-3333-4333-8333-333333333333';
test('pause/resume do not recount; completed replay does; retries keep the event ID',async()=>{
 const calls=[],pending=[],listeners={};let counter=0;
 const context={window:{},crypto:{randomUUID:()=>String(++counter)},sessionStorage:{getItem:()=>null},fetch:async(url,opt)=>{calls.push(JSON.parse(opt.body));if(calls.length===1)throw Error('offline');return {status:204};},setTimeout:f=>pending.push(f)};
 context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(process.env.AUDIRE_TRACKER_TEST_FILE||'data/audire-estatisticas-v1.js','utf8'),context);
 context.window.AudireEstatisticas.roteiro({id:roteiro,repositorio_id:repo},{addEventListener:(name,fn)=>listeners[name]=fn});
 listeners.playing();listeners.playing();await new Promise(resolve=>setImmediate(resolve));assert.equal(calls.filter(x=>x.tipo==='audio').length,1);
 listeners.ended();listeners.playing();assert.equal(calls.filter(x=>x.tipo==='audio').length,2);
 pending[0]();await new Promise(resolve=>setImmediate(resolve));assert.equal(calls.at(-1).id,calls[0].id);
});
test('missing storage and failed requests do not break the public page',()=>{
 const c={window:{},crypto:{randomUUID:()=>event},sessionStorage:{getItem:()=>{throw Error('blocked');}},fetch:()=>{throw Error('network');}};c.globalThis=c;vm.createContext(c);vm.runInContext(fs.readFileSync(process.env.AUDIRE_TRACKER_TEST_FILE||'data/audire-estatisticas-v1.js','utf8'),c);assert.doesNotThrow(()=>c.window.AudireEstatisticas.repositorio({id:repo}));
});
