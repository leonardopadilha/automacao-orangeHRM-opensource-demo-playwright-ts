import { test, expect } from '@playwright/test';
import LoginPage from '../page-objects/LoginPage';

let loginPage: LoginPage;

const LOGIN_URL = '/web/index.php/auth/login'

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);

  await loginPage.navigateTo(LOGIN_URL);
})

test('Verificar título da página', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/OrangeHRM/);
});

test('Validar mensagem de erro ao realizar login com credenciais em branco', async ({ page }) => {
  await loginPage.login();

  const errorMessages = await loginPage.getErrorMessage()
  expect(errorMessages).toHaveLength(2)
  expect(errorMessages).toEqual(['Required', 'Required'])
});

test('Validar mensagem de erro ao realizar login com usuário inválido', async ({ page }) => {
  await loginPage.login('invalid_username', 'admin123')
  expect(await loginPage.getInvalidCredentials()).toEqual('Invalid credentials')
})

test('Validar mensagem de erro ao realizar login com senha inválida', async ({ page }) => {
  await loginPage.login('Admin', 'admin1234')
  expect(await loginPage.getInvalidCredentials()).toEqual('Invalid credentials')
})

test('Realizar login com credenciais válidas', async ({ page }) => {
  await loginPage.login('Admin', 'admin123')

  // Valida redirecionamento para o dashboard após login
  await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/)
  // Valida que o dashboard está visível (elemento típico da área logada)
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible()

  await page.getByRole('paragraph').filter({ hasText: 'manda user'}).isVisible()
  await page.locator('//button[normalize-space() = "Upgrade"]').isVisible()
})
