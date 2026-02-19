import fs from "fs";
import { askLLM } from "../llm/ollama-client";

/**
 * Fix failed Playwright test using AI
 */
export async function fixTest(
  filePath: string,
  errorLog: string
): Promise<void> {
  const originalCode = fs.readFileSync(filePath, "utf-8");

  const prompt = `
You are a senior QA automation engineer.

The Playwright test failed.

Error:
${errorLog}

Original Code:
${originalCode}

Fix the code.
Return ONLY updated code.
`;

  const fixedCode = await askLLM(prompt);

  fs.writeFileSync(filePath, fixedCode);

  console.log("✅ Test fixed by AI");
}
