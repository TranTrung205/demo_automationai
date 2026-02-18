/**
 * LoginFlow
 *
 * Business flow liên quan authentication:
 *  - login success
 *  - logout
 *
 * Flow này wrap Page Object để test và AI dùng dễ hơn
 */

import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { InventoryPage } from '../../pages/inventoryPage';

export class LoginFlow {
  private page: Page;
  private loginPage: LoginPage;
  private inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  async login(username: string, password: string) {
    await this.loginPage.navigate('/');
    await this.loginPage.login(username, password);
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }
}
