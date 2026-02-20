// runner/test-runner.ts
import { exec } from "child_process";

export interface TestResult {
  success: boolean;
  error?: string;
}

export async function runTest(): Promise<TestResult> {
  return new Promise((resolve) => {

    const cmd = `npx playwright test tests/generated.spec.ts --reporter=line`;

    console.log("🧪 Running:", cmd);

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {

      console.log(stdout);
      console.error(stderr);

      if (error) {
        resolve({
          success: false,
          error: stderr || stdout,
        });
      } else {
        resolve({
          success: true,
        });
      }
    });

  });
}