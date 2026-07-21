(function(){
  'use strict';

  function locais(){ return window.AUDESC_LOCAIS || null; }
  function formulario(){ return window.AUDESC_FORMULARIO || null; }
  function servicos(){ return window.AUDESC_SERVICOS || null; }
  function regrasServicos(){ return window.AUDESC_REGRAS_SERVICOS || null; }

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
      getHtmlOpcoesUnidades(nomePais, valorAtual, opcoes){ return locais()?.htmlOpcoesUnidades?.(nomePais, valorAtual, opcoes) || ''; },
      normalizarIdentificador(valor){
        return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
      },
      regioesEquivalentes(atual, selecionada){
        const normalizar = this.normalizarIdentificador;
        const paisAtualCodigo = normalizar(atual?.paisCodigo);
        const paisNovoCodigo = normalizar(selecionada?.pais_codigo);
        const paisAtualNome = normalizar(atual?.pais);
        const paisNovoNome = normalizar(selecionada?.pais_nome);
        const unidadeAtualCodigo = normalizar(atual?.unidadeCodigo);
        const unidadeNovaCodigo = normalizar(selecionada?.unidade_codigo);
        const unidadeAtualNome = normalizar(atual?.ufTexto || atual?.uf);
        const unidadeNovaNome = normalizar(selecionada?.unidade_nome);

        const paisIgual = (!paisAtualCodigo || !paisNovoCodigo || paisAtualCodigo === paisNovoCodigo) ||
          (!!paisAtualNome && !!paisNovoNome && paisAtualNome === paisNovoNome);
        const unidadeIgual = (!unidadeAtualCodigo || !unidadeNovaCodigo || unidadeAtualCodigo === unidadeNovaCodigo) ||
          (!!unidadeAtualNome && !!unidadeNovaNome && unidadeAtualNome === unidadeNovaNome);

        return { pais: paisIgual, unidade: unidadeIgual, equivalente: paisIgual && unidadeIgual };
      }
    }),

    servicos: Object.freeze({
      getLista(){ return servicos()?.lista || []; },
      getNome(codigo){ return servicos()?.nome?.(codigo) || codigo || '—'; },
      getHtmlOptions(selecionado){ return servicos()?.htmlOptions?.(selecionado) || ''; },
      usaTransmissao(codigo){ return servicos()?.usaTransmissao?.(codigo); },
      somenteDivulgacao(codigo){ return servicos()?.somenteDivulgacao?.(codigo); },
      somenteProfissional(codigo){ return servicos()?.somenteProfissional?.(codigo); },
      requerAgenda(codigo){ return servicos()?.requerAgenda?.(codigo); },
      normalizarSelecao(valor){ return servicos()?.normalizarSelecao?.(valor) || (Array.isArray(valor) ? valor : [valor].filter(Boolean)); },
      getNomesSelecionados(valor){ return servicos()?.nomesSelecionados?.(valor) || []; },
      usaTransmissaoSelecao(valor){ return !!servicos()?.usaTransmissaoSelecao?.(valor); },
      temDivulgacao(valor){ return !!servicos()?.temDivulgacao?.(valor); },
      temProfissional(valor){ return !!servicos()?.temProfissional?.(valor); },
      requerAgendaSelecao(valor){ return !!servicos()?.requerAgendaSelecao?.(valor); },
      getPrincipalLegado(valor){ return regrasServicos()?.principalLegado?.(valor) || servicos()?.principalLegado?.(valor) || 'audesc_transmissao'; },
      getPerfil(codigo){ return regrasServicos()?.perfis?.[codigo] || null; },
      getRegras(valor){ return regrasServicos()?.resolver?.(valor) || null; },
      normalizarPorRegras(valor){ return regrasServicos()?.normalizar?.(valor) || servicos()?.normalizarSelecao?.(valor) || []; },
      saoIncompativeis(a,b){ return !!regrasServicos()?.saoIncompativeis?.(a,b); },
      resolverRegraCampoConfiguravel(regrasPorServico, valor, campo){ return regrasServicos()?.resolverRegraCampoConfiguravel?.(regrasPorServico, valor, campo) || null; },
      getCodigos(){ return regrasServicos()?.CODIGOS || {}; },
      getSelecionadosEvento(evento){
        if(!evento || typeof evento !== 'object') return this.normalizarPorRegras(evento);
        const lista = Array.isArray(evento.servicos_solicitados) && evento.servicos_solicitados.length
          ? evento.servicos_solicitados
          : evento.tipo_servico;
        return this.normalizarPorRegras(lista);
      },
      getNomesEvento(evento){ return this.getSelecionadosEvento(evento).map(codigo => this.getNome(codigo)); },
      getResumoEvento(evento, separador){ return this.getNomesEvento(evento).join(separador || ' + ') || '—'; },
      getRegrasEvento(evento){ return this.getRegras(this.getSelecionadosEvento(evento)); }
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
