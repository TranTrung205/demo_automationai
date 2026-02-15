import type { TestPlan } from "./plannerAgent.js";
import fs from "fs";

export async function testerAgent(plan: TestPlan): Promise<string> {
  console.log("🤖 Tester Agent running (FREE MODE)");

  const code = `
import { test, expect } from '@playwright/test';

test('${plan.testName}', async ({ page }) => {
  await page.goto('https://dev.statekraft.ai/log-in');

  await page.fill('#username', 'demo');
  await page.fill('#password', 'demo');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});
`;

  fs.writeFileSync("tests/ai-generated.spec.ts", code);

  return code;
}
