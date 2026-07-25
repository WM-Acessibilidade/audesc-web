// Modalidades e abrangências da divulgação do Audesc.
(function(){
  'use strict';
  const modalidades=Object.freeze([
    {codigo:'presencial',nome:'Presencial'},
    {codigo:'distancia',nome:'Transmissão a distância'},
    {codigo:'hibrido',nome:'Presencial e transmissão a distância'}
  ]);
  const abrangencias=Object.freeze([
    {codigo:'nacional',nome:'Nacional'},
    {codigo:'internacional',nome:'Internacional'}
  ]);
  const paisesDivulgacao=()=> (window.AUDESC_LOCAIS?.nomesPaises(false)||[]).slice();
  const nome=(lista,codigo)=>lista.find(i=>i.codigo===codigo)?.nome||codigo||'';
  window.AUDESC_MODALIDADES_EVENTO=Object.freeze({
    modalidades, abrangencias, paisesDivulgacao,
    nomeModalidade(c){return nome(modalidades,c);},
    nomeAbrangencia(c){return nome(abrangencias,c);},
    temTransmissao(c){return c==='distancia'||c==='hibrido';}
  });
})();
