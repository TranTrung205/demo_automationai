/**
 * AUTH API
 *
 * File này xử lý các API liên quan đến authentication.
 */

import { BaseAPI } from './baseAPI';

export class AuthAPI extends BaseAPI {

  /**
   * Login user
   */
  async login(username: string, password: string) {
    return this.post('/auth/login', {
      username,
      password,
    });
  }
}
