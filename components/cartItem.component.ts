/**
 * CartItemComponent
 *
 * Component đại diện cho từng item trong Cart
 *
 * Có thể:
 *  - Remove product
 *  - Verify product tồn tại trong cart
 */

import { Page } from '@playwright/test';

export class CartItemComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  item(name: string) {
    return this.page.locator('.cart_item').filter({
      hasText: name
    });
  }

  async remove(name: string) {
    await this.item(name)
      .getByRole('button', { name: /remove/i })
      .click();
  }
}
