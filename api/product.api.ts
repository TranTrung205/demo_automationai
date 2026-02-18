/**
 * ==================================
 * PRODUCT API
 * ==================================
 * Handles all product-related API operations.
 *
 * Layer:
 * Flow → ProductAPI → BaseAPI → HTTP
 */

import { BaseAPI } from './baseAPI.api';

export class ProductAPI extends BaseAPI {

  /**
   * Get all products
   */
  async getAllProducts() {
    return this.get('/products');
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number) {
    return this.get(`/products/${id}`);
  }

  /**
   * Create new product
   */
  async createProduct(data: any) {
    return this.post('/products', data);
  }

  /**
   * Update product
   */
  async updateProduct(id: number, data: any) {
    return this.put(`/products/${id}`, data);
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number) {
    return this.delete(`/products/${id}`);
  }
}
