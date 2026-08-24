(function(){
  const categorias=[
    {id:'arte-cultura',nome:'Arte e cultura'},
    {id:'educacao',nome:'Educação'},
    {id:'historia-memoria',nome:'História e memória'},
    {id:'museus-exposicoes',nome:'Museus e exposições'},
    {id:'patrimonio',nome:'Patrimônio cultural'},
    {id:'institucional',nome:'Institucional'},
    {id:'turismo',nome:'Turismo e lugares'},
    {id:'ciencia-tecnologia',nome:'Ciência e tecnologia'},
    {id:'outros',nome:'Outros'}
  ];
  window.AUDIRE_CATEGORIAS={lista:categorias,nome(id){return categorias.find(c=>c.id===id)?.nome||id||'Não informada';}};
})();
