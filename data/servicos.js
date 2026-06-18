// Configuração central dos serviços do Audesc.
// Para adicionar um novo serviço no futuro, preferencialmente inclua aqui e alinhe o backend em data/servicos.json.
(function(){
  const lista = [
  {
    "codigo": "audesc_transmissao",
    "nome": "Transmissão Audesc (transmissor e receptores)",
    "descricao": "Serviço para transmissão de audiodescrição ao vivo pelo Audesc, com acesso para transmissor e receptores.",
    "categoria": "transmissao",
    "categoriaNome": "Transmissão",
    "ordem": 10,
    "ativo": true,
    "apareceCadastro": true,
    "requerAgenda": false,
    "usaTransmissao": true,
    "somenteDivulgacao": false,
    "somenteProfissional": false,
    "permiteValorManual": false,
    "restritoAoDF": false
  },
  {
    "codigo": "divulgacao_gratuita",
    "nome": "Somente divulgação no Audesc",
    "descricao": "Serviço para divulgação de evento acessível no catálogo do Audesc, sem contratação de transmissão ou profissional.",
    "categoria": "divulgacao",
    "categoriaNome": "Divulgação",
    "ordem": 20,
    "ativo": true,
    "apareceCadastro": true,
    "requerAgenda": false,
    "usaTransmissao": false,
    "somenteDivulgacao": true,
    "somenteProfissional": false,
    "permiteValorManual": false,
    "restritoAoDF": false
  },
  {
    "codigo": "audesc_com_audiodescritor",
    "nome": "Serviço completo - Audesc + audiodescritor",
    "descricao": "Serviço completo com transmissão pelo Audesc e contratação de audiodescritor, dependente de confirmação de agenda profissional.",
    "categoria": "profissional",
    "categoriaNome": "Serviços profissionais",
    "ordem": 30,
    "ativo": true,
    "apareceCadastro": true,
    "requerAgenda": true,
    "usaTransmissao": true,
    "somenteDivulgacao": false,
    "somenteProfissional": false,
    "permiteValorManual": true,
    "restritoAoDF": true
  },
  {
    "codigo": "somente_audiodescritor",
    "nome": "Audiodescritor",
    "descricao": "Serviço de contratação de audiodescritor, sem transmissão pelo Audesc, dependente de confirmação de agenda profissional.",
    "categoria": "profissional",
    "categoriaNome": "Serviços profissionais",
    "ordem": 40,
    "ativo": true,
    "apareceCadastro": true,
    "requerAgenda": true,
    "usaTransmissao": false,
    "somenteDivulgacao": false,
    "somenteProfissional": true,
    "permiteValorManual": true,
    "restritoAoDF": true
  },
  {
    "codigo": "somente_consultor",
    "nome": "Consultor",
    "descricao": "Serviço de contratação de consultor, sem transmissão pelo Audesc, dependente de confirmação de agenda profissional.",
    "categoria": "profissional",
    "categoriaNome": "Serviços profissionais",
    "ordem": 50,
    "ativo": true,
    "apareceCadastro": true,
    "requerAgenda": true,
    "usaTransmissao": false,
    "somenteDivulgacao": false,
    "somenteProfissional": true,
    "permiteValorManual": true,
    "restritoAoDF": true
  }
];
  lista.sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999));
  const mapa = Object.fromEntries(lista.map(s => [s.codigo, s]));
  const categorias = {
    transmissao: 'Transmissão',
    divulgacao: 'Divulgação',
    profissional: 'Serviços profissionais'
  };
  function esc(v){return String(v ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function ativoCadastro(s){return s && s.ativo !== false && s.apareceCadastro !== false;}
  function get(codigo){return mapa[codigo] || null;}
  function nome(codigo){return get(codigo)?.nome || codigo || '—';}
  function descricao(codigo){return get(codigo)?.descricao || '';}
  function categoria(codigo){return get(codigo)?.categoria || '';}
  function categoriaNome(codigo){const s = get(codigo); return s?.categoriaNome || categorias[s?.categoria] || s?.categoria || '';}
  function requerAgenda(codigo){return !!get(codigo)?.requerAgenda;}
  function usaTransmissao(codigo){return !!get(codigo)?.usaTransmissao;}
  function somenteDivulgacao(codigo){return !!get(codigo)?.somenteDivulgacao;}
  function somenteProfissional(codigo){return !!get(codigo)?.somenteProfissional;}
  function permiteValorManual(codigo){return !!get(codigo)?.permiteValorManual;}
  function restritoAoDF(codigo){return !!get(codigo)?.restritoAoDF;}
  function codigosValidos(){return lista.filter(s => s.ativo !== false).map(s => s.codigo);}
  function porCategoria(){
    return lista.filter(ativoCadastro).reduce((acc, s) => {
      const cat = s.categoria || 'outros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }
  function opcoes(selected='', incluirInativos=false){
    return lista.filter(s => incluirInativos || ativoCadastro(s)).map(s => {
      const attrs = [
        `value="${esc(s.codigo)}"`,
        s.codigo === selected ? 'selected' : '',
        s.restritoAoDF ? 'data-df-only="true"' : '',
        `data-categoria="${esc(s.categoria || '')}"`,
        `data-ordem="${esc(s.ordem ?? '')}"`,
        s.descricao ? `title="${esc(s.descricao)}"` : ''
      ].filter(Boolean).join(' ');
      return `<option ${attrs}>${esc(s.nome)}</option>`;
    }).join('');
  }
  window.AUDESC_SERVICOS = {
    lista, mapa, categorias, get, nome, descricao, categoria, categoriaNome,
    requerAgenda, usaTransmissao, somenteDivulgacao, somenteProfissional, permiteValorManual,
    restritoAoDF, codigosValidos, porCategoria, htmlOptions: opcoes
  };
})();
