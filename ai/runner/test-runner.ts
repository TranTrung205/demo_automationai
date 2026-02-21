import { exec } from "child_process";

export async function runTest(): Promise<{
  success: boolean;
  error?: string;
}> {
  return new Promise((resolve) => {

    exec("npx playwright test", (error, stdout, stderr) => {

      if (error) {
        resolve({
          success: false,
          error: stderr || stdout
        });
        return;
      }

      resolve({
        success: true
      });

    });

  });
}