/**
 * NavigationFlow
 *
 * Flow liên quan menu navigation:
 *  - open menu
 *  - logout
 */

import { Page } from '@playwright/test';
import { InventoryPage } from '../../pages/inventoryPage';
import { MenuPage } from '../../pages/menuPage';

export class NavigationFlow {
  private inventoryPage: InventoryPage;
  private menuPage: MenuPage;

  constructor(page: Page) {
    this.inventoryPage = new InventoryPage(page);
    this.menuPage = new MenuPage(page);
  }

  async logout() {
    await this.inventoryPage.header.openMenu();
    await this.menuPage.logout();
  }
}
