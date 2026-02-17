/**
 * COMBINED FIXTURE (UI + API)
 *
 * File này kết hợp UI fixture và API fixture.
 * Dùng khi test cần cả browser và API cùng lúc.
 *
 * Ví dụ:
 * - Login bằng API
 * - Sau đó mở UI kiểm tra dashboard
 */

import { uiTest as base } from './ui.fixture';
import { request, APIRequestContext } from '@playwright/test';

// Khai báo kiểu dữ liệu
type CombinedFixtures = {
  api: APIRequestContext;
};

export const test = base.extend<CombinedFixtures>({
  
  api: async ({}, use) => {

    const apiContext = await request.newContext({
      baseURL: 'https://fakestoreapi.com',
    });

    await use(apiContext);

    await apiContext.dispose();
  },

});

export { expect } from '@playwright/test';
