import { test, expect } from '../setup/fixtures';

test('Verificar título da página', async ({ page, loginPage }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/OrangeHRM/);
});

test('Validar mensagem de erro ao realizar login com credenciais em branco', async ({ loginPage }) => {
  await loginPage.login();

  const errorMessages = await loginPage.getErrorMessage()
  expect(errorMessages).toHaveLength(2)
  expect(errorMessages).toEqual(['Required', 'Required'])
});

test('Validar mensagem de erro ao realizar login com usuário inválido', async ({ loginPage }) => {
  await loginPage.login('invalid_username', 'admin123')
  expect(await loginPage.getInvalidCredentials()).toEqual('Invalid credentials')
})

test('Validar mensagem de erro ao realizar login com senha inválida', async ({ loginPage }) => {
  await loginPage.login('Admin', 'admin1234')
  expect(await loginPage.getInvalidCredentials()).toEqual('Invalid credentials')
})

test('Realizar login com credenciais válidas e validar sucesso', async ({ page, loginPage, dashboardPage }) => {
  await loginPage.login('Admin', 'admin123')
  expect(await dashboardPage.userIsLogged()).toBeTruthy()

  // Valida redirecionamento para o dashboard após login
  await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/)
  // Valida que o dashboard está visível (elemento típico da área logada)
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible()

  await page.getByRole('paragraph').filter({ hasText: 'manda user'}).isVisible()
  await page.locator('//button[normalize-space() = "Upgrade"]').isVisible()
})
