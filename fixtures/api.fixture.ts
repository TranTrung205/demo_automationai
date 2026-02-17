/**
 * API FIXTURE
 *
 * File này dùng để tạo APIRequestContext cho API testing.
 * Context này có thể tái sử dụng trong nhiều test.
 *
 * Lợi ích:
 * - Không cần tạo request context mỗi test
 * - Set baseURL một lần
 * - Dễ thêm auth token sau này
 */

import { test as base, request, APIRequestContext } from '@playwright/test';

// Khai báo kiểu dữ liệu fixture
type APIFixtures = {
  api: APIRequestContext;
};

export const apiTest = base.extend<APIFixtures>({
  
  // Tạo API context trước khi test chạy
  api: async ({}, use) => {

    const apiContext = await request.newContext({
      baseURL: 'https://fakestoreapi.com', // base URL API
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    // Truyền apiContext vào test
    await use(apiContext);

    // Cleanup sau khi test xong
    await apiContext.dispose();
  },

});

export { expect } from '@playwright/test';
