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

  // 2b) URL do CSV publicado da aba LEADS
  // Como obter: mesma sequência acima, mas selecionar aba "LEADS"
  LEADS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQMb8trSPg3Q7u80QZlvFOIHfTbnwjcm3OX7aEPM9wJoXmegkPpngTC1XXSWnzDfsBjTPcL-OvxMAaa/pub?gid=1187508675&single=true&output=csv',

  // 2c) URL do CSV publicado da aba PERSONAL
  // Como obter: mesma sequência acima, mas selecionar aba "PERSONAL"
  PERSONAL_CSV_URL: '',

  // 2) URL do Apps Script publicado (endpoint que escreve na planilha)
  // Como obter: na planilha → Extensões → Apps Script
  //   → Cole o conteúdo de apps-script.gs → Salvar
  //   → Implantar → Nova implantação → Tipo: Web app
  //   → Executar como: Eu / Quem pode acessar: Qualquer pessoa
  //   → Implantar → copiar URL aqui (termina em /exec)
  // Se não configurado, os botões de ação ficam desabilitados (modo somente-leitura).
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxS8iR8RQpYCPaeoKGPfB6K2lTA7lOGzZd2vy9r9kGUtCarwXPYij225A14zbFfkUW67g/exec',

  // ----- Não precisa mexer daqui pra baixo -----

  // Token enviado em toda chamada à API (deve bater com SECRET_TOKEN no Apps Script)
  API_TOKEN: '6867772bb7b317013dec88bcaba72f73eaf38c53',

  // Credenciais de acesso ao dashboard (senha armazenada como SHA-256 — nunca texto puro)
  LOGIN_EMAIL: 'nunesbispo011@gmail.com',
  LOGIN_PASS_HASH: 'ff345f38f6b9a6803b61d9d3eb5b4dad8369e7b1516f4317a7025a4fc7447320',

  // Cache do CSV: tempo entre auto-refreshes (em minutos)
  REFRESH_INTERVAL_MIN: 5,

  // Marca exibida no header
  BRAND_NAME: 'Consultoria Henrique',
  BRAND_SUFFIX: ' CRM',

  // Link do botão "Abrir planilha" da sidebar (substitua se quiser apontar pra outra)
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/19c1cJnNJvlLXI4wRB1HRWrgJxkFTh6dPJPDh2dppALQ/edit',
};
