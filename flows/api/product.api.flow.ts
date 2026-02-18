/**
 * ==================================
 * Product API Flow
 * ==================================
 * Business flow for product operations.
 */

import { APIRequestContext } from '@playwright/test';
import { ProductAPI } from '../../api/product.api';

export class ProductAPIFlow {

  private productAPI: ProductAPI;

  constructor(private request: APIRequestContext) {
    this.productAPI = new ProductAPI(request);
  }

  /**
   * Get product list
   */
  async getProducts() {

    const response = await this.productAPI.getAllProducts();

    const data = await response.json();

    return data;
  }

  /**
   * Get product by ID
   */
  async getProduct(productId: number) {

    const response = await this.productAPI.getProductById(productId);

    return await response.json();
  }

}
