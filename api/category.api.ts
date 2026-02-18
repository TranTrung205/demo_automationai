/**
 * CATEGORY API
 *
 * File này xử lý các API liên quan đến categories.
 */

import { BaseAPI } from './baseAPI.api';

export class CategoryAPI extends BaseAPI {

  // Lấy tất cả categories
  async getAllCategories() {
    return this.get('/products/categories');
  }

  // Lấy sản phẩm theo category
  async getProductsByCategory(category: string) {
    return this.get(`/products/category/${category}`);
  }
}
