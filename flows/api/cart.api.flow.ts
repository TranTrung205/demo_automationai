/**
 * Cart API Flow
 * -------------
 * Handles cart operations via API.
 */

import { CartAPI } from '../../api/cart.api';

export class CartAPIFlow {

  /**
   * Add item to cart via API
   */
  static async addItem(token: string, productId: string) {

    return await CartAPI.addItem(token, productId);

  }

}
