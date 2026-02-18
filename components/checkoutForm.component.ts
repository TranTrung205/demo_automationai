import { Page, Locator } from '@playwright/test';

/**
 * CheckoutFormComponent
 *
 * Đại diện form nhập thông tin checkout
 */
export class CheckoutFormComponent {
    readonly page: Page;

    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstNameInput = page.locator('#first-name');
        this.lastNameInput = page.locator('#last-name');
        this.zipCodeInput = page.locator('#postal-code');
        this.continueBtn = page.locator('#continue');
    }

    async fillForm(first: string, last: string, zip: string) {
        await this.firstNameInput.fill(first);
        await this.lastNameInput.fill(last);
        await this.zipCodeInput.fill(zip);
    }

    async continue() {
        await this.continueBtn.click();
    }
}
