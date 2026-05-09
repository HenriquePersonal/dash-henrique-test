# Garbo CRM — Dashboard de alunos

Dashboard web pra personal trainer / consultor online gerenciar alunos, renovações, MRR e churn. Lê dados ao vivo de uma planilha Google Sheets e permite cadastrar / renovar / mudar status direto pelo dash (sem abrir o Sheets).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fformacaoinss%2Fdash-henrique-test)

## O que tem

- **Visão geral**: MRR, receita do mês, vendas novas vs renovações, taxa de renovação, churn 30d, vida média do aluno
- **Follow-up**: vencendo hoje / esta semana
- **Próximas renovações** (30 dias)
- **Tabela completa** de alunos com busca, filtros (plano, origem, status, intervalo de datas), ordenação, export CSV
- **Detalhes do aluno** em painel lateral com todos os campos
- **Ações** (requer Apps Script): cadastrar novo aluno, registrar renovação, mudar status — direto do dash
- **Charts** clicáveis (filtram a tabela)
- Tema claro / escuro
- 100% responsivo (desktop + celular)

## Stack

- HTML + CSS + JavaScript vanilla (sem build, sem framework)
- [PapaParse](https://www.papaparse.com/) (parser de CSV) e [Chart.js](https://www.chartjs.org/) — ambos via CDN
- Google Sheets como banco de dados
- Google Apps Script como API de escrita
- Hospedagem: Vercel (grátis)

## Setup completo (~30 min)

### 1. Clone / fork do repositório

Clica em **Fork** no canto superior direito desta página, ou:

```bash
git clone https://github.com/formacaoinss/dash-henrique-test.git
cd dash-henrique-test
```

### 2. Prepare a planilha Google Sheets

Você precisa de uma planilha com aba `ALUNOS` com estas colunas (nesta ordem):

```
ID | NOME | DATA_INICIO | PLANO | DATA_INICIO_CICLO | VENCIMENTO | VALOR | FORMA_PGTO | STATUS | ONBOARDING_OK | RENOVOU_VEZES | UPSELL | ORIGEM | CONGELADO_ATE | MOTIVO_SAIDA | ULTIMA_INTERACAO | OBSERVACOES
```

**Status válidos:** `Ativo`, `Congelado`, `Vencido`, `Sumido`, `Cancelado`
**Planos com cálculo de vencimento:** `Trimestral` (3m), `Semestral` (6m), `Anual` (12m), `Trimestral Black` (6m), `Semestral Black` (12m), `Anual Black` (24m), `Mensal` (1m), `Bimestral` (2m)
**Formato de datas:** `dd/mm/aaaa`

### 3. Publique a aba como CSV

Na planilha:

1. **Arquivo → Compartilhar → Publicar na web**
2. Em "Documento inteiro" troque pra **`ALUNOS`** (a aba específica)
3. Em formato selecione **`Valores separados por vírgula (.csv)`**
4. **Publicar** → confirme
5. **Copie a URL** (começa com `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

### 4. Configure o Apps Script (escrita)

Esta etapa é o que permite o dash gravar na planilha. Sem isso, o dash funciona só em modo leitura (botões "Novo aluno", "Renovar", "Mudar status" ficam desabilitados).

1. Na planilha: **Extensões → Apps Script**
2. Apague o código padrão (`function myFunction() {...}`)
3. Cole o conteúdo inteiro do arquivo [`apps-script.gs`](apps-script.gs) deste repo
4. **Salvar** (ícone de disquete) → nome do projeto: **GarboCRM**
5. **Implantar → Nova implantação**
   - Tipo: **App da Web**
   - Descrição: `API GarboCRM`
   - Executar como: **Eu** (seu email)
   - Quem pode acessar: **Qualquer pessoa**
6. **Implantar** → autoriza (vai pedir permissão pra editar a planilha)
7. **Copie a URL gerada** (termina em `/exec`)

> **Quando atualizar o Apps Script:** vá em **Implantar → Gerenciar implantações** → ícone de lápis → **Nova versão** → Implantar. A URL não muda, só recompila.

### 5. Configure o `config.js`

Abra o arquivo [`config.js`](config.js) no seu editor (ou direto no GitHub) e cole as 2 URLs:

```javascript
window.GARBO_CONFIG = {
  CSV_URL: 'COLE_AQUI_a_URL_do_passo_3',
  APPS_SCRIPT_URL: 'COLE_AQUI_a_URL_do_passo_4',
  // ...
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit',
};
```

Faça commit e push.

### 6. Deploy no Vercel

Use o botão **Deploy with Vercel** no topo deste README, ou:

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta GitHub
3. Importe o repositório
4. Framework Preset: **Other**
5. Build / Output: deixe em branco (é HTML estático)
6. **Deploy**

Em ~30s você terá uma URL tipo `https://seu-projeto.vercel.app`. Cada `git push` na branch `main` redeploya automaticamente.

### 7. Teste

- Abra a URL no navegador → deve carregar com seus alunos
- Clica em **"Novo aluno"** → preenche → confirma → deve aparecer na planilha
- Clica em qualquer aluno → **Renovar** → preenche → deve incrementar `RENOVOU_VEZES` na planilha
- Clica em qualquer aluno → **Mudar status** → escolhe novo status → deve atualizar na planilha

## Como usar no dia-a-dia

### Cadastrar aluno novo

1. Botão **"+ Novo aluno"** no header
2. Preencher nome, plano, valor, data início
3. Vencimento é calculado automaticamente baseado no plano
4. Confirmar → cai na planilha + recarrega o dash

### Registrar renovação

1. Clicar no aluno (na tabela ou em "Próximas renovações")
2. Botão **Renovar** no painel lateral
3. Confirmar plano (mesmo ou novo) e data do pagamento
4. `RENOVOU_VEZES` incrementa, novo vencimento calculado

### Mudar status

1. Clicar no aluno
2. Botão **Mudar status**
3. Escolher novo status:
   - **Congelado**: pede data de retorno
   - **Cancelado**: pede motivo
4. Atualiza `ULTIMA_INTERACAO` automaticamente

## Notas importantes

- **Cache do CSV**: o Google publica com cache de ~5 minutos. Edições na planilha demoram até 5 min pra aparecer no dash. Use o botão **Atualizar** pra forçar nova busca (mas se o cache do Google ainda tá velho, vai vir velho).
- **Auto-refresh**: o dash recarrega sozinho a cada 5 min (configurável em `config.js`).
- **Modo somente-leitura**: se `APPS_SCRIPT_URL` ficar vazio em `config.js`, os botões de ação ficam desabilitados, mas o dash continua funcionando como visualização.
- **Privacidade**: o CSV publicado é público (qualquer pessoa com a URL vê os dados). O Apps Script com "Qualquer pessoa" também é endpoint público — qualquer um com a URL pode escrever na planilha. Se isso for problema, considere deploy em domínio privado / proxy.

## Arquitetura

```
┌──────────────────────────┐
│  index.html (Vercel)     │  ← interface
└────────┬─────────┬───────┘
         │         │
   leitura│         │escrita
   (CSV)  │         │(JSON POST)
         ▼         ▼
┌──────────────────────────┐
│  Google Sheets           │
│  ↳ aba ALUNOS            │
│  ↳ Apps Script           │
└──────────────────────────┘
```

## Estrutura do repo

```
dashboard/
├── index.html        # dash completo (HTML + CSS + JS)
├── config.js         # configuração (CSV_URL, APPS_SCRIPT_URL)
├── apps-script.gs    # código pra colar no Apps Script da planilha
└── README.md         # este arquivo
```

## Licença

Uso livre. Use, modifique, redistribua.
