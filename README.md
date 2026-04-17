# Orange HRM — Automação de Testes E2E com Playwright

Projeto de automação de testes End-to-End para o [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com), desenvolvido com **Playwright**, **TypeScript** e integração com modelos de linguagem (LLM) para **geração automática de cenários de teste** a partir de screenshots de página.

---

## Tecnologias Utilizadas

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![LangChain](https://img.shields.io/badge/LangChain-1.3-1C3C3C?logo=langchain&logoColor=white)](https://js.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai&logoColor=white)](https://platform.openai.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=googlegemini&logoColor=white)](https://aistudio.google.com/)
[![dotenv](https://img.shields.io/badge/dotenv-17-ECD53F?logo=dotenv&logoColor=black)](https://github.com/motdotla/dotenv)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) LTS (v18 ou superior)
- npm
- Chave de API da [OpenAI](https://platform.openai.com/api-keys) e/ou do [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Instalação

```bash
# Instalar dependências
npm install

# Baixar os browsers do Playwright
npx playwright install
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
# Provedor LLM ativo: 'openai' ou 'gemini'
LLM_PROVIDER=openai

# Chave da API OpenAI (necessária se LLM_PROVIDER=openai)
OPENAI_API_KEY=your_openai_api_key_here

# Chave da API Google Gemini (necessária se LLM_PROVIDER=gemini)
GOOGLE_API_KEY=your_gemini_api_key_here
```

> **Atenção:** o arquivo `.env` está no `.gitignore` e **nunca deve ser commitado**.

---

## Estrutura do projeto

```
orange_opensource/
├── playwright/
│   ├── docs/
│   │   ├── prompt/
│   │   │   └── prompt-testcase-generator.md   # Template de prompt enviado à LLM
│   │   └── tests/                             # ⚠️ Pasta gerada automaticamente
│   │       └── casos_de_teste_*.md            # Cenários sugeridos pela LLM
│   ├── e2e/
│   │   └── atual/
│   │       ├── login.spec.ts                  # Testes de login
│   │       ├── dashboard.spec.ts              # Testes do dashboard
│   │       └── employerListPage.spec.ts       # Testes da lista de empregados + geração LLM + autenticação com worker (sem re-login)
│   ├── setup/
│   │   ├── fixtures.ts                        # Fixtures base (loginPage, dashboardPage)
│   │   └── testeLogado.ts                     # Fixture com autenticação via worker
│   └── support/
│       ├── enum/
│       │   └── MenuOptions.ts                 # Enum com opções de menu
│       ├── llm/
│       │   ├── llmAnalyzer.ts                 # Integração com OpenAI / Gemini via LangChain
│       │   └── pageCapture.ts                 # Captura de screenshot e envio para LLM
│       ├── pages/
│       │   ├── LoginPage.ts                   # Page Object da tela de login
│       │   └── dashboardPage.ts               # Page Object do dashboard
│       └── user/
│           └── user.ts                        # Dados de usuário para testes
├── .env                                       # Variáveis de ambiente (não commitado)
├── .env.example                               # Modelo de variáveis de ambiente
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

---

## Funcionalidades

### Autenticação com worker (sem re-login)

O arquivo `playwright/setup/testeLogado.ts` implementa um **fixture de escopo `worker`** que realiza o login uma única vez por processo paralelo e reutiliza a sessão autenticada em todos os testes do mesmo worker.

**Como funciona:**

1. Na primeira execução de cada worker, o fixture abre uma nova página, efetua login com as credenciais `Admin / admin123` e salva o estado do navegador (cookies e localStorage) em um arquivo JSON temporário (`infoLogin_<id>.json`).
2. Nas execuções seguintes do mesmo worker, o arquivo de sessão já existe e é reutilizado diretamente, sem novo login.
3. O `storageState` do Playwright é sobrescrito para apontar para esse arquivo, fazendo com que todas as páginas abertas nos testes já partam autenticadas.

**Benefícios:**

- Elimina re-logins desnecessários entre testes, reduzindo o tempo de execução.
- Cada worker paralelo mantém sua própria sessão isolada (`infoLogin_0.json`, `infoLogin_1.json`, etc.).

**Uso nos specs:**

```typescript
import { testeLogado } from '../../setup/testeLogado';

testeLogado.describe('Minha suite', () => {
  testeLogado('Meu teste', async ({ page }) => {
    // página já autenticada
  });
});
```

---

### Geração automática de cenários de teste via LLM

O projeto integra modelos de linguagem (OpenAI GPT-4o ou Google Gemini) para **analisar screenshots de páginas** e gerar automaticamente um documento Markdown com cenários de teste estruturados.

#### Como funciona

1. Durante a execução do teste, a função `captureAndAnalyzePage` captura um screenshot da página atual.
2. O screenshot é convertido para base64 e enviado junto com um prompt estruturado à LLM configurada.
3. A LLM analisa visualmente a página e retorna casos de teste no formato definido no prompt.
4. O resultado é salvo automaticamente em um arquivo `.md`.

#### Pasta de saída

> **Atenção:** a pasta `playwright/docs/tests/` é criada automaticamente pelo código caso não exista. Não é necessário criá-la manualmente.

O arquivo gerado para a página de Lista de Empregados é salvo em:

```
playwright/docs/tests/casos_de_teste_lista_empregados.md
```

#### Configurando o provedor LLM

Defina `LLM_PROVIDER` no `.env`:

```env
LLM_PROVIDER=openai   # usa GPT-4o
LLM_PROVIDER=gemini   # usa Gemini
```

#### Uso nos specs

```typescript
import { captureAndAnalyzePage } from '../../support/llm/pageCapture';

await captureAndAnalyzePage(page, {
  pageContext: `Lista de Empregados - ${page.url()}`,
  outputPath: path.resolve(process.cwd(), 'playwright/docs/tests/casos_de_teste_lista_empregados.md'),
});
```

#### Arquivos envolvidos

| Arquivo | Responsabilidade |
|---|---|
| `playwright/support/llm/pageCapture.ts` | Captura o screenshot e chama o analyzer |
| `playwright/support/llm/llmAnalyzer.ts` | Monta a mensagem, chama a LLM e salva o `.md` |
| `playwright/docs/prompt/prompt-testcase-generator.md` | Template do prompt enviado à LLM |

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm test` | Executa todos os testes |
| `npm run test:ui` | Abre a interface gráfica do Playwright (UI Mode) |
| `npm run test:ch` | Executa apenas no Chromium |
| `npm run test:debug` | Executa em modo debug (passo a passo) |
| `npm run test:codegen` | Abre o Codegen para gravação de novos testes |

---

## Configuração do Playwright

| Configuração | Valor |
|---|---|
| Browser padrão | Chromium |
| Modo headless | `false` (browser visível) |
| Timeout por teste | 60 segundos |
| Timeout de asserção | 5 segundos |
| Execução paralela | Ativada |
| Relatório | HTML (`playwright-report/`) |
| Trace | Gravado em caso de falha (`retain-on-failure`) |

---

## Relatório

Após a execução, abra o relatório HTML com:

```bash
npx playwright show-report
```

---

## Licença

ISC
