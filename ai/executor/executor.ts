import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();

const TEST_DIR = path.join(ROOT, "tests/ui");
const TEST_FILE = path.join(TEST_DIR, "ai-generated.spec.ts");

/**
 * Extract body inside test()
 */
function extractBody(code: string): string {

  const match = code.match(
    /test\s*\([^)]*\)\s*,?\s*async\s*\(\{[^\}]*\}\)\s*=>\s*{([\s\S]*)}\s*\);?/
  );

  if (match) return match[1].trim();

  return code.trim();
}

/**
 * Merge multiple step codes into ONE spec
 */
function mergeSteps(stepCodes: string[]): string {

  const bodies = stepCodes.map((code, i) => {

    const body = extractBody(code);

    return `
  // ===== Step ${i + 1} =====
  ${body}
`;
  });

  const mergedBody = bodies.join("\n");

  return `
import { test, expect } from '@playwright/test';

test('AI Generated Scenario', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

${mergedBody}

});
`;
}

/**
 * Run playwright (AUTO DISCOVER)
 */
function runTest() {

  try {

    console.log("🧪 Running Playwright...");

    execSync(
      `npx playwright test --reporter=line`,
      {
        stdio: "inherit",
        timeout: 60000
      }
    );

    return { success: true };

  } catch (err: any) {

    return {
      success: false,
      failedIndex: 0,
      output:
        err?.stdout?.toString() ||
        err?.stderr?.toString() ||
        err?.message
    };
  }
}

/**
 * Execute steps
 */
export async function executeSteps(stepCodes: string[]) {

  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }

  const finalSpec = mergeSteps(stepCodes);

  fs.writeFileSync(TEST_FILE, finalSpec, "utf-8");

  console.log("🧪 Test file created:");
  console.log(path.relative(ROOT, TEST_FILE));

  console.log("🚀 Running merged spec...");

  return runTest();
}