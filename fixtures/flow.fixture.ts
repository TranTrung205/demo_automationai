import { test as base } from '@playwright/test';

/**
 * UI FLOWS
 */
import { LoginUIFlow } from '../flows/ui/login.ui.flow';
import { CartUIFlow } from '../flows/ui/cart.ui.flow';
import { NavigationUIFlow } from '../flows/ui/navigation.ui.flow';
import { PurchaseUIFlow } from '../flows/ui/purchase.ui.flow';

/**
 * API FLOWS
 */
import { AuthAPIFlow } from '../flows/api/auth.api.flow';
import { CartAPIFlow } from '../flows/api/cart.api.flow';
import { ProductAPIFlow } from '../flows/api/product.api.flow';
import { PurchaseAPIFlow } from '../flows/api/purchase.api.flow';

/**
 * HYBRID FLOWS
 */
import { LoginHybridFlow } from '../flows/hybrid/login.hybrid.flow';
import { PurchaseHybridFlow } from '../flows/hybrid/purchase.hybrid.flow';

/**
 * =========================
 * Flow Fixture Layer
 * =========================
 * Purpose:
 * - Provide ready-to-use business flows
 * - Used by E2E tests
 * - AI generation entry point
 */

type FlowFixtures = {
  loginUIFlow: LoginUIFlow;
  cartUIFlow: CartUIFlow;
  navigationUIFlow: NavigationUIFlow;
  purchaseUIFlow: PurchaseUIFlow;

  authAPIFlow: AuthAPIFlow;
  cartAPIFlow: CartAPIFlow;
  productAPIFlow: ProductAPIFlow;
  purchaseAPIFlow: PurchaseAPIFlow;

  loginHybridFlow: LoginHybridFlow;
  purchaseHybridFlow: PurchaseHybridFlow;
};

export const flowTest = base.extend<FlowFixtures>({
  /**
   * =========================
   * UI FLOWS
   * =========================
   */
  loginUIFlow: async ({ page }, use) => {
    await use(new LoginUIFlow(page));
  },

  cartUIFlow: async ({ page }, use) => {
    await use(new CartUIFlow(page));
  },

  navigationUIFlow: async ({ page }, use) => {
    await use(new NavigationUIFlow(page));
  },

  purchaseUIFlow: async ({ page }, use) => {
    await use(new PurchaseUIFlow(page));
  },

  /**
   * =========================
   * API FLOWS
   * =========================
   */
  authAPIFlow: async ({ request }, use) => {
    await use(new AuthAPIFlow(request));
  },

  cartAPIFlow: async ({ request }, use) => {
    await use(new CartAPIFlow(request));
  },

  productAPIFlow: async ({ request }, use) => {
    await use(new ProductAPIFlow(request));
  },

  purchaseAPIFlow: async ({ request }, use) => {
    await use(new PurchaseAPIFlow(request));
  },

  /**
   * =========================
   * HYBRID FLOWS
   * =========================
   */
  loginHybridFlow: async ({ page, request }, use) => {
    await use(new LoginHybridFlow(page, request));
  },

  purchaseHybridFlow: async ({ page, request }, use) => {
    await use(new PurchaseHybridFlow(page, request));
  },
});

export const expect = flowTest.expect;
