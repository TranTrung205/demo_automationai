import { test, expect } from '@playwright/test';

test('login to saucedemo with valid user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.fill('input[name="user-name"]', 'standard_user');
  await page.fill('input[name="password"]', 'secret_sauce');
  await page.click('#login-button');
  expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});