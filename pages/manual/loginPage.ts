/**
 * ==================================
 * LoginPage
 * ==================================
 * Page Object đại diện cho màn hình Login của SauceDemo
 *
 * Business chính:
 *  - Navigate tới trang login
 *  - Login user
 *
 * Layer:
 *   Flow → Page → Locator
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate tới trang login SauceDemo
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Thực hiện login
   *
   * @param username
   * @param password
   */
  async login(username: string, password: string) {

    await this.page.fill('#user-name', username);

    await this.page.fill('#password', password);

    await this.page.click('#login-button');

  }

}
