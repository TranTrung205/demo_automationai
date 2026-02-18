/**
 * UI Cart Flow
 * ------------
 * Handles cart operations via UI.
 */

import { Page } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';

export class CartUIFlow {

  /**
   * Add product to cart via UI
   */
  static async addItemToCart(page: Page, productName: string) {

    const inventory = new InventoryPage(page);

    await inventory.addItemToCart(productName);

  }

  /**
   * Navigate to cart page
   */
  static async openCart(page: Page) {

    const cart = new CartPage(page);

    await cart.goto();

  }

}
