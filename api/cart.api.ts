/**
 * ==================================
 * CART API
 * ==================================
 * Handles cart related endpoints
 */

import { BaseAPI } from './baseAPI.api';

export class CartAPI extends BaseAPI {

  /**
   * Get all carts
   */
  async getAllCarts() {

    return this.get('/carts');

  }

  /**
   * Get cart by id
   */
  async getCartById(id: number) {

    return this.get(`/carts/${id}`);

  }

  /**
   * Create new cart
   */
  async createCart(data: any) {

    return this.post('/carts', data);

  }

  /**
   * Add item to cart (Hybrid usage)
   */
  async addItem(
    token: string,
    productId: number
  ) {

    const payload = {
      userId: 1,
      date: new Date().toISOString(),
      products: [
        {
          productId,
          quantity: 1
        }
      ]
    };

    return this.post('/carts', payload, token);

  }

  /**
   * Update cart
   */
  async updateCart(id: number, data: any) {

    return this.put(`/carts/${id}`, data);

  }

  /**
   * Delete cart
   */
  async deleteCart(id: number) {

    return this.delete(`/carts/${id}`);

  }

}
