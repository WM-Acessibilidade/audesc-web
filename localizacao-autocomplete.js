(function(){
'use strict';
const API_PADRAO='https://audesc-events-api.onrender.com';
function texto(v){return String(v||'').trim();}
function criar(opcoes){
  const input=opcoes.input;
  if(!input || input.dataset.audescAutocomplete==='1') return null;
  input.dataset.audescAutocomplete='1';
  const api=opcoes.api||API_PADRAO;
  const id='audesc-sugestoes-'+Math.random().toString(36).slice(2);
  const lista=document.createElement('ul');
  lista.id=id; lista.className='audesc-local-sugestoes'; lista.setAttribute('role','listbox'); lista.hidden=true;
  const aviso=document.createElement('div');
  aviso.className='audesc-local-aviso'; aviso.setAttribute('role','status'); aviso.setAttribute('aria-live','polite');
  input.insertAdjacentElement('afterend',lista); lista.insertAdjacentElement('afterend',aviso);
  input.setAttribute('role','combobox'); input.setAttribute('aria-autocomplete','list'); input.setAttribute('aria-controls',id); input.setAttribute('aria-expanded','false'); input.setAttribute('autocomplete','off');
  let timer=null, resultados=[], ativo=-1, controlador=null;
  function fechar(){lista.hidden=true; lista.innerHTML=''; resultados=[]; ativo=-1; input.setAttribute('aria-expanded','false'); input.removeAttribute('aria-activedescendant');}
  function marcar(indice){if(!resultados.length)return; ativo=(indice+resultados.length)%resultados.length; [...lista.children].forEach((el,i)=>el.setAttribute('aria-selected',i===ativo?'true':'false')); const el=lista.children[ativo]; if(el){input.setAttribute('aria-activedescendant',el.id); el.scrollIntoView({block:'nearest'});}}
  function selecionar(indice){const item=resultados[indice]; if(!item)return; input.value=item.endereco||item.nome||''; if(opcoes.latitude)opcoes.latitude.value=Number(item.lat).toFixed(6); if(opcoes.longitude)opcoes.longitude.value=Number(item.lon).toFixed(6); fechar(); aviso.textContent='Local selecionado e coordenadas preenchidas.'; input.dispatchEvent(new Event('change',{bubbles:true})); if(typeof opcoes.aoSelecionar==='function')opcoes.aoSelecionar(item);}
  function renderizar(itens){resultados=Array.isArray(itens)?itens.slice(0,5):[]; lista.innerHTML=''; ativo=-1; if(!resultados.length){fechar(); aviso.textContent='Nenhuma sugestão encontrada.'; return;} resultados.forEach((item,i)=>{const li=document.createElement('li'); li.id=id+'-'+i; li.setAttribute('role','option'); li.setAttribute('aria-selected','false'); li.tabIndex=-1; li.textContent=item.endereco||item.nome||''; li.addEventListener('mousedown',e=>e.preventDefault()); li.addEventListener('click',()=>selecionar(i)); lista.appendChild(li);}); lista.hidden=false; input.setAttribute('aria-expanded','true'); aviso.textContent=resultados.length+' sugestões disponíveis. Use as setas para navegar e Enter para selecionar.';}
  async function buscar(){const q=texto(input.value); if(q.length<3){fechar(); aviso.textContent=''; return;} if(controlador)controlador.abort(); controlador=new AbortController(); const ctx=typeof opcoes.contexto==='function'?(opcoes.contexto()||{}):{}; const params=new URLSearchParams({q,pais:ctx.pais||'',uf:ctx.uf||'',ufTexto:ctx.ufTexto||'',paisCodigo:ctx.paisCodigo||'',unidadeCodigo:ctx.unidadeCodigo||''}); aviso.textContent='Buscando sugestões de locais...'; try{const r=await fetch(api+'/places/suggestions?'+params.toString(),{signal:controlador.signal}); const j=await r.json().catch(()=>({})); if(!r.ok)throw new Error(j.error||'Não foi possível buscar sugestões.'); renderizar(j.sugestoes||[]);}catch(e){if(e.name!=='AbortError'){fechar(); aviso.textContent='Não foi possível carregar sugestões. Você ainda pode usar o botão de busca pelo endereço.';}}}
  input.addEventListener('input',()=>{clearTimeout(timer); timer=setTimeout(buscar,350);});
  input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&resultados.length){e.preventDefault();marcar(ativo+1);}else if(e.key==='ArrowUp'&&resultados.length){e.preventDefault();marcar(ativo-1);}else if(e.key==='Enter'&&resultados.length){e.preventDefault();selecionar(ativo>=0?ativo:0);}else if(e.key==='Escape'){fechar();}});
  input.addEventListener('blur',()=>setTimeout(fechar,180));
  return {buscar,fechar};
}
window.AudescAutocomplete={criar};
})();
