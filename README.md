# Audesc Web — catálogo com módulo visual de ao vivo

Esta versão do Audesc reúne:

- catálogo web de repositórios de audiodescrição;
- módulo visual separado para transmissão e recepção ao vivo;
- remoção do recurso de QR code na versão web.

## Estrutura principal

- `index.html`
- `style.css`
- `app.js`
- `manifest.webmanifest`
- `data/repositories.json`
- `live/transmitir.html`
- `live/receber.html`
- `live/live.css`
- `live/live.js`

## Como funciona

### Catálogo
O aplicativo lê:
- `data/repositories.json`

E mostra apenas as categorias que possuem resultados.

### Módulo ao vivo
As páginas em `live/` foram criadas como protótipo visual do fluxo de:
- transmitir
- receber
- enviar feedback
- pedir ajuda

A transmissão real do áudio ainda depende de integração posterior com serviço específico de tempo real.
