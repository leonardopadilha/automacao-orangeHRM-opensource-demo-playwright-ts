import { Locator, Page } from '@playwright/test';

export default class DashboardPage {
    private readonly page: Page
    private readonly userName: Locator
    private readonly menuOption: Locator
    private readonly userTitle: Locator

    constructor(page: Page) {
        this.page = page
        this.userName = page.locator('.oxd-userdropdown-tab .oxd-userdropdown-name')
        this.menuOption = page.locator('span')
        this.userTitle = page.locator('span[class*="topbar-header"]')

    }

    async navigateTo(url: string) {
        await this.page.goto(url)
    }

    async userIsLogged() {
        return this.userName.textContent()
    }

    async accessMenuOption(option: string) {
        await this.menuOption.filter({ hasText: option }).click()
    }

    async menuSelected() {
        return await this.userTitle.textContent()
    }
}