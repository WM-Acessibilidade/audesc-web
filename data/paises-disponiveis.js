(function(){
  'use strict';
  const API='https://audesc-events-api.onrender.com';
  async function carregar(){
    try{
      const r=await fetch(API+'/paises-disponiveis');
      const j=await r.json();
      if(!r.ok||!Array.isArray(j.paises)) return;
      const codigos=j.paises.map(p=>p.codigo_iso);
      window.AUDESC_LOCAIS?.definirPaisesHabilitados(codigos);
      window.AUDESC_PAISES_DISPONIVEIS=j.paises;
      const select=document.getElementById('pais');
      if(select && window.AUDESC_LOCAIS){
        const atual=select.value||'Brasil';
        window.AUDESC_LOCAIS.preencherSelectPaises(select,atual,{incluirEspeciais:true});
        select.dispatchEvent(new Event('change',{bubbles:true}));
      }
      document.dispatchEvent(new CustomEvent('audesc:paises-disponiveis',{detail:{paises:j.paises}}));
    }catch(e){console.warn('Não foi possível carregar os países habilitados.',e);}
  }
  carregar();
})();
