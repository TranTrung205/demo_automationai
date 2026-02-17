import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    username = this.page.locator('#user-name');
    password = this.page.locator('#password');
    loginBtn = this.page.locator('#login-button');
    errorMsg = this.page.locator('[data-test="error"]');

    async goto() {
        await this.open('/');
    }

    async login(user: string, pass: string) {
        await this.fill(this.username, user);
        await this.fill(this.password, pass);
        await this.click(this.loginBtn);
    }

    async verifyLoginError() {
        await expect(this.errorMsg).toBeVisible();
    }
}
