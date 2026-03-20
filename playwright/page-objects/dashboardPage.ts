import { Locator, Page } from '@playwright/test';

export default class DashboardPage {
    private readonly page: Page
    private readonly userName: Locator

    constructor(page: Page) {
        this.page = page
        this.userName = page.locator('.oxd-userdropdown-tab .oxd-userdropdown-name')
    }

    async userIsLogged() {
        return this.userName.textContent()
    }
}