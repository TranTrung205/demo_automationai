/**
 * ==================================
 * AUTH API
 * ==================================
 */

import { BaseAPI } from './baseAPI.api';

export class AuthAPI extends BaseAPI {

  async login(
    username: string,
    password: string
  ) {

    return this.post('/auth/login', {
      username,
      password
    });

  }

}
