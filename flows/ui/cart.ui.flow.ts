/**
 * ==================================
 * UI Cart Flow
 * ==================================
 * Business flow xử lý các thao tác Cart thông qua UI (SauceDemo).
 *
 * Flow Layer có nhiệm vụ:
 *  - Orchestrate hành động người dùng
 *  - Gọi Page Object
 *  - Không chứa locator trực tiếp
 *
 * Architecture:
 *
 * Test → Flow → Page → Component → Locator
 *
 */

import { Page } from '@playwright/test';
import { InventoryPage } from '../../pages/inventorypage';
import { CartPage } from '../../pages/cartpage';

export class CartUIFlow {

  /**
   * Add product vào cart từ trang Inventory
   *
   * @param page Playwright Page
   * @param productName Tên sản phẩm (vd: "Sauce Labs Backpack")
   */
  static async addItemToCart(page: Page, productName: string) {

    const inventoryPage = new InventoryPage(page);

    // Add item theo tên sản phẩm
    await inventoryPage.addItemToCart(productName);

  }

  /**
   * Mở trang Cart từ header icon
   *
   * @param page Playwright Page
   */
  static async openCart(page: Page) {

    const cartPage = new CartPage(page);

    // Navigate tới cart
    await cartPage.goto();

  }

  /**
   * Add item rồi mở Cart (flow hoàn chỉnh)
   *
   * @param page Playwright Page
   * @param productName Tên sản phẩm
   */
  static async addItemAndOpenCart(page: Page, productName: string) {

    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addItemToCart(productName);

    await cartPage.goto();

  }

}
