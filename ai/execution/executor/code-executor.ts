import { exec } from "child_process";

export interface ExecutionResult {
  success: boolean;
  output: string;
}

/**
 * Execute generated Playwright test
 */
export function executeCode(
  command: string
): Promise<ExecutionResult> {

  console.log("⚡ Executing:", command);

  return new Promise((resolve) => {

    exec(command, (error, stdout, stderr) => {

      const output = `${stdout}\n${stderr}`;

      if (error) {

        resolve({
          success: false,
          output
        });

        return;
      }

      resolve({
        success: true,
        output
      });
    });
  });
}