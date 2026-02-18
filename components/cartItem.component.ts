import { Locator, expect } from '@playwright/test';

/**
 * CartItemComponent
 *
 * Đại diện 1 item trong giỏ hàng
 */
export class CartItemComponent {
    readonly root: Locator;

    readonly name: Locator;
    readonly price: Locator;
    readonly removeBtn: Locator;

    constructor(root: Locator) {
        this.root = root;

        this.name = root.locator('.inventory_item_name');
        this.price = root.locator('.inventory_item_price');
        this.removeBtn = root.locator('button');
    }

    async getName(): Promise<string | null> {
        return await this.name.textContent();
    }

    async getPrice(): Promise<string | null> {
        return await this.price.textContent();
    }

    async remove() {
        await this.removeBtn.click();
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }
}
