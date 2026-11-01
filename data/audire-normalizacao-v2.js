/* Shared by the admin preview and server. PCM16, mono; linear gain only. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else root.AudireNormalizacao=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const VERSAO='2.0.0';
  function medir(samples,sampleRate=24000){
    // Measure active 50 ms blocks, rather than letting pauses lower voice RMS.
    const size=Math.max(1,Math.round(sampleRate*.05)),blocks=[];
    let peak=0,maxRms=0;
    for(let start=0;start<samples.length;start+=size){
      const end=Math.min(samples.length,start+size);let energy=0;
      for(let i=start;i<end;i++){const x=samples[i]/32768;energy+=x*x;peak=Math.max(peak,Math.abs(x));}
      const rms=Math.sqrt(energy/(end-start));maxRms=Math.max(maxRms,rms);
      blocks.push({energy,count:end-start,rms});
    }
    const gate=Math.max(.0003,maxRms*.1);let energy=0,count=0;
    for(const b of blocks)if(b.rms>=gate){energy+=b.energy;count+=b.count;}
    return {rms:count?Math.sqrt(energy/count):0,pico:peak};
  }
  function normalizar(fragmentos,modo='moderada',sampleRate=24000){
    const m=['desativada','moderada','forte'].includes(modo)?modo:'moderada';
    const medidas=fragmentos.map(x=>medir(x,sampleRate));
    const ativos=medidas.filter(x=>x.rms>0&&x.pico>0);
    if(m==='desativada'||!ativos.length)return {fragmentos:fragmentos.map(x=>new Int16Array(x)),modo:m,referencia_rms:null,ganhos:fragmentos.map(()=>1)};
    // A common speech level must fit EVERY fragment's peaks. A loud outlier is
    // attenuated too. No clipping, compressor, limiter or cumulative processing.
    const ceiling=m==='forte'?.95:.89,maxGain=m==='forte'?16:8;
    let target=m==='forte'?.22:.18;
    for(const x of ativos)target=Math.min(target,x.rms*maxGain,x.rms*ceiling/x.pico);
    const ganhos=medidas.map(x=>x.rms>0&&x.pico>0?target/x.rms:1);
    const ajustados=fragmentos.map((samples,k)=>{
      const out=new Int16Array(samples.length),gain=ganhos[k];
      for(let i=0;i<samples.length;i++)out[i]=Math.max(-32768,Math.min(32767,Math.round(samples[i]*gain)));
      return out;
    });
    return {fragmentos:ajustados,modo:m,referencia_rms:target,ganhos};
  }
  return {VERSAO,medir,normalizar};
});
