import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const TEST_DIR = path.join(process.cwd(), "tests", "generated");

if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

/**
 * Wrap code into Playwright test
 */
function wrapTest(code: string) {
  return `
import { test, expect } from '@playwright/test';

test('AI Step Test', async ({ page }) => {

${code}

});
`;
}

/**
 * Run single step
 */
export async function runStep(stepCode: string, stepIndex: number) {
  const filePath = path.join(TEST_DIR, `step-${stepIndex}.spec.ts`);

  console.log(`🚀 Running step ${stepIndex}`);

  try {
    const wrapped = wrapTest(stepCode);

    fs.writeFileSync(filePath, wrapped);

    /**
     * IMPORTANT: pass full path
     */
    execSync(
      `npx playwright test "${filePath}" --reporter=line`,
      {
        stdio: "pipe",
      }
    );

    console.log("✅ Step passed");

    return { success: true };
  } catch (err: any) {
    console.log("❌ Step failed");

    const output =
      err.stdout?.toString() ||
      err.message ||
      "Unknown error";

    console.log("🧾 Error Output:");
    console.log(output);

    return {
      success: false,
      error: output,
    };
  }
}