# Orange Open Source — Automação com Playwright

Projeto de **prática de automação de testes** usando **Playwright**, **TypeScript** e **MCP Playwright**. Os testes cobrem fluxos de login do [OrangeHRM Open Source Demo](https://opensource-demo.orangehrmlive.com).

## Objetivo

- Praticar automação de testes E2E com **Playwright**
- Escrever testes em **TypeScript**
- Utilizar **MCP Playwright** como ferramenta de suporte à automação

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado LTS)
- npm ou yarn

## Instalação

```bash
npm install
npx playwright install
```

O comando `playwright install` baixa os browsers necessários (Chromium, etc.) para rodar os testes.

## Estrutura do projeto

```
orange_opensource/
├── playwright/
│   └── e2e/
│       └── login.spec.ts   # Testes de login
├── playwright.config.ts   # Configuração do Playwright
├── package.json
└── README.md
```

## Cenários de teste (login)

Os testes em `playwright/e2e/login.spec.ts` cobrem:

| Cenário | Descrição |
|--------|-----------|
| Título da página | Verifica se o título contém "OrangeHRM" |
| Login em branco | Valida mensagens "Required" ao enviar formulário vazio |
| Usuário inválido | Valida mensagem "Invalid credentials" com usuário inexistente |
| Senha inválida | Valida mensagem "Invalid credentials" com senha errada |
| Login válido | Login com Admin/admin123 e validação do dashboard |

**Base URL:** `https://opensource-demo.orangehrmlive.com`

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:ui` | Abre a interface gráfica do Playwright (UI Mode) |
| `npm run test:ch` | Executa apenas no Chromium |
| `npm run test:debug` | Executa em modo debug (step-by-step) |
| `npm run test:codegen` | Abre o Codegen para gravar novos testes |

## Configuração

- **Browser:** Chromium (configurável em `playwright.config.ts`)
- **Modo:** `headless: false` (janela do browser visível durante os testes)
- **Relatório:** HTML (`playwright-report/` após a execução)
- **Trace:** gravado na primeira tentativa de retry em caso de falha

## Rodando os testes

```bash
# Todos os testes
npm test

# Com interface visual
npm run test:ui

# Apenas Chromium
npm run test:ch

# Debug (passo a passo)
npm run test:debug
```

## Relatório

Após a execução, o relatório HTML pode ser aberto com:

```bash
npx playwright show-report
```

## Tecnologias

- **Playwright** — framework de automação E2E
- **TypeScript** — linguagem dos testes
- **MCP Playwright** — suporte via Model Context Protocol para automação

## Licença

ISC
