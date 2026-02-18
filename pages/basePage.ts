/**
 * BasePage
 *
 * Page cha của tất cả các Page khác
 *
 * Chứa các function dùng chung:
 *  - navigate
 *  - get title
 *
 * Giúp tránh duplicate code giữa các page
 */

import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }
}
