/**
 * Auth API Flow
 * -------------
 * Handles authentication business logic via API.
 */

import { AuthAPI } from '../../api/auth.api';

export class AuthAPIFlow {

  /**
   * Login via API and return token/session
   */
  static async login(username: string, password: string) {

    const token = await AuthAPI.login(username, password);

    return token;

  }

}
