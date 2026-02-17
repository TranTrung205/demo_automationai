import { BasePage } from './basePage';
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  username: Locator;
  password: Locator;
  loginBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('#login-button');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
