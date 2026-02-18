/**
 * Hybrid Login Flow
 * -----------------
 * Combines API authentication with UI session.
 *
 * Strategy:
 * 1. Login via API
 * 2. Inject token into browser storage
 * 3. Navigate directly to secured page
 *
 * Benefits:
 * - Faster execution
 * - Stable CI
 * - Enterprise best practice
 */

import { Page } from '@playwright/test';
import { AuthAPIFlow } from '../api/auth.api.flow';

export class LoginHybridFlow {

  /**
   * Login using API and continue in UI
   */
  static async login(
    page: Page,
    username: string,
    password: string
  ) {

    const token = await AuthAPIFlow.login(username, password);

    await page.addInitScript(value => {

      window.localStorage.setItem('token', value);

    }, token);

    await page.goto('/inventory');

  }

}
