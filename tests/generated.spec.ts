import { test, expect } from '@playwright/test';

test('Login Test', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    const username = await page.$("[id='user-name']");
    const password = await page.$("[id='password']");
    const loginButton = await page.$("[id='login-button']");
  
    await username.type('standard_user');
    await password.type('secret_sauce');
    await loginButton.click();
    
    expect(await page.url()).toMatch(/inventory\.html$/);
});