import { expect } from "../../setup/fixtures";
import { testeLogado } from "../../setup/testeLogado";
import { EnumMenuOption } from '../../support/enum/MenuOptions';
import { captureAndAnalyzePage } from '../../support/llm/pageCapture';

testeLogado.describe('Lista de Empregados', () => {
    testeLogado('Deve acessar a página de Lista de Empregados', async ({ page, dashboardPage }) => {
        await dashboardPage.navigateTo('/web/index.php/dashboard/index')

        await dashboardPage.accessMenuOption(EnumMenuOption.PIM)
        expect(await dashboardPage.menuSelected()).toContain(EnumMenuOption.PIM)

        await captureAndAnalyzePage(page, {
            pageContext: `Lista de Empregados - ${page.url()}`,
        })
    })
})