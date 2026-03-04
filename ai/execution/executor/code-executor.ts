import { spawn } from "child_process";

export interface ExecutionResult {
  success: boolean;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  combined: string;
  duration: number;
}

export interface ExecutionOptions {
  timeoutMs?: number;
  cwd?: string;
}

export function executeCode(
  command: string,
  options: ExecutionOptions = {}
): Promise<ExecutionResult> {

  const { timeoutMs = 5 * 60 * 1000, cwd } = options;

  console.log("⚡ Executing:", command);

  const startTime = Date.now();

  return new Promise((resolve) => {

    const parts = command.split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    const child = spawn(cmd, args, {
      cwd,
      shell: true
    });

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      console.log("⏳ Execution timeout. Killing process...");
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text); // realtime streaming
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("close", (code) => {

      clearTimeout(timeout);

      const duration = Date.now() - startTime;

      resolve({
        success: code === 0,
        exitCode: code,
        stdout,
        stderr,
        combined: `${stdout}\n${stderr}`,
        duration
      });
    });
  });
}