/**
 * Navigation UI Flow
 * ------------------
 * Handles navigation between pages.
 */

import { Page } from '@playwright/test';

export class NavigationUIFlow {

  /**
   * Navigate to a given URL
   */
  static async navigate(page: Page, url: string) {

    await page.goto(url);

  }

}
