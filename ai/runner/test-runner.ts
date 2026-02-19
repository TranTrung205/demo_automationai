import { exec } from "child_process";

export interface TestResult {
  success: boolean;
  output: string;
}

/**
 * Run Playwright tests
 */
export function runTests(): Promise<TestResult> {
  return new Promise((resolve) => {
    exec("npx playwright test", (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          output: stderr || stdout,
        });
      } else {
        resolve({
          success: true,
          output: stdout,
        });
      }
    });
  });
}
