(function(){
  'use strict';

  const CODIGOS = Object.freeze({
    TRANSMISSAO: 'audesc_transmissao',
    DIVULGACAO: 'divulgacao_gratuita',
    AUDIODESCRITOR: 'somente_audiodescritor',
    CONSULTOR: 'somente_consultor',
    COMPLETO_LEGADO: 'audesc_com_audiodescritor'
  });

  const perfis = Object.freeze({
    [CODIGOS.TRANSMISSAO]: Object.freeze({
      usaTransmissao: true, usaDuracao: true, usaOuvintes: true,
      visibilidadeEditavel: true, geraSala: true, geraCodigoSala: true,
      geraSenha: true, requerAgenda: false
    }),
    [CODIGOS.DIVULGACAO]: Object.freeze({
      usaTransmissao: false, usaDuracao: false, usaOuvintes: false,
      visibilidadeEditavel: false, visibilidadeFixa: 'publico',
      geraSala: false, geraCodigoSala: false, geraSenha: false,
      requerAgenda: false
    }),
    [CODIGOS.AUDIODESCRITOR]: Object.freeze({
      usaTransmissao: false, usaDuracao: true, usaOuvintes: false,
      visibilidadeEditavel: true, geraSala: false, geraCodigoSala: false,
      geraSenha: false, requerAgenda: true
    }),
    [CODIGOS.CONSULTOR]: Object.freeze({
      usaTransmissao: false, usaDuracao: true, usaOuvintes: false,
      visibilidadeEditavel: true, geraSala: false, geraCodigoSala: false,
      geraSenha: false, requerAgenda: true
    })
  });

  function normalizar(valor){
    let lista = Array.isArray(valor) ? valor : (valor ? [valor] : []);
    lista = lista.flatMap(codigo => codigo === CODIGOS.COMPLETO_LEGADO
      ? [CODIGOS.TRANSMISSAO, CODIGOS.AUDIODESCRITOR]
      : [codigo]);
    const validos = new Set(Object.keys(perfis));
    lista = [...new Set(lista.map(String).map(v => v.trim()).filter(v => validos.has(v)))];
    // "Somente divulgação" é exclusivo. Em dados antigos ou payloads inválidos,
    // preservamos os serviços efetivos e removemos a opção de divulgação isolada.
    if(lista.includes(CODIGOS.DIVULGACAO) && lista.length > 1){
      lista = lista.filter(codigo => codigo !== CODIGOS.DIVULGACAO);
    }
    return lista;
  }

  function resolver(valor){
    const selecionados = normalizar(valor);
    const tem = codigo => selecionados.includes(codigo);
    const usaTransmissao = tem(CODIGOS.TRANSMISSAO);
    const somenteDivulgacao = tem(CODIGOS.DIVULGACAO) && selecionados.length === 1;
    const temProfissional = tem(CODIGOS.AUDIODESCRITOR) || tem(CODIGOS.CONSULTOR);
    const usaDuracao = usaTransmissao || temProfissional;
    const usaOuvintes = usaTransmissao;
    const visibilidadeEditavel = !tem(CODIGOS.DIVULGACAO);
    return Object.freeze({
      selecionados,
      usaTransmissao,
      somenteDivulgacao,
      temDivulgacao: tem(CODIGOS.DIVULGACAO),
      temProfissional,
      requerAgenda: temProfissional,
      usaDuracao,
      usaOuvintes,
      visibilidadeEditavel,
      visibilidadeFixa: visibilidadeEditavel ? null : 'publico',
      geraSala: usaTransmissao && usaOuvintes,
      geraCodigoSala: usaTransmissao && usaOuvintes,
      geraSenha: usaTransmissao && usaOuvintes,
      campos: Object.freeze({
        tipo_evento: Object.freeze({ visivel: visibilidadeEditavel, valorFixo: visibilidadeEditavel ? null : 'publico' }),
        duracao_horas: Object.freeze({ visivel: usaDuracao, obrigatorio: usaDuracao }),
        max_ouvintes: Object.freeze({ visivel: usaOuvintes, obrigatorio: usaOuvintes })
      })
    });
  }


  function ordenarPorPrecedencia(valor){
    const selecionados = normalizar(valor);
    const ordem = [CODIGOS.TRANSMISSAO, CODIGOS.AUDIODESCRITOR, CODIGOS.CONSULTOR, CODIGOS.DIVULGACAO];
    return ordem.filter(codigo => selecionados.includes(codigo));
  }

  function resolverRegraCampoConfiguravel(regrasPorServico, valor, campo){
    const regras = regrasPorServico || {};
    for(const codigo of ordenarPorPrecedencia(valor)){
      const regra = regras?.[codigo]?.campos?.[campo];
      if(regra) return regra;
    }
    return null;
  }

  function saoIncompativeis(a, b){
    if(a === b) return false;
    return a === CODIGOS.DIVULGACAO || b === CODIGOS.DIVULGACAO;
  }

  function principalLegado(valor){
    const itens = normalizar(valor);
    if(itens.length === 2 && itens.includes(CODIGOS.TRANSMISSAO) && itens.includes(CODIGOS.AUDIODESCRITOR)){
      return CODIGOS.COMPLETO_LEGADO;
    }
    return itens.find(c => c === CODIGOS.TRANSMISSAO) ||
      itens.find(c => c === CODIGOS.DIVULGACAO) || itens[0] || CODIGOS.TRANSMISSAO;
  }

  window.AUDESC_REGRAS_SERVICOS = Object.freeze({
    versao: 3, CODIGOS, perfis, normalizar, resolver, ordenarPorPrecedencia, resolverRegraCampoConfiguravel, saoIncompativeis, principalLegado
  });
})();
