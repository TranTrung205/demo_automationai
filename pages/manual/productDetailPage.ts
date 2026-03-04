/**
 * ProductDetailPage
 *
 * Page đại diện cho màn hình chi tiết sản phẩm
 *
 * Business:
 *  - Add to cart
 *  - Back to inventory
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addToCart() {
    await this.page.click('button:has-text("Add to cart")');
  }

  async back() {
    await this.page.click('#back-to-products');
  }
}
