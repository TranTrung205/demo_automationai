import { test, expect } from '@playwright/test';

test('Login with valid user', async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  
  await page.click('[data-test="login-button"]');
  
  expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});