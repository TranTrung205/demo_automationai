/**
 * CheckoutFormComponent
 *
 * Component đại diện cho form nhập thông tin checkout:
 *  - First name
 *  - Last name
 *  - Zip code
 *
 * Tách component giúp tái sử dụng và code sạch hơn
 */

import { Page } from '@playwright/test';

export class CheckoutFormComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillInformation(first: string, last: string, zip: string) {
    await this.page.fill('#first-name', first);
    await this.page.fill('#last-name', last);
    await this.page.fill('#postal-code', zip);
  }

  async continue() {
    await this.page.click('#continue');
  }
}
