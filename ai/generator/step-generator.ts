import { ollamaChat } from "../llm/ollama-client";
import { TestStep } from "../planner/step-types";

/**
 * Extract code from LLM
 */
function extractCode(text: string): string {

  const match = text.match(/```(?:typescript|ts|javascript)?\n([\s\S]*?)```/);

  if (match) return match[1].trim();

  return text.trim();
}

/**
 * Generate Playwright code for ONE step
 */
export async function generateStepCode(
  step: TestStep
): Promise<string> {

  const prompt = `
You are a senior Playwright automation engineer.

Generate Playwright TypeScript code for ONE step.

Step:

${JSON.stringify(step, null, 2)}

Rules:

- Use: import { test, expect } from '@playwright/test'
- Use async ({ page })
- Must compile
- Only implement this step
- No extra navigation unless action = goto
- Prefer getByRole / getByLabel / getByText
- No explanations
- Return ONLY code
`;

  console.log(`🧠 Generating code for ${step.id}`);

  const raw = await ollamaChat(prompt, {
    temperature: 0.1
  });

  const code = extractCode(raw);

  if (!code.includes("test(")) {
    throw new Error("Invalid step code generated");
  }

  return code;
}