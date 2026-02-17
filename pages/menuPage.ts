import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class MenuPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  menuBtn = this.page.locator('#react-burger-menu-btn');
  logoutLink = this.page.locator('#logout_sidebar_link');

  async openMenu() {
    await this.click(this.menuBtn);
  }

  async logout() {
    await this.click(this.logoutLink);
  }
}
