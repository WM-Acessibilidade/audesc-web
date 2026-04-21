const LIVEKIT_URL = "wss://audesc-live-dh77x30o.livekit.cloud";
const TOKEN_ENDPOINT = "https://audesc-livekit-server.onrender.com/token";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setStatus(id, text, tone = '') {
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
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (e) {
    return false;
  }
}
async function pedirToken(room, identity, role) {
  const url = `${TOKEN_ENDPOINT}?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}&role=${encodeURIComponent(role)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Falha ao obter token');
  return response.json();
}
