/**
 * ==================================
 * Auth API Flow
 * ==================================
 */

import { APIRequestContext } from '@playwright/test';
import { AuthAPI } from '../../api/auth.api';

export class AuthAPIFlow {

  private authAPI: AuthAPI;

  constructor(private request: APIRequestContext) {

    this.authAPI = new AuthAPI(request);

  }

  /**
   * Login and return token
   */
  async login(
    username: string,
    password: string
  ) {

    const res = await this.authAPI.login(username, password);

    const data = await res.json();

    return data.token;

  }

}
