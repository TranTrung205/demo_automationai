import { test, expect } from '@playwright/test';

test('add product to cart', async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Login
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // Add product to cart
  await page.goto("https://www.saucedemo.com/cart.html");
  await page.click('#add-to-cart-sauce-labs-backpack');
  await page.click('.shopping_cart_link');

  // Verify URL
  expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
});