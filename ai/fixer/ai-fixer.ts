import { ollamaChat } from "../llm/ollama-client";

/**
 * Extract code from markdown blocks if LLM returns explanation
 */
function extractCode(text: string): string {
  const match = text.match(/```(?:typescript|ts|javascript)?\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  return text.trim();
}

/**
 * Basic Playwright validation
 */
function validate(code: string) {

  if (!code.includes("test(")) {
    throw new Error("Invalid Playwright test: missing test()");
  }

  if (!code.includes("@playwright/test")) {
    throw new Error("Invalid Playwright import");
  }
}

/**
 * Fix Playwright code using AI
 */
export async function fixWithAI(
  originalCode: string,
  errorLog: string
): Promise<string> {

  console.log("🤖 AI Fixer running...");

  const prompt = `
You are a senior Playwright automation engineer.

Fix the failed Playwright test.

STRICT RULES:

- Return ONLY valid TypeScript code
- No explanation
- No markdown
- Must compile
- Must contain test()
- Must use: import { test, expect } from '@playwright/test'

Error:
${errorLog}

Original Code:
${originalCode}
`;

  const raw = await ollamaChat(prompt, {
    temperature: 0.1,
    system: "You are an expert Playwright automation engineer."
  });

  const code = extractCode(raw);

  validate(code);

  return code;
}