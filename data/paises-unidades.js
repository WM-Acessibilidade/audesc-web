// Configuração central de países e unidades administrativas do Audesc.
// Para incluir novos países no futuro, preferencialmente altere este arquivo.
(function(){
  const paisesBase = [
    { nome:'Brasil', codigo:'BR', rotulo:'Unidade federativa', padrao:'DF', unidades:[['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']] },
    { nome:'Angola', codigo:'AO', rotulo:'Província', padrao:'', unidades:['Bengo','Benguela','Bié','Cabinda','Cuando Cubango','Cuanza Norte','Cuanza Sul','Cunene','Huambo','Huíla','Luanda','Lunda Norte','Lunda Sul','Malanje','Moxico','Namibe','Uíge','Zaire'], codigos:{'Luanda':'LUA','Cabinda':'CAB'} },
    { nome:'Cabo Verde', codigo:'CV', rotulo:'Ilha', padrao:'', unidades:['Boa Vista','Brava','Fogo','Maio','Sal','Santiago','Santo Antão','São Nicolau','São Vicente'], codigos:{'Santiago':'ST','São Vicente':'SV','Sal':'SL'} },
    { nome:'Guiné-Bissau', codigo:'GW', rotulo:'Região', padrao:'', unidades:['Bafatá','Biombo','Bolama/Bijagós','Cacheu','Gabú','Oio','Quinara','Tombali','Setor Autônomo de Bissau'], codigos:{'Setor Autônomo de Bissau':'BS'} },
    { nome:'Guiné Equatorial', codigo:'GQ', rotulo:'Província', padrao:'', unidades:['Annobón','Bioko Norte','Bioko Sul','Centro Sul','Djibloho','Kie-Ntem','Litoral','Wele-Nzas'], codigos:{'Bioko Norte':'BN','Bioko Sul':'BS','Litoral':'LI'} },
    { nome:'Moçambique', codigo:'MZ', rotulo:'Província', padrao:'', unidades:['Cabo Delgado','Gaza','Inhambane','Manica','Maputo','Maputo Cidade','Nampula','Niassa','Sofala','Tete','Zambézia'], codigos:{'Maputo Cidade':'MPM','Maputo':'MAP'} },
    { nome:'Portugal', codigo:'PT', rotulo:'Distrito ou região autônoma', padrao:'', unidades:['Aveiro','Beja','Braga','Bragança','Castelo Branco','Coimbra','Évora','Faro','Guarda','Leiria','Lisboa','Portalegre','Porto','Santarém','Setúbal','Viana do Castelo','Vila Real','Viseu','Açores','Madeira'], codigos:{'Lisboa':'LIS','Porto':'POR','Açores':'ACO','Madeira':'MAD'} },
    { nome:'São Tomé e Príncipe', codigo:'ST', rotulo:'Distrito ou região autônoma', padrao:'', unidades:['Água Grande','Cantagalo','Caué','Lembá','Lobata','Mé-Zóchi','Região Autônoma do Príncipe'], codigos:{'Água Grande':'AG','Região Autônoma do Príncipe':'PR'} },
    { nome:'Timor-Leste', codigo:'TL', rotulo:'Município ou região administrativa especial', padrao:'', unidades:['Aileu','Ainaro','Ataúro','Baucau','Bobonaro','Covalima','Díli','Ermera','Lautém','Liquiçá','Manatuto','Manufahi','Oecusse','Viqueque'], codigos:{'Díli':'DI','Baucau':'BA','Oecusse':'OE'} }
  ];

  const unidades = {};
  const paisCodigo = {};
  const unidadeCodigo = {};
  for (const pais of paisesBase) {
    unidades[pais.nome] = { rotulo:pais.rotulo, padrao:pais.padrao || '', opcoes:pais.unidades };
    paisCodigo[pais.nome] = pais.codigo;
    unidadeCodigo[pais.nome] = {};
    for (const item of pais.unidades) {
      if (Array.isArray(item)) unidadeCodigo[pais.nome][item[0]] = item[0];
      else unidadeCodigo[pais.nome][item] = pais.codigos?.[item] || item;
    }
  }

  function nomesPaises(incluirEspeciais){
    const nomes = paisesBase.map(p => p.nome);
    return incluirEspeciais ? nomes.concat(['Outros','Internacional']) : nomes.slice();
  }
  function codigoPaisISO(nome){ return paisCodigo[nome] || ''; }
  function codigoUnidade(nomePais, valor, texto){
    if (!nomePais) return '';
    if (nomePais === 'Brasil') return valor || '';
    const mapa = unidadeCodigo[nomePais] || {};
    return mapa[valor] || mapa[texto] || valor || '';
  }
  function preencherSelectPaises(select, valorAtual, opcoes){
    if (!select) return;
    const incluirVazio = !!opcoes?.incluirVazio;
    const incluirEspeciais = opcoes?.incluirEspeciais !== false;
    const selecionado = valorAtual ?? select.value ?? 'Brasil';
    const lista = nomesPaises(incluirEspeciais);
    select.innerHTML = (incluirVazio ? '<option value="">Selecione</option>' : '') + lista.map(nome => `<option value="${nome}">${nome}</option>`).join('');
    if (lista.includes(selecionado) || selecionado === '') select.value = selecionado;
    else if (lista.includes('Outros')) select.value = 'Outros';
  }

  window.AUDESC_LOCAIS = { paises:paisesBase, unidadesAdministrativas:unidades, nomesPaises, codigoPaisISO, codigoUnidade, preencherSelectPaises };
  window.AUDESC_UNIDADES_ADMINISTRATIVAS = unidades;
})();
