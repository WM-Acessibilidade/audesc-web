(function () {
  'use strict';

  const API_URL = 'https://audesc-events-api.onrender.com';
  const CAMPOS = window.AUDESC_CONFIG?.catalogo.getParesConfiguraveis() || [];
  const LIMITES_TEXTO = window.AUDESC_CONFIG?.catalogo.getLimitesTexto() || [];

  const Estado = {
    adminToken: '',
    config: null
  };

  const Elementos = {
    loginPanel: document.getElementById('loginPanel'),
    configPanel: document.getElementById('configPanel'),
    adminToken: document.getElementById('adminToken'),
    loginBtn: document.getElementById('loginBtn'),
    loginStatus: document.getElementById('loginStatus'),
    pais: document.getElementById('pais'),
    uf: document.getElementById('uf'),
    ufLabel: document.getElementById('ufLabel'),
    status: document.getElementById('status'),
    servicosBox: document.getElementById('servicosBox'),
    camposBox: document.getElementById('camposBox'),
    limitesBox: document.getElementById('limitesBox'),
    servicoRegras: document.getElementById('servicoRegras'),
    regrasServicoBox: document.getElementById('regrasServicoBox'),
    preview: document.getElementById('preview'),
    carregarRegra: document.getElementById('carregarRegra'),
    usarPadrao: document.getElementById('usarPadrao'),
    salvarBtn: document.getElementById('salvarBtn'),
    salvarServicoBtn: document.getElementById('salvarServicoBtn')
  };

  const Util = {
    esc(valor) {
      return String(valor ?? '').replace(/[&<>\"]/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[caractere]));
    },

    normalizarCodigoLocal(valor) {
      return String(valor || '').trim().toUpperCase();
    },

    setStatus(mensagem, classe = '') {
      Elementos.status.textContent = mensagem;
      Elementos.status.className = 'status ' + classe;
    }
  };

  const Api = {
    async requisitar(caminho, opcoes = {}) {
      const headers = Object.assign({
        'Content-Type': 'application/json',
        'x-admin-token': Estado.adminToken
      }, opcoes.headers || {});

      const resposta = await fetch(API_URL + caminho, Object.assign({}, opcoes, { headers }));
      const corpo = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(corpo.error || 'Erro na API');
      return corpo;
    }
  };

  const Localizacao = {
    preencherPaises() {
      window.AUDESC_CONFIG?.localizacao.preencherPaises(Elementos.pais, 'Brasil', { incluirEspeciais: false });
      this.atualizarUnidades();
    },

    atualizarUnidades() {
      const resultado = window.AUDESC_CONFIG?.localizacao.preencherUnidades(
        Elementos.uf,
        Elementos.pais.value,
        undefined,
        { incluirNacional: true }
      );
      Elementos.ufLabel.textContent = resultado?.rotulo || 'Unidade administrativa';
      Elementos.uf.disabled = !resultado?.disponivel;
    },

    codigoPais() {
      return Util.normalizarCodigoLocal(
        window.AUDESC_CONFIG?.localizacao.getCodigoPais(Elementos.pais.value) || ''
      );
    },

    codigoUnidade() {
      const texto = Elementos.uf.options[Elementos.uf.selectedIndex]?.textContent
        ?.replace(/\s*\([^)]*\)\s*$/, '') || '';
      return Util.normalizarCodigoLocal(
        window.AUDESC_CONFIG?.localizacao.getCodigoUnidade(
          Elementos.pais.value,
          Elementos.uf.value,
          texto
        ) || Elementos.uf.value || ''
      );
    },

    nomeRegra() {
      return `${Elementos.pais.value} - ${Elementos.uf.options[Elementos.uf.selectedIndex]?.textContent || ''}`;
    }
  };

  const Modelo = {
    padrao() {
      return Estado.config?.padrao || {
        servicosDisponiveis: ['audesc_transmissao', 'divulgacao_gratuita'],
        campos: {}
      };
    },

    regraAtual() {
      const pais = Localizacao.codigoPais();
      const unidade = Localizacao.codigoUnidade();
      return (Estado.config?.regras || []).find(regra =>
        Util.normalizarCodigoLocal(regra.pais_codigo) === pais &&
        Util.normalizarCodigoLocal(regra.unidade_codigo) === unidade
      );
    },

    camposEfetivos() {
      return Object.assign({}, this.padrao().campos || {}, this.regraAtual()?.campos || {});
    },

    limitesEfetivos() {
      return Object.assign({}, this.padrao().limites || {}, this.regraAtual()?.limites || {});
    },

    servicosEfetivos() {
      return this.regraAtual()?.servicosDisponiveis || this.padrao().servicosDisponiveis || [];
    },

    regrasServicoEfetivas() {
      return Object.assign(
        {},
        this.padrao().regrasPorServico || {},
        this.regraAtual()?.regrasPorServico || {}
      );
    },

    substituirRegraLocal(regra) {
      const pais = Localizacao.codigoPais();
      const unidade = Localizacao.codigoUnidade();
      const regras = (Estado.config.regras || []).filter(item => !(
        Util.normalizarCodigoLocal(item.pais_codigo) === pais &&
        Util.normalizarCodigoLocal(item.unidade_codigo) === unidade
      ));
      regras.push(regra);
      Estado.config.regras = regras;
    },

    removerRegraLocal() {
      const pais = Localizacao.codigoPais();
      const unidade = Localizacao.codigoUnidade();
      Estado.config.regras = (Estado.config.regras || []).filter(item => !(
        Util.normalizarCodigoLocal(item.pais_codigo) === pais &&
        Util.normalizarCodigoLocal(item.unidade_codigo) === unidade
      ));
    }
  };

  const LeituraTela = {
    servicos() {
      return [...document.querySelectorAll('input[name="servico"]:checked')].map(input => input.value);
    },

    campos() {
      const campos = {};
      for (const [id] of CAMPOS) {
        const visivel = [...document.querySelectorAll('input[name="campo_visivel"]')]
          .find(input => input.value === id)?.checked !== false;
        const obrigatorio = [...document.querySelectorAll('input[name="campo_obrigatorio"]')]
          .find(input => input.value === id)?.checked === true;
        campos[id] = { visivel, obrigatorio };
      }
      return campos;
    },

    limites() {
      const limites = {};
      for (const [id, , minimoPadrao, maximoPadrao] of LIMITES_TEXTO) {
        const limitarMinimo = [...document.querySelectorAll('input[name="limitar_minimo"]')]
          .find(input => input.value === id)?.checked !== false;
        const limitarMaximo = [...document.querySelectorAll('input[name="limitar_maximo"]')]
          .find(input => input.value === id)?.checked !== false;
        const minimo = Number(document.getElementById(id + '_minimo')?.value || minimoPadrao);
        const maximo = Number(document.getElementById(id + '_maximo')?.value || maximoPadrao);
        limites[id] = { limitarMinimo, minimo, limitarMaximo, maximo };
      }
      return limites;
    },

    regraLocal() {
      const existente = Modelo.regraAtual() || {};
      return {
        pais_codigo: Localizacao.codigoPais(),
        unidade_codigo: Localizacao.codigoUnidade(),
        nome: Localizacao.nomeRegra(),
        servicosDisponiveis: this.servicos(),
        campos: this.campos(),
        limites: this.limites(),
        regrasPorServico: existente.regrasPorServico || {}
      };
    },

    regraServico() {
      const campos = {};
      document.querySelectorAll('[data-regra-campo]').forEach(div => {
        const id = div.getAttribute('data-regra-campo');
        const comportamento = div.querySelector('[data-comportamento-campo]')?.value || 'usuario';
        const valor = div.querySelector('[data-valor-campo]')?.value || '';
        campos[id] = { comportamento, valor };
      });
      return { campos };
    }
  };

  const Render = {
    inputValorFixo(campo, valor) {
      const esc = Util.esc;
      if (campo === 'tipo_evento') {
        return `<select data-valor-campo="${esc(campo)}"><option value="publico" ${valor === 'publico' ? 'selected' : ''}>Pública, com divulgação no Audesc</option><option value="privado" ${valor === 'privado' ? 'selected' : ''}>Restrita, sem divulgação pública</option></select>`;
      }
      if (campo === 'divulgar_acesso_ouvintes') {
        return `<select data-valor-campo="${esc(campo)}"><option value="false" ${String(valor) !== 'true' ? 'selected' : ''}>Não</option><option value="true" ${String(valor) === 'true' ? 'selected' : ''}>Sim</option></select>`;
      }
      if (campo === 'duracao_horas') {
        return `<select data-valor-campo="${esc(campo)}">${[1, 2, 3, 4, 5, 6, 7, 8].map(numero => `<option value="${numero}" ${String(valor) === String(numero) ? 'selected' : ''}>${numero} hora(s)</option>`).join('')}</select>`;
      }
      if (campo === 'max_ouvintes') {
        return `<select data-valor-campo="${esc(campo)}">${[10, 20, 30, 40, 60, 80, 100, 120, 150, 200, 300, 400, 500].map(numero => `<option value="${numero}" ${String(valor) === String(numero) ? 'selected' : ''}>${numero} ouvintes</option>`).join('')}</select>`;
      }
      return `<input data-valor-campo="${esc(campo)}" value="${esc(valor)}">`;
    },

    servicos() {
      const ativos = new Set(Modelo.servicosEfetivos());
      Elementos.servicosBox.innerHTML = (window.AUDESC_CONFIG?.servicos.getLista() || [])
        .filter(servico => servico.ativo !== false)
        .map(servico => `<label class="check"><input type="checkbox" name="servico" value="${Util.esc(servico.codigo)}" ${ativos.has(servico.codigo) ? 'checked' : ''}>${Util.esc(servico.nome)}. <span class="small">${Util.esc(servico.categoriaNome || servico.categoria || '')}</span></label>`)
        .join('');
    },

    campos() {
      const efetivos = Modelo.camposEfetivos();
      Elementos.camposBox.innerHTML = CAMPOS.map(([id, nome]) => {
        const configuracao = efetivos[id] || { visivel: true, obrigatorio: false };
        return `<div class="panel"><strong>${Util.esc(nome)}</strong><label class="check"><input type="checkbox" name="campo_visivel" value="${Util.esc(id)}" ${configuracao.visivel !== false ? 'checked' : ''}>Exibir campo</label><label class="check"><input type="checkbox" name="campo_obrigatorio" value="${Util.esc(id)}" ${configuracao.obrigatorio ? 'checked' : ''}>Tornar obrigatório</label></div>`;
      }).join('');
    },

    limites() {
      const efetivos = Modelo.limitesEfetivos();
      Elementos.limitesBox.innerHTML = LIMITES_TEXTO.map(([id, nome, minimoPadrao, maximoPadrao]) => {
        const configuracao = efetivos[id] || {};
        const limitarMinimo = configuracao.limitarMinimo !== false;
        const limitarMaximo = configuracao.limitarMaximo !== false;
        const minimo = Number(configuracao.minimo ?? minimoPadrao);
        const maximo = Number(configuracao.maximo ?? maximoPadrao);
        return `<div class="panel"><strong>${Util.esc(nome)}</strong><label class="check"><input type="checkbox" name="limitar_minimo" value="${Util.esc(id)}" ${limitarMinimo ? 'checked' : ''}>Exigir quantidade mínima de caracteres</label><label for="${Util.esc(id)}_minimo">Quantidade mínima de caracteres</label><input id="${Util.esc(id)}_minimo" name="limite_minimo" data-campo="${Util.esc(id)}" type="number" min="0" max="10000" value="${Util.esc(minimo)}"><label class="check"><input type="checkbox" name="limitar_maximo" value="${Util.esc(id)}" ${limitarMaximo ? 'checked' : ''}>Limitar quantidade máxima de caracteres</label><label for="${Util.esc(id)}_maximo">Quantidade máxima de caracteres</label><input id="${Util.esc(id)}_maximo" name="limite_maximo" data-campo="${Util.esc(id)}" type="number" min="1" max="50000" value="${Util.esc(maximo)}"></div>`;
      }).join('');
    },

    regrasServico() {
      const disponiveis = Modelo.servicosEfetivos();
      const lista = (window.AUDESC_CONFIG?.servicos.getLista() || [])
        .filter(servico => servico.ativo !== false && disponiveis.includes(servico.codigo));
      const anterior = Elementos.servicoRegras.value;

      Elementos.servicoRegras.innerHTML = lista.map(servico =>
        `<option value="${Util.esc(servico.codigo)}" ${servico.codigo === anterior ? 'selected' : ''}>${Util.esc(servico.nome)}</option>`
      ).join('');

      if (anterior && lista.some(servico => servico.codigo === anterior)) {
        Elementos.servicoRegras.value = anterior;
      }

      const codigo = Elementos.servicoRegras.value || lista[0]?.codigo || '';
      if (codigo) Elementos.servicoRegras.value = codigo;
      const regra = Modelo.regrasServicoEfetivas()[codigo] || { campos: {} };
      const camposAlvo = window.AUDESC_CONFIG?.catalogo.getCamposParaRegrasPorServico() || [];

      Elementos.regrasServicoBox.innerHTML = camposAlvo.map(id => {
        const nome = (CAMPOS.find(([codigoCampo]) => codigoCampo === id) || [, id])[1];
        const regraCampo = regra.campos?.[id] || { comportamento: 'usuario', valor: '' };
        const comportamento = regraCampo.comportamento || 'usuario';
        return `<div class="panel" data-regra-campo="${Util.esc(id)}"><strong>${Util.esc(nome)}</strong><label for="comp_${Util.esc(id)}">Comportamento do campo</label><select id="comp_${Util.esc(id)}" data-comportamento-campo="${Util.esc(id)}"><option value="usuario" ${comportamento === 'usuario' ? 'selected' : ''}>Usuário escolhe</option><option value="fixo" ${comportamento === 'fixo' ? 'selected' : ''}>Valor fixo do sistema</option><option value="oculto_sem_valor" ${comportamento === 'oculto_sem_valor' ? 'selected' : ''}>Campo oculto sem valor</option></select><label>Valor fixo, quando aplicável</label>${this.inputValorFixo(id, regraCampo.valor ?? '')}</div>`;
      }).join('');
    },

    preview() {
      const servicos = (window.AUDESC_CONFIG?.servicos.getLista() || [])
        .filter(servico => Modelo.servicosEfetivos().includes(servico.codigo))
        .map(servico => servico.nome);
      const camposEfetivos = Modelo.camposEfetivos();
      const campos = CAMPOS
        .filter(([id]) => camposEfetivos[id]?.visivel !== false)
        .map(([, nome]) => nome);
      const limitesEfetivos = Modelo.limitesEfetivos();
      const limites = LIMITES_TEXTO.map(([id, nome]) => {
        const limite = limitesEfetivos[id] || {};
        const partes = [];
        if (limite.limitarMinimo !== false) partes.push(`mínimo ${limite.minimo}`);
        if (limite.limitarMaximo !== false) partes.push(`máximo ${limite.maximo}`);
        return `${nome}: ${partes.join(', ') || 'sem limite configurado'}`;
      });

      Elementos.preview.innerHTML = `<p><strong>Local:</strong> ${Util.esc(Elementos.pais.value)} — ${Util.esc(Elementos.uf.options[Elementos.uf.selectedIndex]?.textContent || '')}</p><p><strong>Serviços exibidos:</strong> ${Util.esc(servicos.join('; ') || 'nenhum')}</p><p><strong>Campos exibidos:</strong> ${Util.esc(campos.join('; ') || 'nenhum')}</p><p><strong>Limites de texto:</strong> ${Util.esc(limites.join('; '))}</p><p><strong>Regras por serviço:</strong> ${Util.esc(Object.keys(Modelo.regrasServicoEfetivas()).length + ' serviço(s) com ajustes específicos.')}</p>`;
    },

    tudo() {
      this.servicos();
      this.campos();
      this.limites();
      this.regrasServico();
      this.preview();
    }
  };

  const Persistencia = {
    async carregar() {
      const resposta = await Api.requisitar('/admin/formulario-config');
      Estado.config = resposta.config;
      Render.tudo();
      Util.setStatus('Configuração carregada.', 'success');
    },

    guardarRegrasServicoNaTela() {
      const codigo = Elementos.servicoRegras.value || '';
      if (!codigo) return;

      const regra = Modelo.regraAtual() || { regrasPorServico: {} };
      const regrasAtuais = regra.regrasPorServico || {};
      regra.regrasPorServico = Object.assign({}, regrasAtuais, {
        [codigo]: LeituraTela.regraServico()
      });

      Modelo.substituirRegraLocal(Object.assign({
        pais_codigo: Localizacao.codigoPais(),
        unidade_codigo: Localizacao.codigoUnidade(),
        nome: Localizacao.nomeRegra(),
        servicosDisponiveis: Modelo.servicosEfetivos(),
        campos: Modelo.camposEfetivos(),
        limites: Modelo.limitesEfetivos()
      }, regra));

      Render.preview();
      Util.setStatus(
        'Ajustes deste serviço guardados na tela. Clique em salvar configuração deste local para gravar.',
        'success'
      );
    },

    async salvar() {
      if (!Localizacao.codigoPais() || !Localizacao.codigoUnidade()) {
        Util.setStatus('Selecione país e unidade administrativa.', 'error');
        return;
      }

      Modelo.substituirRegraLocal(LeituraTela.regraLocal());
      const resposta = await Api.requisitar('/admin/formulario-config', {
        method: 'PATCH',
        body: JSON.stringify({ config: Estado.config })
      });
      Estado.config = resposta.config;
      Render.tudo();
      Util.setStatus('Configuração salva.', 'success');
    },

    usarPadrao() {
      Modelo.removerRegraLocal();
      Render.tudo();
      Util.setStatus(
        'Regra local removida. Ao salvar, este local usará a configuração padrão.',
        ''
      );
    }
  };

  const Eventos = {
    iniciar() {
      Elementos.loginBtn.onclick = async () => {
        Estado.adminToken = Elementos.adminToken.value.trim();
        if (!Estado.adminToken) {
          Elementos.loginStatus.textContent = 'Informe a senha.';
          return;
        }
        Elementos.loginPanel.classList.add('hidden');
        Elementos.configPanel.classList.remove('hidden');
        Localizacao.preencherPaises();
        try {
          await Persistencia.carregar();
        } catch (erro) {
          Util.setStatus('Erro: ' + erro.message, 'error');
        }
      };

      Elementos.pais.addEventListener('change', () => {
        Localizacao.atualizarUnidades();
        Render.tudo();
      });
      Elementos.uf.addEventListener('change', () => Render.tudo());
      Elementos.carregarRegra.onclick = () => Render.tudo();
      Elementos.usarPadrao.onclick = () => Persistencia.usarPadrao();
      Elementos.salvarBtn.onclick = () => Persistencia.salvar()
        .catch(erro => Util.setStatus('Erro: ' + erro.message, 'error'));
      Elementos.servicosBox.addEventListener('change', () => Render.preview());
      Elementos.camposBox.addEventListener('change', () => Render.preview());
      Elementos.limitesBox.addEventListener('input', () => Render.preview());
      Elementos.limitesBox.addEventListener('change', () => Render.preview());
      Elementos.servicoRegras.addEventListener('change', () => Render.regrasServico());
      Elementos.regrasServicoBox.addEventListener('change', () => Render.preview());
      Elementos.salvarServicoBtn.onclick = () => Persistencia.guardarRegrasServicoNaTela();
    }
  };

  Eventos.iniciar();
}());
