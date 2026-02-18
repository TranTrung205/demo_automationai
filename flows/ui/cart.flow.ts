/**
 * CartFlow
 *
 * Business flow liên quan giỏ hàng:
 *  - add product
 *  - open cart
 *  - verify item
 */

import { Page, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';

export class CartFlow {
  private inventoryPage: InventoryPage;
  private cartPage: CartPage;

  constructor(page: Page) {
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
  }

  async addProductToCart(productName: string) {
    await this.inventoryPage.addProduct(productName);
    await this.inventoryPage.goToCart();
  }

  async verifyProductInCart(productName: string) {
    await expect(
      this.cartPage.cartItems.item(productName)
    ).toBeVisible();
  }
}
