/**
 * Hybrid Assertions
 * -----------------
 * Validate both UI state and API state together.
 */

import { Page, expect } from '@playwright/test';

export class LoginHybridAssertions {

  static async verifyUserLoggedIn(page: Page) {

    await expect(page).toHaveURL(/inventory/);

    const token = await page.evaluate(() => localStorage.getItem('token'));

    expect(token).not.toBeNull();

  }

}
