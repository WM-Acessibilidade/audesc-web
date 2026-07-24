(function(){
  'use strict';
  const lista=Object.freeze([
    Object.freeze({codigo:'livre',nome:'Livre'}),
    Object.freeze({codigo:'10',nome:'10 anos'}),
    Object.freeze({codigo:'12',nome:'12 anos'}),
    Object.freeze({codigo:'14',nome:'14 anos'}),
    Object.freeze({codigo:'16',nome:'16 anos'}),
    Object.freeze({codigo:'18',nome:'18 anos'})
  ]);
  const mapa=Object.freeze(Object.fromEntries(lista.map(item=>[item.codigo,item.nome])));
  window.AUDESC_CLASSIFICACOES_ETARIAS=Object.freeze({
    lista,
    nome(codigo){return mapa[String(codigo??'').trim()]||'';},
    valida(codigo){return Object.prototype.hasOwnProperty.call(mapa,String(codigo??'').trim());}
  });
})();
