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
    { nome:'Timor-Leste', codigo:'TL', rotulo:'Município ou região administrativa especial', padrao:'', unidades:['Aileu','Ainaro','Ataúro','Baucau','Bobonaro','Covalima','Díli','Ermera','Lautém','Liquiçá','Manatuto','Manufahi','Oecusse','Viqueque'], codigos:{'Díli':'DI','Baucau':'BA','Oecusse':'OE'} },
    { nome:"Estados Unidos", codigo:'US', rotulo:"Estado", padrao:'', unidades:[] },
    { nome:"Canadá", codigo:'CA', rotulo:"Província ou território", padrao:'', unidades:[] },
    { nome:"Espanha", codigo:'ES', rotulo:"Comunidade autônoma", padrao:'', unidades:[] },
    { nome:"França", codigo:'FR', rotulo:"Região", padrao:'', unidades:[] },
    { nome:"Alemanha", codigo:'DE', rotulo:"Estado federado", padrao:'', unidades:[] },
    { nome:"Reino Unido", codigo:'GB', rotulo:"País constituinte ou região", padrao:'', unidades:[] },
    { nome:"Itália", codigo:'IT', rotulo:"Região", padrao:'', unidades:[] },
    { nome:"Países Baixos", codigo:'NL', rotulo:"Província", padrao:'', unidades:[] },
    { nome:"Irlanda", codigo:'IE', rotulo:"Condado", padrao:'', unidades:[] },
    { nome:"Suíça", codigo:'CH', rotulo:"Cantão", padrao:'', unidades:[] },
    { nome:"Austrália", codigo:'AU', rotulo:"Estado ou território", padrao:'', unidades:[] },
    { nome:"Nova Zelândia", codigo:'NZ', rotulo:"Região", padrao:'', unidades:[] },
    { nome:"México", codigo:'MX', rotulo:"Estado", padrao:'', unidades:[] },
    { nome:"Argentina", codigo:'AR', rotulo:"Província", padrao:'', unidades:[] },
    { nome:"Chile", codigo:'CL', rotulo:"Região", padrao:'', unidades:[] },
    { nome:"Colômbia", codigo:'CO', rotulo:"Departamento", padrao:'', unidades:[] },
    { nome:"Japão", codigo:'JP', rotulo:"Prefeitura", padrao:'', unidades:[] },
    { nome:"Coreia do Sul", codigo:'KR', rotulo:"Província ou cidade especial", padrao:'', unidades:[] },
    { nome:"Emirados Árabes Unidos", codigo:'AE', rotulo:"Emirado", padrao:'', unidades:[] }
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

  let codigosHabilitados = new Set(['BR','AO','CV','GW','GQ','MZ','PT','ST','TL']);
  function definirPaisesHabilitados(codigos){ codigosHabilitados = new Set((codigos||[]).map(c=>String(c).toUpperCase())); }
  function nomesPaises(incluirEspeciais){
    const nomes = paisesBase.filter(p=>!codigosHabilitados || codigosHabilitados.has(p.codigo)).map(p => p.nome);
    return incluirEspeciais ? nomes.concat(['Outros']) : nomes.slice();
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
  function opcoesUnidades(nomePais, opcoes){
    const dados = unidades[nomePais];
    if (!dados) return [];
    const incluirNacional = opcoes?.incluirNacional === true;
    const lista = dados.opcoes.map(item => Array.isArray(item)
      ? { valor:item[0], texto:`${item[1]} (${item[0]})`, nome:item[1], especial:false }
      : { valor:item, texto:item, nome:item, especial:false });
    if (incluirNacional) lista.push({ valor:'Nacional', texto:'Nacional', nome:'Nacional', especial:true });
    return lista;
  }
  function preencherSelectUnidades(select, nomePais, valorAtual, opcoes){
    if (!select) return { disponivel:false, rotulo:'Unidade administrativa', selecionado:'' };
    const dados = unidades[nomePais];
    const incluirVazio = opcoes?.incluirVazio !== false;
    const textoVazio = opcoes?.textoVazio || 'Selecione';
    const textoIndisponivel = opcoes?.textoIndisponivel || 'Não se aplica';
    const selecionado = valorAtual ?? select.value ?? dados?.padrao ?? '';
    if (!dados) {
      select.innerHTML = `<option value="">${textoIndisponivel}</option>`;
      select.value = '';
      return { disponivel:false, rotulo:'Unidade administrativa', selecionado:'' };
    }
    const lista = opcoesUnidades(nomePais, opcoes);
    select.innerHTML = (incluirVazio ? `<option value="">${textoVazio}</option>` : '') + lista.map(item => `<option value="${item.valor}">${item.texto}</option>`).join('');
    const valorPreferido = lista.some(item => item.valor === selecionado) ? selecionado : (dados.padrao || '');
    if ([...select.options].some(option => option.value === valorPreferido)) select.value = valorPreferido;
    return { disponivel:true, rotulo:dados.rotulo, selecionado:select.value };
  }
  function htmlOpcoesUnidades(nomePais, valorAtual, opcoes){
    const dados = unidades[nomePais];
    if (!dados) return `<option value="">${opcoes?.textoIndisponivel || 'Não se aplica'}</option>`;
    const incluirVazio = opcoes?.incluirVazio !== false;
    const textoVazio = opcoes?.textoVazio || 'Selecione';
    const lista = opcoesUnidades(nomePais, opcoes);
    return (incluirVazio ? `<option value="">${textoVazio}</option>` : '') + lista.map(item => `<option value="${item.valor}" ${item.valor === valorAtual ? 'selected' : ''}>${item.texto}</option>`).join('');
  }

  window.AUDESC_LOCAIS = { paises:paisesBase, definirPaisesHabilitados, unidadesAdministrativas:unidades, nomesPaises, codigoPaisISO, codigoUnidade, preencherSelectPaises, opcoesUnidades, preencherSelectUnidades, htmlOpcoesUnidades };
  window.AUDESC_UNIDADES_ADMINISTRATIVAS = unidades;
})();
