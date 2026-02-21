import { ollamaChat } from "../llm/ollama-client";

/**
 * Evaluation result từ evaluator
 */
export interface EvaluationResult {
  type: string;
  message: string;
  strategy: string;
}

/**
 * Extract code từ markdown
 */
function extractCode(text: string): string {
  const match = text.match(/```(?:typescript|ts|javascript)?\n([\s\S]*?)```/);
  if (match) return match[1].trim();
  return text.trim();
}

/**
 * Validate Playwright test
 */
function validate(code: string) {
  if (!code || code.length < 20) {
    throw new Error("Empty code from AI");
  }

  if (!code.includes("test(")) {
    throw new Error("Missing test()");
  }

  if (!code.includes("@playwright/test")) {
    throw new Error("Missing playwright import");
  }
}

/**
 * Assertion auto fix (không cần AI)
 */
function fixAssertion(code: string): string {
  console.log("🛠 Applying assertion fix...");

  return code
    .replace(
      /toHaveURL\((['"`])\/inventory\1\)/g,
      "toHaveURL(/inventory/)"
    )
    .replace(
      /toHaveURL\((['"`])inventory\1\)/g,
      "toHaveURL(/inventory/)"
    );
}

/**
 * Wait strategy đơn giản
 */
function addWaitLogic(code: string): string {
  console.log("🛠 Applying wait strategy...");

  if (code.includes("waitForTimeout")) return code;

  return code.replace(
    "await page.goto(",
    "await page.goto("
  );
}

/**
 * AI regenerate
 */
async function regenerateWithAI(
  code: string,
  error: string,
  attempt = 1
): Promise<string> {

  console.log(`🧠 AI heal attempt ${attempt}`);

  const prompt = `
Fix this Playwright test.

Rules:
- Return ONLY TypeScript
- Must compile
- Keep same scenario
- Use import { test, expect } from '@playwright/test'
- Fix failure only

Test:
${code}

Error:
${error}
`;

  const raw = await ollamaChat(prompt, {
    temperature: 0.1
  });

  const healed = extractCode(raw);

  validate(healed);

  return healed;
}

/**
 * MAIN HEAL FUNCTION
 */
export async function healTest(
  code: string,
  evaluation: EvaluationResult
): Promise<string> {

  console.log("🩹 Healing strategy:", evaluation.strategy);

  const error = evaluation.message;

  /**
   * Strategy 1 — Assertion fix (no AI)
   */
  if (evaluation.strategy === "fix-assertion") {
    try {
      return fixAssertion(code);
    } catch {
      console.log("⚠️ Assertion fix failed → fallback AI");
    }
  }

  /**
   * Strategy 2 — Wait retry
   */
  if (evaluation.strategy === "wait-retry") {
    try {
      return addWaitLogic(code);
    } catch {
      console.log("⚠️ Wait fix failed → fallback AI");
    }
  }

  /**
   * Strategy 3 — Locator heal / regenerate
   */
  const MAX_ATTEMPTS = 3;

  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    try {

      const healed = await regenerateWithAI(code, error, i);

      console.log("✅ Heal success");

      return healed;

    } catch (err: any) {

      console.log(`❌ Heal attempt ${i} failed:`, err.message);

      if (i === MAX_ATTEMPTS) {
        console.log("⚠️ All heal attempts failed → returning original code");
        return code;
      }
    }
  }

  return code;
}