(function(){
  'use strict';
  const API='https://audesc-events-api.onrender.com';
  const SELETORES_PAIS=['#pais','#paisFiltro','#paisSelecionado','select[data-audesc-paises]'];

  function catalogoOrdenado(paises){
    return [...paises].sort((a,b)=>String(a.nome||'').localeCompare(String(b.nome||''),'pt-BR',{sensitivity:'base'}));
  }

  function selectsDePais(){
    const encontrados=[];
    for(const seletor of SELETORES_PAIS){
      document.querySelectorAll(seletor).forEach(select=>{if(!encontrados.includes(select)) encontrados.push(select);});
    }
    return encontrados;
  }

  function atualizarSelects(paises){
    if(!window.AUDESC_LOCAIS) return;
    const ordenados=catalogoOrdenado(paises);
    const codigos=ordenados.map(p=>String(p.codigo_iso||'').toUpperCase()).filter(Boolean);
    window.AUDESC_LOCAIS.definirPaisesHabilitados(codigos);
    window.AUDESC_PAISES_DISPONIVEIS=ordenados;

    selectsDePais().forEach(select=>{
      const atual=select.value||select.dataset.valorInicial||'Brasil';
      window.AUDESC_LOCAIS.preencherSelectPaises(select,atual,{incluirEspeciais:true});
      if([...select.options].some(o=>o.value===atual)) select.value=atual;
      select.dispatchEvent(new Event('change',{bubbles:true}));
    });

    document.dispatchEvent(new CustomEvent('audesc:paises-disponiveis',{detail:{paises:ordenados}}));
  }

  async function carregar(){
    try{
      const r=await fetch(API+'/paises-disponiveis',{cache:'no-store'});
      const j=await r.json().catch(()=>({}));
      if(!r.ok||!Array.isArray(j.paises)||!j.paises.length) throw new Error(j.error||'O servidor não retornou países habilitados.');
      atualizarSelects(j.paises);
    }catch(e){
      console.warn('Não foi possível carregar os países habilitados.',e);
      // Mantém a lista incorporada, mas a organiza alfabeticamente.
      const locais=window.AUDESC_LOCAIS?.paises||[];
      if(locais.length){
        atualizarSelects(locais.map(p=>({codigo_iso:p.codigo,nome:p.nome})));
      }
    }
  }

  document.addEventListener('DOMContentLoaded',carregar,{once:true});
  if(document.readyState!=='loading') carregar();
})();
