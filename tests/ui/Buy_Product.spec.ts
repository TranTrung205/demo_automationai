
import { test, expect } from '@playwright/test';

test('Buy Product', async ({ page }) => {

  test.setTimeout(60000);

  // ===== AUTO NAVIGATION =====
  await page.goto('https://www.saucedemo.com');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);


  await page.locator("#user-name").fill("standard_user");

  await page.locator("#password").fill("secret_sauce");

  await page.locator("#login-button").click();

});
