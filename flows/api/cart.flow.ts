import { APIRequestContext } from '@playwright/test';
import { CartAPI } from '../../api/cart.api';

export class CartFlow {
  private cartApi: CartAPI;

  constructor(request: APIRequestContext) {
    this.cartApi = new CartAPI(request);
  }

  async createSimpleCart(productId: number) {
    return await this.cartApi.createCart({
      userId: 1,
      products: [
        {
          productId,
          quantity: 1,
        },
      ],
    });
  }
}
