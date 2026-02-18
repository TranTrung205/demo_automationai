/**
 * ==================================
 * Purchase API Flow
 * ==================================
 * Business flow for checkout operations.
 */

import { APIRequestContext } from '@playwright/test';
import { PurchaseAPI, CheckoutPayload } from '../../api/purchase.api';

export class PurchaseAPIFlow {

  private purchaseAPI: PurchaseAPI;

  constructor(private request: APIRequestContext) {
    this.purchaseAPI = new PurchaseAPI(request);
  }

  /**
   * ==================================
   * Complete purchase via API
   * ==================================
   */
  async checkout(productId: number) {

    const payload: CheckoutPayload = {
      userId: 1,
      date: new Date().toISOString(),
      products: [
        {
          productId,
          quantity: 1
        }
      ]
    };

    const response = await this.purchaseAPI.checkout(payload);

    return await response.json();
  }

}
