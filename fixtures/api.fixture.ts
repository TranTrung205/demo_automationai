import { test as base } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';

import { AuthAPI } from '../api/auth.api';
import { ProductAPI } from '../api/product.api';
import { CartAPI } from '../api/cart.api';  

type APIFixtures = {
  apiContext: APIRequestContext;
  authAPI: AuthAPI;
  productAPI: ProductAPI;
  cartAPI: CartAPI;
};

export const apiTest = base.extend<APIFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: 'https://fakestoreapi.com',
    });

    await use(context);
    await context.dispose();
  },

  authAPI: async ({ apiContext }, use) => {
    await use(new AuthAPI(apiContext));
  },

  productAPI: async ({ apiContext }, use) => {
    await use(new ProductAPI(apiContext));
  },

  cartAPI: async ({ apiContext }, use) => {
    await use(new CartAPI(apiContext));
  },
});

export const expect = apiTest.expect;
