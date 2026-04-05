import { test, expect } from '../../setup/fixtures';
import { EnumMenuOption } from '../../support/enum/MenuOptions';
import { user } from '../../support/user/user';

test.beforeEach('Verificar título da página', async ({ loginPage, dashboardPage }) => {
  await loginPage.login(user.name, user.password)
  expect(await dashboardPage.userIsLogged()).toBeTruthy()
});

test('Deve acessar o menu "Admin"', async ({ dashboardPage }) => {
  expect(await dashboardPage.accessMenuOption(EnumMenuOption.ADMIN))
  expect(await dashboardPage.menuSelected()).toContain(EnumMenuOption.USER_MANAGEMENT)
})
