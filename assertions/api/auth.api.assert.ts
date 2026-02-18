/**
 * API Assertions for Authentication
 * ---------------------------------
 * Contains response validations for auth endpoints.
 */

import { expect, APIResponse } from '@playwright/test';

export class AuthAPIAssertions {

  /**
   * Verify login response success
   */
  static async verifyLoginSuccess(response: APIResponse) {

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toHaveProperty('token');
  }

  /**
   * Verify login failure
   */
  static async verifyLoginFailed(response: APIResponse) {

    expect(response.status()).toBe(401);

  }

}
