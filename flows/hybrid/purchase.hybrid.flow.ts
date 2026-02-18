/**
 * ==================================
 * Hybrid Purchase Flow
 * ==================================
 */

import { Page, APIRequestContext } from '@playwright/test';
import { AuthAPIFlow } from '../api/auth.api.flow';
import { CartAPIFlow } from '../api/cart.api.flow';
import { PurchaseUIFlow } from '../ui/purchase.ui.flow';

export class PurchaseHybridFlow {

  private authAPI: AuthAPIFlow;
  private cartAPI: CartAPIFlow;

  constructor(
    private page: Page,
    private request: APIRequestContext
  ) {

    this.authAPI = new AuthAPIFlow(request);
    this.cartAPI = new CartAPIFlow(request);

  }

  /**
   * Hybrid purchase
   */
  async purchase(
    username: string,
    password: string,
    productId: number,
    checkoutInfo: {
      firstName: string;
      lastName: string;
      postalCode: string;
    }
  ) {

    // Login API
    const token = await this.authAPI.login(username, password);

    // Prepare cart API
    await this.cartAPI.addItem(token, productId);

    // Inject session
    await this.page.addInitScript(value => {

      window.localStorage.setItem('token', value);

    }, token);

    await this.page.goto('https://www.saucedemo.com/inventory.html');

    // Continue UI
    await PurchaseUIFlow.completePurchase(
      this.page,
      'Sauce Labs Backpack',
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

  }

}
