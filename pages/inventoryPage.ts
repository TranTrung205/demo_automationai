/**
 * InventoryPage
 *
 * Page đại diện cho danh sách sản phẩm sau khi login
 *
 * Sử dụng:
 *  - HeaderComponent
 *  - InventoryItemComponent
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventoryItem.component';

export class InventoryPage extends BasePage {
  header: HeaderComponent;
  items: InventoryItemComponent;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(page);
    this.items = new InventoryItemComponent(page);
  }

  async addProduct(name: string) {
    await this.items.addToCart(name);
  }

  async goToCart() {
    await this.header.openCart();
  }
}
