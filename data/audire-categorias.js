(function(){
  const categorias=[
    {id:'exposicoes-artisticas',nome:'Exposições artísticas'},
    {id:'exposicoes-tematicas',nome:'Exposições temáticas'},
    {id:'filmes-series',nome:'Filmes e séries'},
    {id:'livros-periodicos',nome:'Livros e periódicos'},
    {id:'memoriais-museus',nome:'Memoriais e museus'},
    {id:'monumentos-arquitetura',nome:'Monumentos e arquitetura'},
    {id:'natureza-paisagens',nome:'Natureza e paisagens'},
    {id:'turismo',nome:'Turismo'},
    {id:'simbolos-patrimonio-cultural',nome:'Símbolos e patrimônio cultural'},
    {id:'cardapios-restaurantes',nome:'Cardápios e restaurantes'},
    {id:'outros',nome:'Outros'}
  ];
  window.AUDIRE_CATEGORIAS={lista:categorias,nome(id){return categorias.find(c=>c.id===id)?.nome||id||'Não informada';}};
})();
