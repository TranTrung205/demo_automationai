/**
 * UI Assertions for Inventory Page
 * --------------------------------
 * Contains validations related to UI state and elements.
 */

import { expect, Page } from '@playwright/test';

export class InventoryUIAssertions {

  /**
   * Verify user is on inventory page
   */
  static async verifyPageLoaded(page: Page) {
    await expect(page).toHaveURL(/inventory/);
  }

  /**
   * Verify item visible on UI
   */
  static async verifyItemVisible(page: Page, itemName: string) {
    await expect(
      page.locator('.inventory_item_name', { hasText: itemName })
    ).toBeVisible();
  }

}
