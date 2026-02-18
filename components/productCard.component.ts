import { Locator, expect } from '@playwright/test';

/**
 * ProductCardComponent
 *
 * Đại diện 1 product trong inventory page
 * Root locator được truyền từ page
 */
export class ProductCardComponent {
    readonly root: Locator;

    readonly name: Locator;
    readonly price: Locator;
    readonly addToCartBtn: Locator;
    readonly image: Locator;

    constructor(root: Locator) {
        this.root = root;

        this.name = root.locator('.inventory_item_name');
        this.price = root.locator('.inventory_item_price');
        this.addToCartBtn = root.locator('button');
        this.image = root.locator('img');
    }

    async getName(): Promise<string | null> {
        return await this.name.textContent();
    }

    async getPrice(): Promise<string | null> {
        return await this.price.textContent();
    }

    async addToCart() {
        await this.addToCartBtn.click();
    }

    async openDetail() {
        await this.name.click();
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }
}
