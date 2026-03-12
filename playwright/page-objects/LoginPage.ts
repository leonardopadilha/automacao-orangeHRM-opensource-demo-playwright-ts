import { Locator, Page } from '@playwright/test';

export default class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password')
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('span[class*="error-message"]')
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async login(username?: string, password?: string) {
        if (!username || !password) {
            await this.clickLoginButton();
            return
        }
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    private async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    private async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    private async clickLoginButton() {
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.allTextContents();
    }
}