import { test as base } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';

import { AuthAPI } from '../api/services/auth.api';
import { ProductAPI } from '../api/services/product.api';
import { CartAPI } from '../api/services/cart.api';

/**
 * =========================
 * API Fixture Layer
 * =========================
 * Purpose:
 * - Provide initialized API services
 * - Shared APIRequestContext
 * - Used by API tests & hybrid flows
 */

type APIFixtures = {
  apiContext: APIRequestContext;
  authAPI: AuthAPI;
  productAPI: ProductAPI;
  cartAPI: CartAPI;
};

export const apiTest = base.extend<APIFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://fakestoreapi.com',
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
