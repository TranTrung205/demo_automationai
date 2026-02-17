import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  page: Page;
  title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
  }

  async verifyLoaded() {
    await expect(this.title).toHaveText('Products');
  }
}
