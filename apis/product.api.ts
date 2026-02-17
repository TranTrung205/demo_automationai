/**
 * PRODUCT API
 *
 * File này xử lý các API liên quan đến sản phẩm.
 */

import { BaseAPI } from './baseAPI';

export class ProductAPI extends BaseAPI {

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    return this.get('/products');
  }

  // Lấy sản phẩm theo id
  async getProductById(id: number) {
    return this.get(`/products/${id}`);
  }

  // Tạo sản phẩm mới
  async createProduct(data: any) {
    return this.post('/products', data);
  }

  // Update sản phẩm
  async updateProduct(id: number, data: any) {
    return this.put(`/products/${id}`, data);
  }

  // Delete sản phẩm
  async deleteProduct(id: number) {
    return this.delete(`/products/${id}`);
  }
}
