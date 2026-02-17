import { Page, expect } from '@playwright/test';

/**
 * BasePage
 * Class cha dùng chung cho tất cả page
 * Chứa các hàm common như:
 * - open url
 * - wait element
 * - verify text
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async waitForVisible(locator: any) {
    await expect(locator).toBeVisible();
  }

  async click(locator: any) {
    await locator.click();
  }

  async fill(locator: any, text: string) {
    await locator.fill(text);
  }
}
