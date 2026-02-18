/**
 * Product API Flow
 * ----------------
 * Handles product retrieval via API.
 */

import { ProductAPI } from '../../api/product.api';

export class ProductAPIFlow {

  /**
   * Get product list
   */
  static async getProducts(token: string) {

    return await ProductAPI.getProducts(token);

  }

}
