/**
 * PurchaseFlow
 *
 * End-to-End business flow:
 *  Login → Add product → Checkout → Finish
 *
 * Đây là flow quan trọng nhất của project
 * Sau này AI sẽ map Acceptance Criteria vào đây
 */

import { Page } from '@playwright/test';
import { LoginFlow } from './login.flow';
import { InventoryPage } from '../../pages/inventoryPage';
import { CartPage } from '../../pages/cartPage';
import { CheckoutPage } from '../../pages/checkoutPage';

export class PurchaseFlow {
  private page: Page;
  private loginFlow: LoginFlow;
  private inventoryPage: InventoryPage;
  private cartPage: CartPage;
  private checkoutPage: CheckoutPage;

  constructor(page: Page) {
    this.page = page;

    this.loginFlow = new LoginFlow(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
  }

  async completePurchase() {
    await this.loginFlow.loginAsStandardUser();

    await this.inventoryPage.addProduct('Sauce Labs Backpack');
    await this.inventoryPage.goToCart();

    await this.cartPage.checkout();

    await this.checkoutPage.completeOrder(
      'John',
      'Doe',
      '10001'
    );
  }
}
