/**
 * PurchaseApiFlow
 *
 * Business:
 * Login → Product → Cart
 */

import { APIRequestContext } from '@playwright/test';
import { AuthFlow } from './auth.flow';
import { ProductFlow } from './product.flow';
import { CartFlow } from './cart.flow';

export class PurchaseApiFlow {
  private authFlow: AuthFlow;
  private productFlow: ProductFlow;
  private cartFlow: CartFlow;

  constructor(private request: APIRequestContext) {
    this.authFlow = new AuthFlow(request);
    this.productFlow = new ProductFlow(request);
    this.cartFlow = new CartFlow(request);
  }

  async completePurchase() {
    const token = await this.authFlow.loginAsDefaultUser();

    const product = await this.productFlow.getFirstProduct();

    const cart = await this.cartFlow.createSimpleCart(product.id);

    return {
      token,
      product,
      cart,
    };
  }
}
