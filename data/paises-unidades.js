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
    { nome:"Estados Unidos", codigo:'US', rotulo:"Estado, distrito ou território", padrao:'US-DC', unidades:[["US-AL","Alabama"],["US-AK","Alaska"],["US-AS","American Samoa"],["US-AZ","Arizona"],["US-AR","Arkansas"],["US-CA","California"],["US-CO","Colorado"],["US-CT","Connecticut"],["US-DE","Delaware"],["US-DC","Distrito de Colúmbia"],["US-FL","Florida"],["US-GA","Georgia"],["US-GU","Guam"],["US-HI","Hawaii"],["US-ID","Idaho"],["US-UM","Ilhas Menores Distantes dos Estados Unidos"],["US-IL","Illinois"],["US-IN","Indiana"],["US-IA","Iowa"],["US-KS","Kansas"],["US-KY","Kentucky"],["US-LA","Louisiana"],["US-ME","Maine"],["US-MD","Maryland"],["US-MA","Massachusetts"],["US-MI","Michigan"],["US-MN","Minnesota"],["US-MS","Mississippi"],["US-MO","Missouri"],["US-MT","Montana"],["US-NE","Nebraska"],["US-NV","Nevada"],["US-NH","New Hampshire"],["US-NJ","New Jersey"],["US-NM","New Mexico"],["US-NY","New York"],["US-NC","North Carolina"],["US-ND","North Dakota"],["US-MP","Northern Mariana Islands"],["US-OH","Ohio"],["US-OK","Oklahoma"],["US-OR","Oregon"],["US-PA","Pennsylvania"],["US-PR","Puerto Rico"],["US-RI","Rhode Island"],["US-SC","South Carolina"],["US-SD","South Dakota"],["US-TN","Tennessee"],["US-TX","Texas"],["US-UT","Utah"],["US-VT","Vermont"],["US-VI","Virgin Islands, U.S."],["US-VA","Virginia"],["US-WA","Washington"],["US-WV","West Virginia"],["US-WI","Wisconsin"],["US-WY","Wyoming"]] },
    { nome:"Canadá", codigo:'CA', rotulo:"Província ou território", padrao:'CA-ON', unidades:[["CA-AB","Alberta"],["CA-BC","British Columbia"],["CA-PE","Ilha do Príncipe Eduardo"],["CA-MB","Manitoba"],["CA-NB","New Brunswick"],["CA-NS","Nova Escócia"],["CA-NU","Nunavut"],["CA-ON","Ontario"],["CA-QC","Quebec"],["CA-SK","Saskatchewan"],["CA-NL","Terra Nova e Labrador"],["CA-NT","Territórios do Noroeste"],["CA-YT","Yukon"]] },
    { nome:"Espanha", codigo:'ES', rotulo:"Comunidade ou cidade autônoma", padrao:'ES-MD', unidades:[["ES-AN","Andalucía"],["ES-AR","Aragón"],["ES-AS","Astúrias"],["ES-CB","Cantabria"],["ES-CL","Castela e Leão"],["ES-CM","Castela-Mancha"],["ES-CT","Catalunya"],["ES-CE","Ceuta"],["ES-MD","Comunidade de Madri"],["ES-VC","Comunidade Valenciana"],["ES-EX","Extremadura"],["ES-GA","Galicia"],["ES-IB","Ilhas Baleares"],["ES-CN","Ilhas Canárias"],["ES-RI","La Rioja"],["ES-ML","Melilla"],["ES-NC","Navarra"],["ES-PV","País Basco"],["ES-MC","Região de Múrcia"]] },
    { nome:"França", codigo:'FR', rotulo:"Região ou coletividade ultramarina", padrao:'FR-IDF', unidades:[["FR-HDF","Altos da França"],["FR-ARA","Auvérnia-Ródano-Alpes"],["FR-BFC","Borgonha-Franco-Condado"],["FR-BRE","Bretanha"],["FR-CVL","Centro-Vale do Loire"],["FR-20R","Córsega"],["FR-GES","Grande Leste"],["FR-971","Guadeloupe"],["FR-973","Guyane (française)"],["FR-IDF","Ilha de França"],["FR-974","La Réunion"],["FR-972","Martinique"],["FR-976","Mayotte"],["FR-69M","Métropole de Lyon"],["FR-NOR","Normandia"],["FR-NAQ","Nova Aquitânia"],["FR-OCC","Occitânia"],["FR-75C","Paris"],["FR-PDL","País do Loire"],["FR-PAC","Provença-Alpes-Costa Azul"]] },
    { nome:"Alemanha", codigo:'DE', rotulo:"Estado federado", padrao:'DE-BE', unidades:[["DE-BW","Baden-Württemberg"],["DE-BY","Bayern"],["DE-BE","Berlin"],["DE-BB","Brandenburg"],["DE-HB","Bremen"],["DE-HH","Hamburg"],["DE-HE","Hessen"],["DE-MV","Mecklenburg-Vorpommern"],["DE-NI","Niedersachsen"],["DE-NW","Nordrhein-Westfalen"],["DE-RP","Rheinland-Pfalz"],["DE-SL","Saarland"],["DE-SN","Sachsen"],["DE-ST","Sachsen-Anhalt"],["DE-SH","Schleswig-Holstein"],["DE-TH","Thüringen"]] },
    { nome:"Reino Unido", codigo:'GB', rotulo:"País constituinte", padrao:'GB-ENG', unidades:[["GB-SCT","Escócia"],["GB-ENG","Inglaterra"],["GB-NIR","Irlanda do Norte"],["GB-WLS","País de Gales"]] },
    { nome:"Itália", codigo:'IT', rotulo:"Região", padrao:'IT-62', unidades:[["IT-65","Abruzzo"],["IT-75","Apúlia"],["IT-77","Basilicata"],["IT-78","Calabria"],["IT-72","Campânia"],["IT-45","Emília-Romanha"],["IT-36","Friuli Venezia Giulia"],["IT-42","Liguria"],["IT-25","Lombardia"],["IT-62","Lácio"],["IT-57","Marche"],["IT-67","Molise"],["IT-21","Piemonte"],["IT-88","Sardenha"],["IT-82","Sicília"],["IT-52","Toscana"],["IT-32","Trentino-Alto Adige"],["IT-55","Umbria"],["IT-23","Val d'Aoste"],["IT-34","Vêneto"]] },
    { nome:"Países Baixos", codigo:'NL', rotulo:"Província", padrao:'NL-NH', unidades:[["NL-NB","Brabante do Norte"],["NL-DR","Drenthe"],["NL-FL","Flevolândia"],["NL-FR","Frísia"],["NL-GE","Gelderlândia"],["NL-GR","Groningen"],["NL-NH","Holanda do Norte"],["NL-ZH","Holanda do Sul"],["NL-LI","Limburg"],["NL-OV","Overissel"],["NL-UT","Utreque"],["NL-ZE","Zelândia"]] },
    { nome:"Irlanda", codigo:'IE', rotulo:"Condado", padrao:'IE-D', unidades:[["IE-CW","Carlow"],["IE-CN","Cavan"],["IE-CE","Clare"],["IE-CO","Cork"],["IE-DL","Donegal"],["IE-D","Dublin"],["IE-G","Galway"],["IE-KY","Kerry"],["IE-KE","Kildare"],["IE-KK","Kilkenny"],["IE-LS","Laois"],["IE-LM","Leitrim"],["IE-LK","Limerick"],["IE-LD","Longford"],["IE-LH","Louth"],["IE-MO","Mayo"],["IE-MH","Meath"],["IE-MN","Monaghan"],["IE-OY","Offaly"],["IE-RN","Roscommon"],["IE-SO","Sligo"],["IE-TA","Tipperary"],["IE-WD","Waterford"],["IE-WH","Westmeath"],["IE-WX","Wexford"],["IE-WW","Wicklow"]] },
    { nome:"Suíça", codigo:'CH', rotulo:"Cantão", padrao:'CH-ZH', unidades:[["CH-AG","Aargau"],["CH-AR","Appenzell Ausserrhoden"],["CH-AI","Appenzell Innerrhoden"],["CH-BL","Basel-Landschaft"],["CH-BS","Basel-Stadt"],["CH-BE","Berne"],["CH-FR","Fribourg"],["CH-GE","Genève"],["CH-GL","Glarus"],["CH-GR","Graubünden"],["CH-JU","Jura"],["CH-LU","Luzern"],["CH-NE","Neuchâtel"],["CH-NW","Nidwalden"],["CH-OW","Obwalden"],["CH-SG","Sankt Gallen"],["CH-SH","Schaffhausen"],["CH-SZ","Schwyz"],["CH-SO","Solothurn"],["CH-TG","Thurgau"],["CH-TI","Ticino"],["CH-UR","Uri"],["CH-VS","Valais"],["CH-VD","Vaud"],["CH-ZG","Zug"],["CH-ZH","Zürich"]] },
    { nome:"Austrália", codigo:'AU', rotulo:"Estado ou território", padrao:'AU-NSW', unidades:[["AU-SA","Austrália Meridional"],["AU-WA","Austrália Ocidental"],["AU-NSW","Nova Gales do Sul"],["AU-QLD","Queensland"],["AU-TAS","Tasmania"],["AU-ACT","Território da Capital Australiana"],["AU-NT","Território do Norte"],["AU-VIC","Victoria"]] },
    { nome:"Nova Zelândia", codigo:'NZ', rotulo:"Região ou autoridade insular especial", padrao:'NZ-AUK', unidades:[["NZ-AUK","Auckland"],["NZ-HKB","Baía de Hawke"],["NZ-BOP","Baía de Plenty"],["NZ-CAN","Canterbury"],["NZ-WTC","Costa Oeste"],["NZ-GIS","Gisborne"],["NZ-WGN","Greater Wellington"],["NZ-CIT","Ilhas Chatham"],["NZ-MWT","Manawatū-Whanganui"],["NZ-MBH","Marlborough"],["NZ-NSN","Nelson"],["NZ-NTL","Northland"],["NZ-OTA","Otago"],["NZ-STL","Southland"],["NZ-TKI","Taranaki"],["NZ-TAS","Tasman"],["NZ-WKO","Waikato"]] },
    { nome:"México", codigo:'MX', rotulo:"Estado ou entidade federativa", padrao:'MX-CMX', unidades:[["MX-AGU","Aguascalientes"],["MX-BCN","Baja California"],["MX-BCS","Baja California Sur"],["MX-CAM","Campeche"],["MX-CHP","Chiapas"],["MX-CHH","Chihuahua"],["MX-CMX","Cidade do México"],["MX-COA","Coahuila de Zaragoza"],["MX-COL","Colima"],["MX-DUR","Durango"],["MX-GUA","Guanajuato"],["MX-GRO","Guerrero"],["MX-HID","Hidalgo"],["MX-JAL","Jalisco"],["MX-MIC","Michoacán de Ocampo"],["MX-MOR","Morelos"],["MX-MEX","México"],["MX-NAY","Nayarit"],["MX-NLE","Nuevo León"],["MX-OAX","Oaxaca"],["MX-PUE","Puebla"],["MX-QUE","Querétaro"],["MX-ROO","Quintana Roo"],["MX-SLP","San Luis Potosí"],["MX-SIN","Sinaloa"],["MX-SON","Sonora"],["MX-TAB","Tabasco"],["MX-TAM","Tamaulipas"],["MX-TLA","Tlaxcala"],["MX-VER","Veracruz de Ignacio de la Llave"],["MX-YUC","Yucatán"],["MX-ZAC","Zacatecas"]] },
    { nome:"Argentina", codigo:'AR', rotulo:"Província ou cidade autônoma", padrao:'AR-C', unidades:[["AR-B","Buenos Aires"],["AR-K","Catamarca"],["AR-H","Chaco"],["AR-U","Chubut"],["AR-C","Cidade Autônoma de Buenos Aires"],["AR-W","Corrientes"],["AR-X","Córdoba"],["AR-E","Entre Ríos"],["AR-P","Formosa"],["AR-Y","Jujuy"],["AR-L","La Pampa"],["AR-F","La Rioja"],["AR-M","Mendoza"],["AR-N","Misiones"],["AR-Q","Neuquén"],["AR-R","Río Negro"],["AR-A","Salta"],["AR-J","San Juan"],["AR-D","San Luis"],["AR-Z","Santa Cruz"],["AR-S","Santa Fé"],["AR-G","Santiago del Estero"],["AR-V","Tierra del Fuego"],["AR-T","Tucumán"]] },
    { nome:"Chile", codigo:'CL', rotulo:"Região", padrao:'CL-RM', unidades:[["CL-AI","Aisén del General Carlos Ibañez del Campo"],["CL-AN","Antofagasta"],["CL-AP","Arica y Parinacota"],["CL-AT","Atacama"],["CL-BI","Biobío"],["CL-CO","Coquimbo"],["CL-AR","La Araucanía"],["CL-LI","Libertador General Bernardo O'Higgins"],["CL-LL","Los Lagos"],["CL-LR","Los Ríos"],["CL-MA","Magallanes"],["CL-ML","Maule"],["CL-RM","Região Metropolitana de Santiago"],["CL-TA","Tarapacá"],["CL-VS","Valparaíso"],["CL-NB","Ñuble"]] },
    { nome:"Colômbia", codigo:'CO', rotulo:"Departamento ou distrito capital", padrao:'CO-DC', unidades:[["CO-AMA","Amazonas"],["CO-ANT","Antioquia"],["CO-ARA","Arauca"],["CO-ATL","Atlántico"],["CO-BOL","Bolívar"],["CO-BOY","Boyacá"],["CO-CAL","Caldas"],["CO-CAQ","Caquetá"],["CO-CAS","Casanare"],["CO-CAU","Cauca"],["CO-CES","Cesar"],["CO-CHO","Chocó"],["CO-CUN","Cundinamarca"],["CO-COR","Córdoba"],["CO-DC","Distrito Capital de Bogotá"],["CO-GUA","Guainía"],["CO-GUV","Guaviare"],["CO-HUI","Huila"],["CO-LAG","La Guajira"],["CO-MAG","Magdalena"],["CO-MET","Meta"],["CO-NAR","Nariño"],["CO-NSA","Norte de Santander"],["CO-PUT","Putumayo"],["CO-QUI","Quindío"],["CO-RIS","Risaralda"],["CO-SAP","San Andrés, Providencia y Santa Catalina"],["CO-SAN","Santander"],["CO-SUC","Sucre"],["CO-TOL","Tolima"],["CO-VAC","Valle del Cauca"],["CO-VAU","Vaupés"],["CO-VID","Vichada"]] },
    { nome:"Japão", codigo:'JP', rotulo:"Prefeitura", padrao:'JP-13', unidades:[["JP-23","Aichi"],["JP-05","Akita"],["JP-02","Aomori"],["JP-12","Chiba"],["JP-38","Ehime"],["JP-18","Fukui"],["JP-40","Fukuoka"],["JP-07","Fukushima"],["JP-21","Gifu"],["JP-10","Gunma"],["JP-34","Hiroshima"],["JP-01","Hokkaido"],["JP-28","Hyogo"],["JP-08","Ibaraki"],["JP-17","Ishikawa"],["JP-03","Iwate"],["JP-37","Kagawa"],["JP-46","Kagoshima"],["JP-14","Kanagawa"],["JP-39","Kochi"],["JP-43","Kumamoto"],["JP-24","Mie"],["JP-04","Miyagi"],["JP-45","Miyazaki"],["JP-20","Nagano"],["JP-42","Nagasaki"],["JP-29","Nara"],["JP-15","Niigata"],["JP-44","Oita"],["JP-33","Okayama"],["JP-47","Okinawa"],["JP-27","Osaka"],["JP-26","Quioto"],["JP-41","Saga"],["JP-11","Saitama"],["JP-25","Shiga"],["JP-32","Shimane"],["JP-22","Shizuoka"],["JP-09","Tochigi"],["JP-36","Tokushima"],["JP-31","Tottori"],["JP-16","Toyama"],["JP-13","Tóquio"],["JP-30","Wakayama"],["JP-06","Yamagata"],["JP-35","Yamaguchi"],["JP-19","Yamanashi"]] },
    { nome:"Coreia do Sul", codigo:'KR', rotulo:"Província ou cidade especial/metropolitana", padrao:'KR-11', unidades:[["KR-26","Busan"],["KR-43","Chungcheongbuk-do"],["KR-44","Chungcheongnam-do"],["KR-27","Daegu"],["KR-30","Daejeon"],["KR-42","Gangwon-teukbyeoljachido"],["KR-29","Gwangju"],["KR-41","Gyeonggi-do"],["KR-47","Gyeongsangbuk-do"],["KR-48","Gyeongsangnam-do"],["KR-28","Incheon"],["KR-49","Jeju-teukbyeoljachido"],["KR-45","Jeollabuk-do"],["KR-46","Jeollanam-do"],["KR-50","Sejong"],["KR-11","Seul"],["KR-31","Ulsan"]] },
    { nome:"Emirados Árabes Unidos", codigo:'AE', rotulo:"Emirado", padrao:'AE-DU', unidades:[["AE-AZ","Abu Dhabi"],["AE-AJ","Ajman"],["AE-DU","Dubai"],["AE-FU","Fujairah"],["AE-RK","Ras al-Khaimah"],["AE-SH","Sharjah"],["AE-UQ","Umm al-Quwain"]] }
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
