import fs from "fs/promises";
import { ollamaChat } from "../llm/ollama-client";

export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
  retries?: number;
}

/**
 * Extract code from markdown
 */
function extractCode(text: string): string {
  if (!text) return "";

  const match = text.match(/```(?:typescript|ts|javascript)?\n([\s\S]*?)```/);

  if (match) return match[1].trim();

  return text.trim();
}

/**
 * Validate Playwright code
 */
function validate(code: string): boolean {

  if (!code) return false;

  if (!code.includes("test(")) return false;

  if (!code.includes("@playwright/test")) return false;

  if (!code.includes("await")) return false;

  return true;
}

/**
 * Fallback minimal test
 */
function fallbackTest(): string {

  return `
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveURL(/example/);
});
`;
}

/**
 * Generate Playwright test
 */
export async function generateTest(
  domPath: string,
  instruction: string,
  options: AIGenerateOptions = {}
): Promise<string> {

  const dom = await fs.readFile(domPath, "utf-8");

  const temperature = options.temperature ?? 0.1;
  const retries = options.retries ?? 2;

  const prompt = `
You are a senior Playwright automation engineer.

TASK:
Generate a complete Playwright TypeScript test.

STRICT RULES:

- Must use: import { test, expect } from '@playwright/test'
- Must use async ({ page })
- Must compile without errors
- Must contain at least one assertion
- Prefer getByRole / getByLabel / getByText
- Avoid XPath unless necessary
- Use proper awaits
- Return ONLY code
- No explanation
- No markdown

TEST SCENARIO:
${instruction}

DOM SNAPSHOT:
${dom}
`;

  for (let i = 1; i <= retries; i++) {

    console.log(`🧠 Generate attempt ${i}`);

    const raw = await ollamaChat(prompt, {
      model: options.model || "phi3",
      temperature,
      system: "You are a senior Playwright automation engineer."
    });

    const code = extractCode(raw);

    if (validate(code)) {
      return code;
    }

    console.log("⚠️ Invalid generated test");
  }

  console.log("❌ Generator failed — using fallback");

  return fallbackTest();
}