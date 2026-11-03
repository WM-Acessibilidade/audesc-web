(function(){
  'use strict';
  function uuid(){if(globalThis.crypto?.randomUUID)return crypto.randomUUID();return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g,c=>(c^(crypto.getRandomValues(new Uint8Array(1))[0]&15)>>c/4).toString(16));}
  function enviar(tipo,conteudoId,repoId){
    try{
      const id=uuid(),body=JSON.stringify({id,tipo,conteudo_id:conteudoId}),headers={'Content-Type':'application/json'};
      if(repoId){try{const t=sessionStorage.getItem('audire_presenca_repo_'+repoId);if(t)headers['x-audire-presenca']=t;}catch{}}
      const request=()=>fetch('https://audesc-events-api.onrender.com/audire/public/estatisticas',{method:'POST',headers,body,keepalive:true}).then(r=>{if(r.status>=500)throw Error('temporário');});
      request().catch(()=>setTimeout(()=>request().catch(()=>{}),1500));
    }catch{}
  }
  window.AudireEstatisticas={
    repositorio:r=>enviar('repositorio',r.id,r.id),
    roteiro(r,audio){
      enviar('roteiro',r.id,r.repositorio_id);
      if(!audio)return;
      let contou=false;
      audio.addEventListener('playing',()=>{if(!contou){contou=true;enviar('audio',r.id,r.repositorio_id);}});
      audio.addEventListener('ended',()=>{contou=false;});
    }
  };
})();
