import { ollamaChat } from "../llm/ollama-client";

/**
 * Extract code from markdown
 */
function extractCode(text: string): string {

  const match = text.match(/```(?:typescript|ts|javascript)?\n([\s\S]*?)```/);

  if (match) return match[1].trim();

  return text.trim();
}

/**
 * Heal ONE step code
 */
export async function healStep(
  code: string,
  error: string
): Promise<string> {

  console.log("🩹 Healing step...");

  const prompt = `
Fix this Playwright test step.

Rules:

- Return ONLY TypeScript
- Must compile
- Keep same intent
- Use import { test, expect } from '@playwright/test'
- Fix locator / timing / assertion issues

Code:
${code}

Error:
${error}
`;

  const raw = await ollamaChat(prompt, {
    temperature: 0.1
  });

  const healed = extractCode(raw);

  if (!healed.includes("test(")) {
    console.log("⚠️ Heal invalid — returning original");
    return code;
  }

  console.log("✅ Step healed");

  return healed;
}