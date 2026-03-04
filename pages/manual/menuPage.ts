/**
 * MenuPage
 *
 * Page đại diện sidebar menu (hamburger menu)
 *
 * Business:
 *  - Logout
 *  - Reset app state
 *  - About
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async logout() {
    await this.page.click('#logout_sidebar_link');
  }

  async resetApp() {
    await this.page.click('#reset_sidebar_link');
  }

  async openAbout() {
    await this.page.click('#about_sidebar_link');
  }
}
