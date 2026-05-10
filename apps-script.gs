// ==========================================================================
// GARBO CRM — Apps Script
// ==========================================================================
// Este código fica DENTRO da planilha (Extensões > Apps Script).
// Ele expõe endpoints que o dashboard usa pra escrever na planilha
// (criar aluno, registrar renovação, mudar status).
//
// SETUP (1x):
//   1. Cole este código inteiro no editor Apps Script da SUA planilha
//   2. Salvar (ícone disquete) → Nome do projeto: "GarboCRM"
//   3. Implantar → Nova implantação
//        - Tipo: Web app
//        - Descrição: API GarboCRM
//        - Executar como: Eu (seu email)
//        - Quem pode acessar: Qualquer pessoa
//   4. Autorizar (vai pedir permissão pra editar a planilha)
//   5. Copiar a URL gerada (termina em /exec) → cole em config.js
//
// IMPORTANTE: ao mudar este código, é preciso fazer "Implantar > Gerenciar implantações"
// e clicar em "Nova versão" pra a URL refletir as mudanças.
// ==========================================================================

const SHEET_NAME = 'ALUNOS';

// Headers da aba ALUNOS — ordem importa, não mexer
const HEADERS = [
  'ID','NOME','DATA_INICIO','PLANO','DATA_INICIO_CICLO','VENCIMENTO',
  'VALOR','FORMA_PGTO','STATUS','ONBOARDING_OK','RENOVOU_VEZES','UPSELL',
  'ORIGEM','CONGELADO_ATE','MOTIVO_SAIDA','ULTIMA_INTERACAO','OBSERVACOES'
];

// Duração dos planos (em meses) — pra calcular vencimento
const DURACAO = {
  'Trimestral': 3, 'Semestral': 6, 'Anual': 12,
  'Trimestral Black': 6, 'Semestral Black': 12, 'Anual Black': 24,
  'Mensal': 1, 'Bimestral': 2,
};

// ==========================================================================
// ENDPOINT PRINCIPAL
// ==========================================================================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    let result;

    switch (action) {
      case 'create':       result = createAluno(body.data); break;
      case 'renew':        result = renewAluno(body.id, body.data); break;
      case 'updateStatus': result = updateStatus(body.id, body.data); break;
      case 'update':       result = updateAluno(body.id, body.data); break;
      case 'delete':       result = deleteAluno(body.id); break;
      default: throw new Error('Ação desconhecida: ' + action);
    }

    return jsonResponse({ ok: true, result });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: 'Garbo CRM API. Use POST.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================================================
// AÇÕES
// ==========================================================================

// Cria novo aluno. Calcula vencimento automático baseado no plano.
function createAluno(data) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  const lastId = getLastId(sheet);
  const newId = lastId + 1;

  const dataInicio = data.DATA_INICIO ? parseDate(data.DATA_INICIO) : new Date();
  const plano = (data.PLANO || '').trim();
  const inicioCiclo = data.DATA_INICIO_CICLO ? parseDate(data.DATA_INICIO_CICLO) : dataInicio;
  let vencimento = data.VENCIMENTO ? parseDate(data.VENCIMENTO) : null;

  if (!vencimento && DURACAO[plano] && inicioCiclo) {
    vencimento = new Date(inicioCiclo);
    vencimento.setMonth(vencimento.getMonth() + DURACAO[plano]);
  }

  const row = HEADERS.map(h => {
    switch (h) {
      case 'ID': return newId;
      case 'DATA_INICIO': return formatDate(dataInicio);
      case 'DATA_INICIO_CICLO': return formatDate(inicioCiclo);
      case 'VENCIMENTO': return vencimento ? formatDate(vencimento) : '';
      case 'STATUS': return data.STATUS || 'Ativo';
      case 'RENOVOU_VEZES': return data.RENOVOU_VEZES || 0;
      case 'UPSELL': return data.UPSELL || 'FALSE';
      case 'ONBOARDING_OK': return data.ONBOARDING_OK || 'FALSE';
      default: return data[h] || '';
    }
  });

  sheet.appendRow(row);
  return { id: newId, row: lastRow + 1 };
}

// Registra renovação: incrementa RENOVOU_VEZES, atualiza ciclo e vencimento.
// data deve ter: PLANO (opcional, se mudar), VALOR (opcional), DATA_INICIO_CICLO (default = hoje), UPSELL (opcional)
function renewAluno(id, data) {
  const sheet = getSheet();
  const rowNum = findRowById(sheet, id);
  if (!rowNum) throw new Error('Aluno ID ' + id + ' não encontrado');

  const current = getRowAsObject(sheet, rowNum);
  const novoPlano = (data.PLANO || current.PLANO || '').trim();
  const inicioCiclo = data.DATA_INICIO_CICLO ? parseDate(data.DATA_INICIO_CICLO) : new Date();
  let vencimento = data.VENCIMENTO ? parseDate(data.VENCIMENTO) : null;

  if (!vencimento && DURACAO[novoPlano]) {
    vencimento = new Date(inicioCiclo);
    vencimento.setMonth(vencimento.getMonth() + DURACAO[novoPlano]);
  }

  const renovs = Number(current.RENOVOU_VEZES || 0) + 1;
  const updates = {
    PLANO: novoPlano,
    DATA_INICIO_CICLO: formatDate(inicioCiclo),
    VENCIMENTO: vencimento ? formatDate(vencimento) : current.VENCIMENTO,
    RENOVOU_VEZES: renovs,
    STATUS: 'Ativo',
    ULTIMA_INTERACAO: formatDate(new Date()),
  };
  if (data.VALOR != null && data.VALOR !== '') updates.VALOR = data.VALOR;
  if (data.UPSELL) updates.UPSELL = data.UPSELL;
  if (data.FORMA_PGTO) updates.FORMA_PGTO = data.FORMA_PGTO;

  applyUpdates(sheet, rowNum, updates);
  return { id, renovs, vencimento: updates.VENCIMENTO };
}

// Muda status (Ativo, Congelado, Vencido, Sumido, Cancelado) e campos relacionados
function updateStatus(id, data) {
  const sheet = getSheet();
  const rowNum = findRowById(sheet, id);
  if (!rowNum) throw new Error('Aluno ID ' + id + ' não encontrado');

  const updates = {
    STATUS: data.STATUS,
    ULTIMA_INTERACAO: formatDate(new Date()),
  };
  if (data.STATUS === 'Congelado' && data.CONGELADO_ATE) {
    updates.CONGELADO_ATE = formatDate(parseDate(data.CONGELADO_ATE));
  }
  if (data.STATUS === 'Cancelado' && data.MOTIVO_SAIDA) {
    updates.MOTIVO_SAIDA = data.MOTIVO_SAIDA;
  }
  if (data.OBSERVACOES) {
    const current = getRowAsObject(sheet, rowNum);
    const prev = current.OBSERVACOES ? current.OBSERVACOES + ' | ' : '';
    updates.OBSERVACOES = prev + data.OBSERVACOES;
  }

  applyUpdates(sheet, rowNum, updates);
  return { id, status: data.STATUS };
}

// Apaga linha do aluno
function deleteAluno(id) {
  const sheet = getSheet();
  const rowNum = findRowById(sheet, id);
  if (!rowNum) throw new Error('Aluno ID ' + id + ' não encontrado');
  sheet.deleteRow(rowNum);
  return { id, deleted: true };
}

// Atualização genérica de qualquer campo
function updateAluno(id, data) {
  const sheet = getSheet();
  const rowNum = findRowById(sheet, id);
  if (!rowNum) throw new Error('Aluno ID ' + id + ' não encontrado');
  applyUpdates(sheet, rowNum, data);
  return { id };
}

// ==========================================================================
// HELPERS
// ==========================================================================

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Aba "' + SHEET_NAME + '" não encontrada na planilha');
  return sheet;
}

function getLastId(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues().flat();
  return Math.max(...ids.map(v => Number(v) || 0), 0);
}

function findRowById(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return null;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues().flat();
  const idx = ids.findIndex(v => String(v) === String(id));
  return idx >= 0 ? idx + 2 : null;
}

function getRowAsObject(sheet, rowNum) {
  const values = sheet.getRange(rowNum, 1, 1, HEADERS.length).getValues()[0];
  const obj = {};
  HEADERS.forEach((h, i) => obj[h] = values[i]);
  return obj;
}

function applyUpdates(sheet, rowNum, updates) {
  for (const [key, val] of Object.entries(updates)) {
    const col = HEADERS.indexOf(key) + 1;
    if (col > 0) sheet.getRange(rowNum, col).setValue(val);
  }
}

function parseDate(s) {
  if (!s) return null;
  if (s instanceof Date) return s;
  // ISO (yyyy-mm-dd) ou BR (dd/mm/yyyy)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s);
  const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let [_, d, mo, y] = m;
  if (y.length === 2) y = '20' + y;
  return new Date(Number(y), Number(mo) - 1, Number(d));
}

function formatDate(d) {
  if (!d) return '';
  if (typeof d === 'string') return d;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
