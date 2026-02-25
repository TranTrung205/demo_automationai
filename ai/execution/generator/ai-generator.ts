import fs from "fs/promises";

interface Step {
  action: string;
  target?: string;
  value?: string;
  expected?: string;
}

/**
 * ============================================
 * V8 TEST GENERATOR
 * ============================================
 */
export async function generateTest(
  steps: Step[],
  testName: string,
  url: string = "https://www.saucedemo.com"
) {

  /**
   * ============================
   * SAFE FILE NAME
   * ============================
   */
  const safeName = testName
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]/g, "");

  const dir = "tests/ui";

  await fs.mkdir(dir, { recursive: true });

  const filePath = `${dir}/${safeName}.spec.ts`;

  /**
   * ============================
   * TEST TEMPLATE
   * ============================
   */
  let code = `
import { test, expect } from '@playwright/test';

test('${testName}', async ({ page }) => {

  test.setTimeout(60000);

  // ===== AUTO NAVIGATION =====
  await page.goto('${url}');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

`;

  /**
   * ============================
   * BUILD STEPS
   * ============================
   */
  for (const step of steps) {
    code += buildStep(step);
  }

  code += `
});
`;

  /**
   * ============================
   * WRITE FILE
   * ============================
   */
  await fs.writeFile(filePath, code);

  console.log("📝 Test generated:", filePath);

  return {
    filePath
  };
}


/**
 * ============================================
 * STEP BUILDER
 * ============================================
 */
function buildStep(step: Step): string {

  const { action, target, value, expected } = step;

  switch (action) {

    case "goto":
      return `
  await page.goto('${target}');
  await page.waitForLoadState('domcontentloaded');
`;

    case "click":
      return `
  await page.locator("${target}").click();
`;

    case "fill":
      return `
  await page.locator("${target}").fill("${value}");
`;

    case "assert":

      if (expected === "visible") {
        return `
  await expect(page.locator("${target}")).toBeVisible();
`;
      }

      return `
  await expect(page.locator("${target}")).toBeVisible();
`;

    default:
      return `
  // Unknown step: ${action}
`;
  }
}