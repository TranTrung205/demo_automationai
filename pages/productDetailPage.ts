import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productName = this.page.locator('.inventory_details_name');
  addToCartBtn = this.page.locator('button[data-test^="add-to-cart"]');

  async verifyLoaded() {
    await expect(this.productName).toBeVisible();
  }

  async addToCart() {
    await this.click(this.addToCartBtn);
  }
}
