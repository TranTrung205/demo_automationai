import fs from "fs";

export function createTestForFeature(feature: string) {

  const testCode = `
import { test, expect } from '@playwright/test';

test('${feature} flow', async ({ page }) => {
  await page.goto('https://dev.statekraft.ai/log-in');

  await page.locator('#${feature}').click();

  await expect(page).toBeVisible();
});
`;

  const fileName = `tests/${feature}.spec.ts`;

  fs.writeFileSync(fileName, testCode);

  console.log(`🆕 Test created for feature: ${feature}`);
}
