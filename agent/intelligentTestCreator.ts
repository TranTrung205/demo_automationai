import fs from "fs";
import { scanDOM } from "./domScanner.js";
import { generateSelector } from "./selectorGenerator.js";

export async function createIntelligentTest() {

  const url = "https://www.saucedemo.com/";

  const dom = await scanDOM(url);

  // tìm username field
  const userInput = dom.inputs.find(i =>
    i?.id?.toLowerCase().includes("user")
  );

  // tìm password field
  const passwordInput = dom.inputs.find(i =>
    i?.id?.toLowerCase().includes("password")
  );

  // tìm login button
  const loginButton = dom.buttons.find(b =>
    b?.id?.toLowerCase().includes("login")
  );

  const userSelector =
    generateSelector(userInput) || "#user-name";

  const passSelector =
    generateSelector(passwordInput) || "#password";

  const buttonSelector =
    generateSelector(loginButton) || "#login-button";

  const code = `
import { test, expect } from '@playwright/test';

test('AI generated login', async ({ page }) => {

  await page.goto('${url}');

  await page.fill('${userSelector}', 'standard_user');
  await page.fill('${passSelector}', 'secret_sauce');

  await page.click('${buttonSelector}');

  await expect(page).toHaveURL(/inventory/);

});
`;

  fs.writeFileSync("tests/ai-login.spec.ts", code);

  console.log("🤖 Intelligent test created");
}
