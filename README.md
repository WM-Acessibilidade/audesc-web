# Audesc Web — catálogo de repositórios com QR de itens

Esta versão do Audesc foi adaptada para funcionar como catálogo web de repositórios de audiodescrição.

## Como funciona

O aplicativo lê o arquivo:

```text
data/repositories.json
```

Nesse arquivo ficam:
- os nomes das categorias;
- os links dos repositórios;
- a descrição de cada repositório.

## Regras desta versão

- apenas categorias com resultados aparecem;
- o Audesc não usa player próprio;
- ao abrir um resultado do catálogo, o usuário é levado à página principal do repositório;
- a leitura de QR code abre diretamente o link específico do item identificado;
- esta versão foi pensada para repositórios no formato do Memorial MPF.

## Como testar no iPhone

### Opção 1 — GitHub Pages
1. envie os arquivos desta pasta para um repositório público no GitHub;
2. ative o GitHub Pages;
3. abra o link no Safari do iPhone.

### Opção 2 — Servidor local
```bash
python3 -m http.server 8080
```

Depois abra:
```text
http://localhost:8080
```
