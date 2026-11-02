(function (global) {
  'use strict';
  function normalizar(valor) {
    const texto = String(valor || '').trim();
    if (!texto) return '';
    const url = new URL(texto);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Informe um destino completo iniciado por https:// ou http://.');
    return url.href;
  }
  function confirmar(atual, codigo, destino, padrao) {
    let novo;
    try { novo = normalizar(destino || padrao); } catch (erro) { global.alert(erro.message); return false; }
    if (!atual) return true;
    const anterior = normalizar(atual.destino_url || padrao);
    const mudaDestino = anterior !== novo;
    const mudaCodigo = codigo && codigo !== atual.codigo;
    if (!mudaDestino && !mudaCodigo) return true;
    const partes = ['Confirma a alteração do QR Code?'];
    if (mudaDestino) partes.push('Atenção: os acessos por este QR Code passarão a abrir outro endereço.', 'Endereço atual: ' + anterior, 'Novo endereço: ' + novo, 'O endereço anterior será guardado para permitir a restauração.');
    if (mudaCodigo) partes.push('Código atual: ' + atual.codigo, 'Novo código: ' + codigo, 'O código anterior continuará válido para preservar os QR Codes já impressos.');
    partes.push('Selecione Cancelar para manter o cadastro atual.');
    return global.confirm(partes.join('\n\n'));
  }
  function mostrarBackup(campo, qr, restaurar) {
    const ancora = campo.closest('label') || campo;
    const existente = ancora.nextElementSibling;
    if (existente && existente.classList.contains('qr-destino-backup')) existente.remove();
    const caixa = document.createElement('div');
    caixa.className = 'qr-destino-backup';
    const texto = document.createElement('p');
    if (qr && qr.destino_anterior_url) {
      texto.textContent = 'Endereço anterior salvo: ' + qr.destino_anterior_url;
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'secondary';
      botao.textContent = 'Restaurar endereço anterior';
      botao.addEventListener('click', () => { campo.value = qr.destino_anterior_url; restaurar(); });
      caixa.append(texto, botao);
    } else {
      texto.textContent = 'Nenhum endereço anterior salvo. Ao trocar o destino, o endereço atual será guardado automaticamente.';
      caixa.append(texto);
    }
    ancora.after(caixa);
  }
  global.AudireQrProtecao = { normalizar, confirmar, mostrarBackup };
})(window);
