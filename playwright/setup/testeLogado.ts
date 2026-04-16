import * as fs from 'fs';
import * as path from 'path';
import { test, expect } from './fixtures'
import LoginPage from '../support/pages/LoginPage'

const URL_DASHBOARD = "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"
const URL_LOGIN = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"

export const testeLogado = test.extend<object, { arquivoInfoLogin: string }>({
    arquivoInfoLogin: [async({ browser }, use) => {
        const id = test.info().parallelIndex
        const caminhoArquivo = path.resolve(test.info().project.outputDir, `infoLogin_${id}.json`)

        if (fs.existsSync(caminhoArquivo)) {
            await use(caminhoArquivo)
            return
        }

        const page = await browser.newPage({ storageState: undefined })
        const loginPage = new LoginPage(page)
  
        await page.goto(URL_LOGIN)
        await loginPage.login('Admin', 'admin123')
        await expect(page).toHaveURL(URL_DASHBOARD)

        await page.context().storageState({ path: caminhoArquivo })

        await use(caminhoArquivo)
        await page.close()

    }, { scope: 'worker' }],
    storageState: ({ arquivoInfoLogin }, use) => use(arquivoInfoLogin)
})