/**
 * UI Login Flow
 * -------------
 * Handles user login via UI.
 *
 * Responsibilities:
 * - Orchestrate login steps
 * - Hide page object complexity
 * - Reusable across tests
 */

import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

export class LoginUIFlow {

  /**
   * Perform login using UI
   */
  static async login(
    page: Page,
    username: string,
    password: string
  ) {

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(username, password);

  }

}
