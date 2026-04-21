(function() {
  const cfg = window.AUDESC_CONFIG || {};
  const livekitUrl = cfg.livekitUrl;
  const tokenEndpoint = cfg.tokenEndpoint;
  const bundleUrl = cfg.bundleUrl;

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
  function montarLinkReceptor(sala) {
    return window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'receber.html?sala=' + encodeURIComponent(sala);
  }
  async function copiarTexto(texto) {
    try { await navigator.clipboard.writeText(texto); return true; } catch (e) { return false; }
  }
  async function pedirToken(room, identity, role) {
    const url = tokenEndpoint + '?room=' + encodeURIComponent(room) + '&identity=' + encodeURIComponent(identity) + '&role=' + encodeURIComponent(role);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao obter token');
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
  window.AudescLiveCommon = {
    livekitUrl, tokenEndpoint, setText, setStatus, readValue, normalizarSala,
    gerarSalaAutomatica, obterSalaDaUrl, montarLinkReceptor, copiarTexto,
    pedirToken, carregarLiveKit, criarRoom
  };
})();
