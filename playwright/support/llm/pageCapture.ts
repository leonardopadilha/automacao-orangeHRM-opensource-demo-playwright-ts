import * as path from 'path';
import type { Page } from '@playwright/test';
import { analyzePageAndSuggestTests, AnalysisOptions } from './llmAnalyzer';

/**
 * Captura um screenshot da página atual e envia para a LLM analisar e sugerir cenários de teste.
 * Atalho para uso direto em specs Playwright — elimina o boilerplate de screenshot + conversão.
 *
 * @param page    - Instância de Page do Playwright
 * @param options - Mesmas opções de analyzePageAndSuggestTests (provider, outputPath, pageContext)
 * @returns Texto com os cenários sugeridos
 */
export async function captureAndAnalyzePage(
  page: Page,
  options: AnalysisOptions = {}
): Promise<string> {
  const screenshotBuffer = await page.screenshot();
  const screenshotBase64 = screenshotBuffer.toString('base64');

  const pageContext = options.pageContext ?? page.url();
  const outputPath =
    options.outputPath ??
    path.resolve(process.cwd(), 'cenarios_sugeridos.md');

  return analyzePageAndSuggestTests(screenshotBase64, {
    ...options,
    pageContext,
    outputPath,
  });
}
