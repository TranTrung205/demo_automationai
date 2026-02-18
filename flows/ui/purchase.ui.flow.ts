import { Page } from '@playwright/test';
import { InventoryPage } from '../../pages/inventorypage';
import { CartPage } from '../../pages/cartpage';
import { CheckoutPage } from '../../pages/checkoutPage';

export class PurchaseUIFlow {

  static async completePurchase(
    page: Page,
    productName: string,
    first: string,
    last: string,
    zip: string
  ) {

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addItemToCart(productName);

    await cart.goto();

    await cart.checkout();

    // Page đã handle full logic
    await checkout.completeOrder(first, last, zip);

  }

}
