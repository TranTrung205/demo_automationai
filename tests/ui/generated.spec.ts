Here is a Playwright TypeScript test that meets your requirements:


import { test, expect } from '@playwright/test';

test('Login Test', async ({ page }) => {
  // Navigate to the website
  await page.goto('https://www.saucedemo.com');
  
  // Fill username and password fields
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  
  // Click the login button
  await page.click('#login-button');
  
  // Check if user is navigated to inventory page
  await expect(page).toHaveURL(/inventory/);
});

This test starts with importing necessary functions from '@playwright/test'. It then navigates to the website, fills in the username and password fields using the provided credentials, clicks the login button, and checks if the user is redirected to the inventory page. The URL checking is done by using `await expect(page).toHaveURL(/inventory/)` which expects the current URL to contain 'inventory'.