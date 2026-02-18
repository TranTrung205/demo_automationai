/**
 * HeaderComponent
 *
 * Component này đại diện cho phần HEADER chung của hệ thống
 * Bao gồm:
 *  - Icon giỏ hàng
 *  - Menu button
 *
 * Component dùng để tái sử dụng ở nhiều Page:
 *  Inventory
 *  Cart
 *  Checkout
 *
 * 👉 Đây là Component Object Pattern (Modern Playwright)
 */

import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
    readonly page: Page;
    readonly cartIcon: Locator;
    readonly menuButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // locator icon giỏ hàng
        this.cartIcon = page.locator('.shopping_cart_link');

        // locator menu button
        this.menuButton = page.locator('#react-burger-menu-btn');
    }

    async openCart() {
        await this.cartIcon.click();
    }

    async openMenu() {
        await this.menuButton.click();
    }
}
