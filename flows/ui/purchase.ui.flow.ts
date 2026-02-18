/**
 * Purchase UI Flow
 * ----------------
 * Handles checkout process via UI.
 */

import { Page } from '@playwright/test';
import { CheckoutPage } from '../../pages/checkout.page';

export class PurchaseUIFlow {

  /**
   * Complete checkout via UI
   */
  static async checkout(
    page: Page,
    firstName: string,
    lastName: string,
    postalCode: string
  ) {

    const checkout = new CheckoutPage(page);

    await checkout.fillInformation(firstName, lastName, postalCode);

    await checkout.finish();

  }

}
