(function(){
  'use strict';

  function locais(){ return window.AUDESC_LOCAIS || null; }
  function formulario(){ return window.AUDESC_FORMULARIO || null; }
  function servicos(){ return window.AUDESC_SERVICOS || null; }

  const api = {
    versao: 1,

    catalogo: Object.freeze({
      getCampos(){ return formulario()?.campos || []; },
      getCampo(codigo){ return formulario()?.obter?.(codigo) || null; },
      getCamposConfiguraveis(){ return formulario()?.configuraveis?.() || []; },
      getCodigosConfiguraveis(){ return formulario()?.codigosConfiguraveis?.() || []; },
      getCamposParaRegrasPorServico(){ return formulario()?.camposParaRegrasPorServico?.() || []; },
      getLimitesTexto(){ return formulario()?.limitesTexto?.() || []; },
      getParesConfiguraveis(){ return formulario()?.paresConfiguraveis?.() || []; },
      getNomeCampo(codigo){ return formulario()?.nome?.(codigo) || codigo; },
      getBoxId(codigo){ return formulario()?.boxId?.(codigo) || codigo + 'Box'; },
      getServicos(){ return servicos()?.lista || []; },
      getServico(codigo){ return (servicos()?.lista || []).find(item => item.codigo === codigo) || null; }
    }),

    localizacao: Object.freeze({
      getPaises(){ return locais()?.paises || []; },
      getUnidadesAdministrativas(){ return locais()?.unidadesAdministrativas || {}; },
      getNomesPaises(incluirEspeciais){ return locais()?.nomesPaises?.(incluirEspeciais) || []; },
      getCodigoPais(nome){ return locais()?.codigoPaisISO?.(nome) || ''; },
      getCodigoUnidade(nomePais, valor, texto){ return locais()?.codigoUnidade?.(nomePais, valor, texto) || valor || ''; },
      preencherPaises(select, valorAtual, opcoes){ return locais()?.preencherSelectPaises?.(select, valorAtual, opcoes); },
      getOpcoesUnidades(nomePais, opcoes){ return locais()?.opcoesUnidades?.(nomePais, opcoes) || []; },
      preencherUnidades(select, nomePais, valorAtual, opcoes){ return locais()?.preencherSelectUnidades?.(select, nomePais, valorAtual, opcoes); },
      getHtmlOpcoesUnidades(nomePais, valorAtual, opcoes){ return locais()?.htmlOpcoesUnidades?.(nomePais, valorAtual, opcoes) || ''; }
    }),

    servicos: Object.freeze({
      getLista(){ return servicos()?.lista || []; },
      getNome(codigo){ return servicos()?.nome?.(codigo) || codigo || '—'; },
      getHtmlOptions(selecionado){ return servicos()?.htmlOptions?.(selecionado) || ''; },
      usaTransmissao(codigo){ return servicos()?.usaTransmissao?.(codigo); },
      somenteDivulgacao(codigo){ return servicos()?.somenteDivulgacao?.(codigo); },
      somenteProfissional(codigo){ return servicos()?.somenteProfissional?.(codigo); },
      requerAgenda(codigo){ return servicos()?.requerAgenda?.(codigo); }
    }),

    configuracao: Object.freeze({
      normalizarCodigo(valor){ return String(valor || '').trim().toUpperCase(); },
      encontrarRegra(config, paisCodigo, unidadeCodigo){
        const pais = this.normalizarCodigo(paisCodigo);
        const unidade = this.normalizarCodigo(unidadeCodigo);
        return (config?.regras || []).find(regra =>
          this.normalizarCodigo(regra.pais_codigo) === pais &&
          this.normalizarCodigo(regra.unidade_codigo) === unidade
        ) || null;
      },
      resolver(config, paisCodigo, unidadeCodigo){
        const padrao = config?.padrao || {};
        const regra = this.encontrarRegra(config, paisCodigo, unidadeCodigo) || {};
        return {
          servicosDisponiveis: regra.servicosDisponiveis || padrao.servicosDisponiveis || null,
          campos: Object.assign({}, padrao.campos || {}, regra.campos || {}),
          limites: Object.assign({}, padrao.limites || {}, regra.limites || {}),
          regrasPorServico: Object.assign({}, padrao.regrasPorServico || {}, regra.regrasPorServico || {}),
          regraLocal: regra
        };
      }
    })
  };

  window.AUDESC_CONFIG = Object.freeze(api);
})();
