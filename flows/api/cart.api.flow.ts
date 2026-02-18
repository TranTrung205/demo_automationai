/**
 * ==================================
 * Cart API Flow
 * ==================================
 * Business flow for cart operations
 */

import { APIRequestContext } from '@playwright/test';
import { CartAPI } from '../../api/cart.api';

export class CartAPIFlow {

  private cartAPI: CartAPI;

  constructor(private request: APIRequestContext) {

    this.cartAPI = new CartAPI(request);

  }

  /**
   * Add item to cart
   */
  async addItem(
    token: string,
    productId: number
  ) {

    return await this.cartAPI.addItem(token, productId);

  }

}
