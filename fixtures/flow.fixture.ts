/**
 * Flow Fixture
 *
 * Fixture này inject Business Flow vào test:
 *  - LoginFlow
 *  - PurchaseFlow
 *
 * Test chỉ cần gọi:
 *   test('...', async ({ flows }) => {})
 */

import { test as base } from '@playwright/test';
import { PurchaseFlow } from '../../src/flows/ui/purchase.flow';
import { LoginFlow } from '../../src/flows/ui/login.flow';

type FlowFixture = {
  flows: {
    login: LoginFlow;
    purchase: PurchaseFlow;
  };
};

export const test = base.extend<FlowFixture>({
  flows: async ({ page }, use) => {

    const flows = {
      login: new LoginFlow(page),
      purchase: new PurchaseFlow(page),
    };

    await use(flows);
  },
});

export { expect } from '@playwright/test';
