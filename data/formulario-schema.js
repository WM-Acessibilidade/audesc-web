(function(){
  'use strict';
  const campos=[
    {codigo:'titulo_original',nome:'Nome do evento',grupo:'identificacao',tipo:'texto',configuravel:false,limites:{minimo:10,maximo:150}},
    {codigo:'descricao_original',nome:'Descrição do evento',grupo:'identificacao',tipo:'textarea',configuravel:true,limites:{minimo:100,maximo:1500}},
    {codigo:'tipo_evento',nome:'Visibilidade pública ou restrita',grupo:'identificacao',tipo:'select',configuravel:true,regraPorServico:true,boxId:'tipoEventoBox'},
    {codigo:'divulgar_acesso_ouvintes',nome:'Permitir acesso de ouvintes pela página pública',grupo:'identificacao',tipo:'booleano',configuravel:true,regraPorServico:true,boxId:'acessoOuvintesBox'},
    {codigo:'data_evento',nome:'Data e horário do evento',grupo:'data_capacidade',tipo:'datetime',configuravel:true,boxId:'dataEventoBox'},
    {codigo:'duracao_horas',nome:'Duração em horas',grupo:'data_capacidade',tipo:'select',configuravel:true,regraPorServico:true,boxId:'duracaoBox'},
    {codigo:'max_ouvintes',nome:'Quantidade máxima de ouvintes',grupo:'data_capacidade',tipo:'select',configuravel:true,regraPorServico:true,boxId:'ouvintesBox'},
    {codigo:'local_evento',nome:'Nome ou endereço do local do evento',grupo:'localizacao',tipo:'localizacao',configuravel:true,regraPorServico:true,boxId:'localEventoBox'},
    {codigo:'latitude',nome:'Latitude',grupo:'localizacao',tipo:'decimal',configuravel:true,regraPorServico:true,boxId:'latitudeBox'},
    {codigo:'longitude',nome:'Longitude',grupo:'localizacao',tipo:'decimal',configuravel:true,regraPorServico:true,boxId:'longitudeBox'},
    {codigo:'site_oficial',nome:'Site oficial',grupo:'links',tipo:'url',configuravel:true,regraPorServico:true,boxId:'siteBox'},
    {codigo:'link_ingressos',nome:'Link de ingressos',grupo:'links',tipo:'url',configuravel:true,regraPorServico:true,boxId:'ingressosBox'},
    {codigo:'link_inscricao',nome:'Link de inscrição',grupo:'links',tipo:'url',configuravel:true,regraPorServico:true,boxId:'inscricaoBox'},
    {codigo:'link_programacao',nome:'Link de programação',grupo:'links',tipo:'url',configuravel:true,regraPorServico:true,boxId:'programacaoBox'},
    {codigo:'link_acessibilidade',nome:'Link sobre acessibilidade / audiodescrição',grupo:'links',tipo:'url',configuravel:true,regraPorServico:true,boxId:'acessibilidadeBox'}
  ];
  const porCodigo=Object.fromEntries(campos.map(c=>[c.codigo,Object.freeze({...c})]));
  const api={
    versao:1,
    campos:Object.freeze(campos.map(c=>porCodigo[c.codigo])),
    obter(codigo){return porCodigo[codigo]||null;},
    configuraveis(){return this.campos.filter(c=>c.configuravel!==false);},
    codigosConfiguraveis(){return this.configuraveis().map(c=>c.codigo);},
    camposParaRegrasPorServico(){return this.campos.filter(c=>c.regraPorServico).map(c=>c.codigo);},
    limitesTexto(){return this.campos.filter(c=>c.limites).map(c=>[c.codigo,c.nome,c.limites.minimo,c.limites.maximo]);},
    nome(codigo){return porCodigo[codigo]?.nome||codigo;},
    boxId(codigo){return porCodigo[codigo]?.boxId||codigo+'Box';},
    paresConfiguraveis(){return this.configuraveis().map(c=>[c.codigo,c.nome]);}
  };
  window.AUDESC_FORMULARIO=Object.freeze(api);
})();
