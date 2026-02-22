
import { test, expect } from '@playwright/test';

test('AI Generated Scenario', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');


  // ===== Step 1 =====
  await page.fill('#user-name', 'standard_user');


  // ===== Step 2 =====
  await page.fill('#password', 'secret_sauce');


  // ===== Step 3 =====
  await page.click('#login-button');


});
