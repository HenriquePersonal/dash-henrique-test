# Handoff — passar pro seu amigo

Este documento é o **passo-a-passo objetivo** pra um amigo receber o dashboard e rodar **na conta dele**, do zero, em ~30 minutos.

Se você é o "amigo": siga este documento na ordem. Cada passo tem um critério claro de "OK".

> **Pré-requisitos:** conta Google, conta GitHub, conta Vercel (gratuita).

---

## 1. Fork do repositório (1 min)

1. Abra https://github.com/formacaoinss/dash-henrique-test
2. Clica em **Fork** (canto superior direito)
3. Em "Owner" escolhe **a sua conta GitHub**
4. Confirma → você terá `seu-usuario/dash-henrique-test`

✅ **OK quando:** você consegue acessar `https://github.com/SEU_USUARIO/dash-henrique-test`

---

## 2. Receber a planilha (5 min)

Tem 2 opções:

### Opção A — Receber a planilha existente (recomendado se já tem dados)

O dono atual transfere pra você:

1. **Dono atual** abre a planilha
2. Botão **Compartilhar** (canto superior direito)
3. Adiciona seu email com permissão **Editor**
4. Clica nos **3 pontinhos** ao lado do seu nome → **Transferir propriedade**
5. Você recebe email confirmando → aceita

Após aceitar, a planilha aparece em "Minhas unidades" no seu Drive.

### Opção B — Criar planilha nova do zero

1. Acesse https://sheets.new
2. Renomeie pra **"Garbo CRM"** (ou outro nome)
3. Renomeie a primeira aba pra **`ALUNOS`** (clique com botão direito na aba > Renomear)
4. Cole na **linha 1** os cabeçalhos abaixo (cada um numa coluna):

```
ID	NOME	DATA_INICIO	PLANO	DATA_INICIO_CICLO	VENCIMENTO	VALOR	FORMA_PGTO	STATUS	ONBOARDING_OK	RENOVOU_VEZES	UPSELL	ORIGEM	CONGELADO_ATE	MOTIVO_SAIDA	ULTIMA_INTERACAO	OBSERVACOES
```

✅ **OK quando:** você abre a planilha e vê a aba `ALUNOS` com (ou sem) dados.

---

## 3. Publicar o CSV (2 min)

1. Na planilha → **Arquivo → Compartilhar → Publicar na web**
2. Em "Documento inteiro" troca pra **`ALUNOS`**
3. Em formato troca pra **`Valores separados por vírgula (.csv)`**
4. **Publicar** → confirma → **copie a URL** que aparece (começa com `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

📋 Cole essa URL num bloco de notas — vai usar no passo 5.

✅ **OK quando:** você tem uma URL do tipo `https://docs.google.com/.../pub?gid=...&output=csv` copiada.

---

## 4. Configurar Apps Script (5 min)

Esta é a etapa que mais tem detalhe — siga com calma.

### 4.1 Criar o script

1. Na planilha → **Extensões → Apps Script**
2. Vai abrir um editor com `function myFunction() {}`. **Apague tudo.**
3. Volte no GitHub do seu fork → abra o arquivo **`apps-script.gs`** → clique em **Raw** (canto superior direito) → **Ctrl+A** + **Ctrl+C**
4. Cole no editor do Apps Script
5. **Ctrl+S** pra salvar → quando pedir nome do projeto: **`GarboCRM`**

### 4.2 Implantar como Web App

1. Botão azul **Implantar → Nova implantação**
2. Engrenagem ⚙️ ao lado de "Selecionar tipo" → escolhe **App da Web**
3. Preenche:
   - **Descrição:** `API GarboCRM`
   - **Executar como:** **Eu** (seu email)
   - **Quem pode acessar:** **Qualquer pessoa** ⚠️ (sem isso o dash não consegue chamar)
4. **Implantar**

### 4.3 Autorizar

Vai aparecer "Autorizar acesso":

1. Escolhe sua conta Google
2. Aviso "Google não verificou este app" (normal, é seu próprio script)
3. Clica em **Avançado** (canto inferior esquerdo)
4. **Acessar GarboCRM (não seguro)**
5. **Permitir**

### 4.4 Copiar URL

Aparece no final "URL do app da Web" — algo tipo:

```
https://script.google.com/macros/s/AKfycbx................/exec
```

📋 Cole essa URL no mesmo bloco de notas do passo anterior.

✅ **OK quando:** você abre essa URL no navegador e vê:
```json
{"ok":true,"message":"Garbo CRM API. Use POST."}
```

---

## 5. Configurar `config.js` (1 min)

No seu fork no GitHub:

1. Abre o arquivo **`config.js`**
2. Clica no ícone de **lápis ✏️** pra editar
3. Substitui as 2 URLs pelas suas:

```javascript
window.GARBO_CONFIG = {
  CSV_URL: 'COLE_AQUI_a_URL_do_passo_3',
  APPS_SCRIPT_URL: 'COLE_AQUI_a_URL_do_passo_4',
  REFRESH_INTERVAL_MIN: 5,
  BRAND_NAME: 'Seu_Nome',     // opcional — muda a marca exibida
  BRAND_SUFFIX: '.CRM',
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/SEU_ID_DA_PLANILHA/edit',
};
```

> **Pra pegar o `SHEET_URL`:** abre a planilha, copia a URL inteira da barra do navegador (até `/edit`).

4. **Commit changes** (botão verde) → Commit directly to the main branch

✅ **OK quando:** o `config.js` no GitHub tem suas URLs.

---

## 6. Deploy no Vercel (3 min)

1. Acesse https://vercel.com/signup
2. **Continue with GitHub** → autoriza Vercel a ver seus repos
3. **Add New → Project**
4. Encontra o repo **`dash-henrique-test`** que você forkou → clica **Import**
5. Configurações:
   - Framework Preset: **Other** (é HTML estático)
   - Root Directory: deixa em branco
   - Build / Output: deixa em branco
6. **Deploy**
7. Em ~30s aparece sua URL: `https://SEU-PROJETO.vercel.app`

✅ **OK quando:** você abre a URL e vê o dashboard com seus alunos.

> Cada `git push` daqui pra frente redeploya automaticamente.

---

## 7. Teste end-to-end (2 min)

No seu dash:

1. **Cadastrar:** clica **+ Novo aluno** → preenche **"Aluno Teste"** + Trimestral + R$500 + data hoje → Cadastrar. Toast verde aparece. Confere na planilha que ID novo foi criado.
2. **Renovar:** clica num aluno → painel abre → **Renovar** → preenche → confirma. `RENOVOU_VEZES` incrementa na planilha.
3. **Mudar status:** clica num aluno → **Mudar status** → Congelado + data → confirma. Atualiza na planilha.
4. **Excluir:** clica em "Aluno Teste" (do passo 1) → **Excluir** (vermelho) → digita "Aluno Teste" pra confirmar → confirma. Linha some da planilha.

✅ **OK quando:** as 4 ações funcionam.

---

## Quando atualizar o código depois

### Mudou só HTML/CSS/JS?
`git push` → Vercel redeploya em 30s. Pronto.

### Mudou o `apps-script.gs`?
Precisa publicar Nova versão no Apps Script (o GitHub não atualiza o Google):

1. Cola o código novo no editor do Apps Script
2. Ctrl+S
3. **Implantar → Gerenciar implantações**
4. Lápis ✏️ na implantação ativa
5. Versão: **Nova versão** → **Implantar**
6. URL não muda

> Se esquecer disso, ações novas (ex: `delete`) vão dar erro "Ação desconhecida".

---

## Problemas comuns

**Botões "Novo aluno", "Renovar", etc. estão cinzas / desabilitados**
→ `APPS_SCRIPT_URL` está vazio ou errado em `config.js`. Confira o passo 5.

**Erro "HTTP 401" ou "permission denied" ao tentar salvar**
→ Você não autorizou o Apps Script. Volte no editor → roda qualquer função → autoriza. Ou refaz o passo 4.3.

**Cadastrei aluno mas não aparece no dash**
→ Cache de 5 min do Google. Clica **Atualizar** (botão circular no header) → ele força bypass. Se ainda não aparecer, espera 1 min e tenta de novo.

**Dash em branco / erro de fetch**
→ `CSV_URL` está errado em `config.js`. Confira que termina em `&output=csv`.

**Excluir não libera o botão mesmo digitando o nome**
→ Espaços extras no nome do aluno. Versão atual já normaliza, mas se der problema, abre a planilha e olha o nome exato.

---

## Próximos passos sugeridos

Veja o **Roadmap** no [README.md](README.md#roadmap--próximas-melhorias) — tem várias ideias pra evoluir (editar aluno, histórico de pagamentos, notificações automáticas, etc).
