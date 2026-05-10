// ==========================================================================
// CONFIGURAÇÃO DO DASHBOARD
// ==========================================================================
// Edite os 2 valores abaixo com os seus. Tudo o resto funciona automaticamente.
// ==========================================================================

window.GARBO_CONFIG = {

  // 1) URL do CSV publicado da aba ALUNOS
  // Como obter: na planilha → Arquivo → Compartilhar → Publicar na web
  //   → Selecionar aba "ALUNOS" + formato "Valores separados por vírgula (.csv)"
  //   → Publicar → copiar URL aqui
  CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMb8trSPg3Q7u80QZlvFOIHfTbnwjcm3OX7aEPM9wJoXmegkPpngTC1XXSWnzDfsBjTPcL-OvxMAaa/pub?gid=2002507662&single=true&output=csv',

  // 2) URL do Apps Script publicado (endpoint que escreve na planilha)
  // Como obter: na planilha → Extensões → Apps Script
  //   → Cole o conteúdo de apps-script.gs → Salvar
  //   → Implantar → Nova implantação → Tipo: Web app
  //   → Executar como: Eu / Quem pode acessar: Qualquer pessoa
  //   → Implantar → copiar URL aqui (termina em /exec)
  // Se não configurado, os botões de ação ficam desabilitados (modo somente-leitura).
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxS8iR8RQpYCPaeoKGPfB6K2lTA7lOGzZd2vy9r9kGUtCarwXPYij225A14zbFfkUW67g/exec',

  // ----- Não precisa mexer daqui pra baixo -----

  // Cache do CSV: tempo entre auto-refreshes (em minutos)
  REFRESH_INTERVAL_MIN: 5,

  // Marca exibida no header
  BRAND_NAME: 'Garbo',
  BRAND_SUFFIX: '.CRM',

  // Link do botão "Abrir planilha" da sidebar (substitua se quiser apontar pra outra)
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/19c1cJnNJvlLXI4wRB1HRWrgJxkFTh6dPJPDh2dppALQ/edit',
};
