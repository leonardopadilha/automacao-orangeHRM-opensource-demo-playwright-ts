import { expect } from "../../setup/fixtures";
import { testeLogado } from "../../setup/testeLogado";
import { EnumMenuOption } from '../../support/enum/MenuOptions';

testeLogado.describe('Acessar a página de Lista de Empregados', () => {
    testeLogado('Deve acessar a página de Lista de Empregados', async ({ dashboardPage }) => {
        await dashboardPage.navigateTo('/web/index.php/dashboard/index')

        await dashboardPage.accessMenuOption(EnumMenuOption.PIM)
        expect(await dashboardPage.menuSelected()).toContain(EnumMenuOption.PIM)
    })
})