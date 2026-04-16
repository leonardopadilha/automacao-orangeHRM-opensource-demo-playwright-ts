import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

type LLMProvider = 'openai' | 'gemini';

export interface AnalysisOptions {
  provider?: LLMProvider;
  outputPath?: string;
  pageContext?: string;
}

function buildLLM(provider: LLMProvider) {
  if (provider === 'gemini') {
    return new ChatGoogleGenerativeAI({
      model: 'gemini-3-flash-preview',
      apiKey: process.env.GOOGLE_API_KEY
    });
  }

  return new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const PROMPT_PATH = path.resolve(
  __dirname,
  '../../docs/prompt/prompt-testcase-generator.md'
);

function loadPromptTemplate(pageContext: string): string {
  const template = fs.readFileSync(PROMPT_PATH, 'utf-8');

  return template
    .replace('{{systemName}}', pageContext || 'Sistema identificado na imagem')
    .replace('{{description}}', 'Analise a imagem fornecida e utilize o que você visualiza para inferir a descrição do sistema, seus módulos e funcionalidades disponíveis na tela.')
    .replace('{{modules}}', 'Identifique os módulos e elementos interativos visíveis na tela e gere casos de teste para cada um deles.')
    .replace('{{userProfiles}}', 'Identifique os perfis relevantes com base no contexto visual da tela (ex.: usuário autenticado, administrador, etc.).')
    .replace('{{businessRules}}', 'Infira as regras de negócio a partir dos elementos, campos, botões e fluxos visíveis na tela.');
}

function buildMessage(screenshotBase64: string, pageContext: string): HumanMessage {
  const prompt = loadPromptTemplate(pageContext);

  return new HumanMessage({
    content: [
      {
        type: 'text',
        text: prompt,
      },
      {
        type: 'image_url',
        image_url: { url: `data:image/png;base64,${screenshotBase64}` },
      },
    ],
  });
}

function buildMarkdown(suggestions: string, pageContext: string, provider: LLMProvider): string {
  const timestamp = new Date().toLocaleString('pt-BR');
  return `# Cenários de Teste Sugeridos

**Página analisada:** ${pageContext || 'Não informada'}  
**Provedor LLM:** ${provider === 'openai' ? 'OpenAI (gpt-4o)' : 'Google Gemini (gemini-3-flash-preview)'}  
**Gerado em:** ${timestamp}

---

${suggestions}
`;
}

/**
 * Analisa um screenshot de página via LLM e gera um arquivo .md com sugestões de cenários de teste.
 *
 * @param screenshotBase64 - Screenshot da página em base64 (PNG)
 * @param options.pageContext - Contexto da página (título, URL, etc.) para orientar o modelo
 * @param options.provider   - 'openai' | 'gemini' (padrão: variável LLM_PROVIDER do .env)
 * @param options.outputPath - Caminho completo do arquivo .md a ser gerado
 * @returns Texto com os cenários sugeridos
 */
export async function analyzePageAndSuggestTests(
  screenshotBase64: string,
  options: AnalysisOptions = {}
): Promise<string> {
  const provider: LLMProvider =
    options.provider ??
    (process.env.LLM_PROVIDER as LLMProvider) ??
    'openai';

  const pageContext = options.pageContext ?? '';

  const outputPath =
    options.outputPath ??
    path.resolve(process.cwd(), 'cenarios_sugeridos.md');

  const llm = buildLLM(provider);
  const message = buildMessage(screenshotBase64, pageContext);

  const response = await llm.invoke([message]);
  const suggestions = typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);

  const markdown = buildMarkdown(suggestions, pageContext, provider);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`\n[llmAnalyzer] Cenários salvos em: ${outputPath}`);

  return suggestions;
}
