/**
 * Hybrid Purchase Flow
 * --------------------
 * Combines API setup with UI checkout.
 *
 * Example:
 * - Create cart via API
 * - Continue purchase via UI
 */

import { Page } from '@playwright/test';
import { AuthAPIFlow } from '../api/auth.api.flow';
import { CartAPIFlow } from '../api/cart.api.flow';
import { PurchaseUIFlow } from '../ui/purchase.ui.flow';

export class PurchaseHybridFlow {

  /**
   * Prepare cart via API then complete via UI
   */
  static async purchase(
    page: Page,
    username: string,
    password: string,
    productId: string,
    checkoutInfo: {
      firstName: string;
      lastName: string;
      postalCode: string;
    }
  ) {

    // Login API
    const token = await AuthAPIFlow.login(username, password);

    // Add product via API
    await CartAPIFlow.addItem(token, productId);

    // Inject session into UI
    await page.addInitScript(value => {

      window.localStorage.setItem('token', value);

    }, token);

    // Navigate to checkout
    await page.goto('/checkout');

    // Complete via UI
    await PurchaseUIFlow.checkout(
      page,
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );

  }

}
