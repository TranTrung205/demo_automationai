/**
 * API Fixture
 *
 * Tạo:
 *  - API request context
 *  - API flows
 */

import { test as base, request, APIRequestContext } from '@playwright/test';
import { PurchaseApiFlow } from '../flows/api/purchase.flow';
type ApiFixtures = {
  apiContext: APIRequestContext;
  purchaseApiFlow: PurchaseApiFlow;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://fakestoreapi.com',
    });

    await use(apiContext);
  },

  purchaseApiFlow: async ({ apiContext }, use) => {
    const flow = new PurchaseApiFlow(apiContext);
    await use(flow);
  },
});

export { expect } from '@playwright/test';
