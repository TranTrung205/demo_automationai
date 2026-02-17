/**
 * USER API
 *
 * File này xử lý các API liên quan đến user.
 */

import { BaseAPI } from './baseAPI';

export class UserAPI extends BaseAPI {

  // Lấy tất cả users
  async getAllUsers() {
    return this.get('/users');
  }

  // Lấy user theo id
  async getUserById(id: number) {
    return this.get(`/users/${id}`);
  }

  // Tạo user
  async createUser(data: any) {
    return this.post('/users', data);
  }

  // Update user
  async updateUser(id: number, data: any) {
    return this.put(`/users/${id}`, data);
  }

  // Delete user
  async deleteUser(id: number) {
    return this.delete(`/users/${id}`);
  }
}
