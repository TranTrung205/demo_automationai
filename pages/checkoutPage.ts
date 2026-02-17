import { Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  firstName = this.page.locator('#first-name');
  lastName = this.page.locator('#last-name');
  postalCode = this.page.locator('#postal-code');

  continueBtn = this.page.locator('#continue');
  finishBtn = this.page.locator('#finish');

  successMsg = this.page.locator('.complete-header');

  async fillInformation(fn: string, ln: string, zip: string) {
    await this.fill(this.firstName, fn);
    await this.fill(this.lastName, ln);
    await this.fill(this.postalCode, zip);
    await this.click(this.continueBtn);
  }

  async finishOrder() {
    await this.click(this.finishBtn);
  }

  async verifySuccess() {
    await expect(this.successMsg).toHaveText('Thank you for your order!');
  }
}
