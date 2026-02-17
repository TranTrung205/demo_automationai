import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartItem = this.page.locator('.cart_item');
  checkoutBtn = this.page.locator('#checkout');

  async verifyItemInCart() {
    await expect(this.cartItem).toBeVisible();
  }

  async checkout() {
    await this.click(this.checkoutBtn);
  }
}
