/**
 * ==================================
 * PURCHASE API
 * ==================================
 * Handles purchase / checkout related API operations.
 *
 * Layer:
 * Flow → PurchaseAPI → BaseAPI → HTTP
 */

import { BaseAPI } from './baseAPI.api';

export interface CheckoutPayload {
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
  }[];
}

export class PurchaseAPI extends BaseAPI {

  /**
   * ==================================
   * Checkout / Create order
   * ==================================
   * FakeStore uses POST /carts as checkout simulation
   */
  async checkout(payload: CheckoutPayload) {

    return this.post('/carts', payload);

  }

}
