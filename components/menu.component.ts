/**
 * MenuComponent
 *
 * Component đại diện cho sidebar menu khi click burger button
 *
 * Bao gồm:
 *  - Logout
 *  - Reset App State
 *  - About
 *
 * Component này tách riêng để tái sử dụng ở nhiều page
 */

import { Page } from '@playwright/test';

export class MenuComponent {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async logout() {
        await this.page.click('#logout_sidebar_link');
    }
}
