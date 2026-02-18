import { Page, Locator, expect } from '@playwright/test';

/**
 * HeaderComponent
 *
 * Đại diện thanh header trên website
 * Dùng lại cho nhiều page: inventory, cart, checkout
 */
export class HeaderComponent {
    readonly page: Page;

    readonly menuButton: Locator;
    readonly cartIcon: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;

        this.menuButton = page.locator('#react-burger-menu-btn');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async openCart() {
        await this.cartIcon.click();
    }

    async getCartCount(): Promise<number> {
        if (await this.cartBadge.isVisible()) {
            const text = await this.cartBadge.textContent();
            return Number(text);
        }
        return 0;
    }

    async expectCartCount(count: number) {
        await expect(this.cartBadge).toHaveText(String(count));
    }
}
