/**
 * LoginPage
 *
 * Page đại diện cho màn hình login
 *
 * Business chính:
 *  - Login user
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }
}
