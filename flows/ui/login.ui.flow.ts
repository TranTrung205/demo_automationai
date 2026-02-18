/**
 * ==================================
 * UI Login Flow
 * ==================================
 * Business flow xử lý login thông qua UI (SauceDemo).
 *
 * Flow Layer có nhiệm vụ:
 *  - Orchestrate hành động user
 *  - Gọi Page Object
 *  - Không chứa locator trực tiếp
 *
 * Architecture:
 *
 * Test → Flow → Page → Component → Locator
 *
 */

import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/loginpage';

export class LoginUIFlow {

  /**
   * Login với username + password
   *
   * @param page Playwright Page
   * @param username Username SauceDemo
   * @param password Password SauceDemo
   */
  static async login(page: Page, username: string, password: string) {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(username, password);

  }

  /**
   * Login bằng default user (standard_user)
   *
   * Dùng cho:
   *  - smoke test
   *  - quick login
   *  - fixture setup
   */
  static async loginAsStandardUser(page: Page) {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );

  }

  /**
   * Login thất bại (negative test)
   *
   * @param page Playwright Page
   * @param username Username sai
   * @param password Password sai
   */
  static async loginExpectFail(
    page: Page,
    username: string,
    password: string
  ) {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(username, password);

  }

}
