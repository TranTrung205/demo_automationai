import { ollamaChat } from "../llm/ollama-client";
import { TestStep } from "../planner/step-types";

/**
 * Extract code from LLM
 */
function extractCode(text: string): string {

  const match = text.match(
    /```(?:typescript|ts|javascript)?\n([\s\S]*?)```/
  );

  if (match) return match[1].trim();

  return text.trim();
}

/**
 * Remove invalid wrappers
 */
function cleanCode(code: string): string {

  return code
    .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?/g, "")
    .replace(/test\s*\([\s\S]*?\{/, "")
    .replace(/\}\s*\);?\s*$/, "")
    .trim();
}

/**
 * Heuristic generator (fast path)
 */
function heuristicStep(step: TestStep): string | null {

  const t = step.target?.toLowerCase() || "";

  if (step.action === "fill") {

    if (t.includes("user")) {
      return `await page.fill('#user-name', '${step.value || "standard_user"}');`;
    }

    if (t.includes("pass")) {
      return `await page.fill('#password', '${step.value || "secret_sauce"}');`;
    }

    return `await page.fill('input[name="${step.target}"]', '${step.value}');`;
  }

  if (step.action === "click") {

    if (t.includes("login")) {
      return `await page.click('#login-button');`;
    }

    return `await page.getByText('${step.target}').click();`;
  }

  if (step.action === "assert") {

    return `
await expect(
  page.locator('text=${step.target}')
).toBeVisible();
`;
  }

  return null;
}

/**
 * Generate Playwright code for ONE step
 */
export async function generateStepCode(
  step: TestStep
): Promise<string> {

  console.log(`🧠 Generating code for ${step.id}`);

  /**
   * ⭐ FAST HEURISTIC FIRST
   */
  const fast = heuristicStep(step);

  if (fast) {
    console.log("⚡ Heuristic code used");
    return fast;
  }

  /**
   * LLM fallback
   */
  const prompt = `
You are a Playwright automation expert.

Generate ONLY Playwright code for ONE step.

Step:
${JSON.stringify(step, null, 2)}

Rules:

- DO NOT include import
- DO NOT include test()
- Use page object provided
- Must compile
- Prefer locator, getByRole, getByText
- Only this step
- Return ONLY code
`;

  const raw = await ollamaChat(prompt, {
    temperature: 0.1,
    maxTokens: 120
  });

  let code = extractCode(raw);

  code = cleanCode(code);

  if (!code.includes("page")) {
    throw new Error("Invalid step code generated");
  }

  return code;
}