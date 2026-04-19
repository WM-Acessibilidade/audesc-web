function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function showMessage(id, text) {
  setText(id, text);
}

function readField(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
