/**
 * UI FIXTURE
 *
 * File này dùng để khởi tạo các Page Object cho UI test.
 * Khi test chạy, Playwright sẽ tự inject loginPage, inventoryPage vào test.
 *
 * Lợi ích:
 * - Không cần new LoginPage trong mỗi test
 * - Code sạch hơn
 * - Dễ maintain khi project lớn
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

// Khai báo kiểu dữ liệu cho fixture
type UIFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

// Extend từ Playwright base test
export const uiTest = base.extend<UIFixtures>({
  
  // Khởi tạo LoginPage trước khi test chạy
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Khởi tạo InventoryPage trước khi test chạy
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

});

// Export expect để dùng chung
export { expect } from '@playwright/test';
