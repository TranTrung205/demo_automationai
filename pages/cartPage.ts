/**
 * ==================================
 * CartPage
 * ==================================
 * Page Object đại diện cho Cart của SauceDemo
 *
 * Sử dụng Component:
 *  - HeaderComponent
 *  - CartItemComponent
 *
 * Architecture:
 *   Flow → Page → Component → Locator
 *
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

  /**
   * Navigate tới cart bằng header icon
   */
  async goto() {

    await this.header.openCart();

  }

  /**
   * Click checkout button
   */
  async checkout() {

    await this.page.click('#checkout');

  }

  /**
   * Remove item khỏi cart theo tên
   */
  async removeItem(productName: string) {

   // await this.cartItems.removeItem(productName);

  }

  /**
   * Verify item tồn tại trong cart
   */
  async hasItem(productName: string) {

    //return await this.cartItems.hasItem(productName);

  }

}
