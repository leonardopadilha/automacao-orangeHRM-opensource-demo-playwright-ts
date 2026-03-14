import { test, expect } from '@playwright/test';

test('Verificar título da página', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/OrangeHRM/);
});

test('Validar mensagem de erro ao realizar login com credenciais em branco', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.getByRole('button', { name: 'Login' }).click()

  const errorMessages = await page.locator('span[class*="error-message"]').allTextContents()
  expect(errorMessages).toHaveLength(2)
  expect(errorMessages).toEqual(['Required', 'Required'])
});

test('Validar mensagem de erro ao realizar login com usuário inválido', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('invalid_username')
  await page.getByPlaceholder('Password').fill('admin123')

  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByText('Invalid credentials')).toBeVisible()
})

test('Validar mensagem de erro ao realizar login com senha inválida', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin')
  await page.getByPlaceholder('Password').fill('admin1234')

  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByText('Invalid credentials')).toBeVisible()
})

test('Realizar login com credenciais válidas e validar sucesso', async ({ page }) => {
  await page.goto('/web/index.php/auth/login')

  await page.getByPlaceholder('Username').fill('Admin')
  await page.getByPlaceholder('Password').fill('admin123')

  await page.getByRole('button', { name: 'Login' }).click()

  // Valida redirecionamento para o dashboard após login
  await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index/)
  // Valida que o dashboard está visível (elemento típico da área logada)
  await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible()

  await page.getByRole('paragraph').filter({ hasText: 'manda user'}).isVisible()
  await page.locator('//button[normalize-space() = "Upgrade"]').isVisible()
})
