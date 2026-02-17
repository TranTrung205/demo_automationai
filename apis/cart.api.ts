/**
 * CART API
 *
 * File này xử lý các API liên quan đến giỏ hàng.
 */

import { BaseAPI } from './baseAPI';

export class CartAPI extends BaseAPI {

  // Lấy tất cả cart
  async getAllCarts() {
    return this.get('/carts');
  }

  // Lấy cart theo id
  async getCartById(id: number) {
    return this.get(`/carts/${id}`);
  }

  // Tạo cart mới
  async createCart(data: any) {
    return this.post('/carts', data);
  }

  // Update cart
  async updateCart(id: number, data: any) {
    return this.put(`/carts/${id}`, data);
  }

  // Delete cart
  async deleteCart(id: number) {
    return this.delete(`/carts/${id}`);
  }
}
