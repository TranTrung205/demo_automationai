import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  title = this.page.locator('.title');
  cartIcon = this.page.locator('.shopping_cart_link');
  productItem = this.page.locator('.inventory_item');
  sortDropdown = this.page.locator('[data-test="product_sort_container"]');

  async verifyPageLoaded() {
    await expect(this.title).toHaveText('Products');
  }

  async addFirstItemToCart() {
    await this.page.locator('.inventory_item button').first().click();
  }

  async openCart() {
    await this.click(this.cartIcon);
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async openFirstProductDetail() {
    await this.page.locator('.inventory_item_name').first().click();
  }
}
