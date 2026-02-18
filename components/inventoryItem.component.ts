/**
 * InventoryItemComponent
 *
 * Component đại diện cho từng product item trong danh sách Inventory
 *
 * Có thể:
 *  - Add to cart
 *  - Open product detail
 *
 * Component này giúp tránh duplicate locator khi test nhiều sản phẩm
 */

import { Page } from '@playwright/test';

export class InventoryItemComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  item(name: string) {
    return this.page.locator('.inventory_item').filter({
      hasText: name
    });
  }

  async addToCart(name: string) {
    await this.item(name)
      .getByRole('button', { name: /add to cart/i })
      .click();
  }

  async openDetail(name: string) {
    await this.item(name)
      .getByRole('link')
      .click();
  }
}
