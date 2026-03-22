import { test as base, expect } from '@playwright/test';
import LoginPage from '../support/pages/LoginPage';
import DashboardPage from '../support/pages/dashboardPage'

const test = base.extend<{ 
    loginPage: LoginPage,
    dashboardPage: DashboardPage
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page)
        await loginPage.navigateTo('/web/index.php/auth/login')
        await use(loginPage)
    },
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page)
        await use(dashboardPage)
    }
})

export { test, expect}