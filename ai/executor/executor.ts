import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const TEST_DIR = path.join(ROOT, "tests/ui");

/**
 * Ensure folder exists
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Run Playwright test file
 */
function runPlaywright(file: string) {
  try {

    execSync(
      `npx playwright test ${file}`,
      {
        stdio: "pipe",
        timeout: 120000
      }
    );

    return { success: true };

  } catch (err: any) {

    return {
      success: false,
      output:
        err.stdout?.toString() ||
        err.stderr?.toString() ||
        err.message
    };
  }
}

/**
 * Execute multiple steps sequentially
 */
export async function executeSteps(
  steps: string[]
) {

  ensureDir(TEST_DIR);

  const results: any[] = [];

  for (let i = 0; i < steps.length; i++) {

    const file = path.join(
      TEST_DIR,
      `step-${i + 1}.spec.ts`
    );

    fs.writeFileSync(file, steps[i]);

    console.log(`🚀 Running step ${i + 1}`);

    const result = runPlaywright(file);

    results.push(result);

    if (!result.success) {

      console.log(`❌ Step ${i + 1} failed`);

      return {
        success: false,
        failedStep: i + 1,
        results,
        output: result.output
      };
    }

    console.log(`✅ Step ${i + 1} passed`);
  }

  return {
    success: true,
    results
  };
}