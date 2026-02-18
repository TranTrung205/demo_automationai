/**
 * CartPage
 *
 * Page đại diện cho giỏ hàng
 *
 * Sử dụng:
 *  - HeaderComponent
 *  - CartItemComponent
 */

import { BasePage } from './basePage';
import { Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { CartItemComponent } from '../components/cartItem.component';

export class CartPage extends BasePage {
  header: HeaderComponent;
  cartItems: CartItemComponent;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(page);
    this.cartItems = new CartItemComponent(page);
  }

  async checkout() {
    await this.page.click('#checkout');
  }
}
