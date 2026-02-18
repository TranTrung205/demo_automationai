/**
 * CheckoutPage
 *
 * Page đại diện cho quy trình checkout
 *
 * Sử dụng:
 *  - CheckoutFormComponent
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';
import { CheckoutFormComponent } from '../components/checkoutForm.component';

export class CheckoutPage extends BasePage {
  form: CheckoutFormComponent;

  constructor(page: Page) {
    super(page);
    this.form = new CheckoutFormComponent(page);
  }

  async completeOrder(first: string, last: string, zip: string) {
    await this.form.fillInformation(first, last, zip);
    await this.form.continue();

    await this.page.click('#finish');
  }
}
