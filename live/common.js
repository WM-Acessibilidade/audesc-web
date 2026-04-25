(function() {
  const cfg = window.AUDESC_CONFIG || {};
  const livekitUrl = cfg.livekitUrl;
  const tokenEndpoint = cfg.tokenEndpoint;
  const bundleUrl = cfg.bundleUrl;
  const STORAGE_PREFIX = 'audesc-live';

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function setStatus(id, text, tone) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = 'status' + (tone ? ' ' + tone : '');
  }
  function readValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function writeValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
  }
  function normalizarSala(nome) {
    return (nome || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
  }
  function gerarCodigoCurto() {
    return Math.random().toString(36).substring(2, 7);
  }
  function gerarSalaAutomatica() {
    return 'audesc-' + gerarCodigoCurto();
  }
  function obterSalaDaUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get('sala') || '';
  }
  function obterSenhaDaUrl() {
    const url = new URL(window.location.href);
    return url.searchParams.get('senha') || url.searchParams.get('password') || '';
  }
  function montarLinkReceptor(sala) {
    return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'receber.html?sala=' + encodeURIComponent(sala);
  }
  async function copiarTexto(texto) {
    try { await navigator.clipboard.writeText(texto); return true; } catch (e) { return false; }
  }
  async function pedirToken(room, identity, role, password = '') {
    let url = tokenEndpoint + '?room=' + encodeURIComponent(room) + '&identity=' + encodeURIComponent(identity) + '&role=' + encodeURIComponent(role);
    if (password) url += '&password=' + encodeURIComponent(password);
    const response = await fetch(url);
    if (!response.ok) {
      let message = 'Falha ao obter token';
      try { const data = await response.json(); if (data && data.error) message = data.error; } catch(e) {}
      throw new Error(message);
    }
    return response.json();
  }
  function getLiveKitGlobal() {
    return window.LivekitClient || window.livekit || null;
  }
  function carregarLiveKit() {
    return new Promise((resolve, reject) => {
      const existing = getLiveKitGlobal();
      if (existing) return resolve(existing);
      const script = document.createElement('script');
      script.src = bundleUrl;
      script.onload = () => {
        const loaded = getLiveKitGlobal();
        if (loaded) {
          setStatus('diagnosticBox', 'Biblioteca do LiveKit carregada com sucesso.', 'success');
          resolve(loaded);
        } else {
          reject(new Error('Biblioteca carregada, mas sem objeto global compatível.'));
        }
      };
      script.onerror = () => reject(new Error('Falha ao carregar script local do LiveKit.'));
      document.head.appendChild(script);
    });
  }
  function criarRoom(LK) {
    if (typeof LK.Room === 'function') return new LK.Room();
    throw new Error('Classe Room não encontrada na biblioteca do LiveKit.');
  }
  function saveState(key, data) {
    try { localStorage.setItem(STORAGE_PREFIX + ':' + key, JSON.stringify(data)); } catch (e) {}
  }
  function loadState(key) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + ':' + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearState(key) {
    try { localStorage.removeItem(STORAGE_PREFIX + ':' + key); } catch (e) {}
  }
  function switchStep(stepId) {
    document.querySelectorAll('.screen-step').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
  }
  function encodePayload(obj) {
    return new TextEncoder().encode(JSON.stringify(obj));
  }
  function decodePayload(data) {
    try { return JSON.parse(new TextDecoder().decode(data)); } catch (e) { return null; }
  }
  function attachBeforeUnload(shouldWarnFn) {
    window.addEventListener('beforeunload', function(event) {
      if (!shouldWarnFn()) return;
      event.preventDefault();
      event.returnValue = '';
    });
  }
  window.AudescLiveCommon = {
    livekitUrl, tokenEndpoint, setText, setStatus, readValue, writeValue,
    normalizarSala, gerarSalaAutomatica, obterSalaDaUrl, obterSenhaDaUrl, montarLinkReceptor,
    copiarTexto, pedirToken, carregarLiveKit, criarRoom, saveState, loadState,
    clearState, switchStep, encodePayload, decodePayload, attachBeforeUnload
  };
})();
