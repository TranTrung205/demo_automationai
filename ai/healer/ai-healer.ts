import ts from "typescript";
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
 * Extract code safely
 */
function extractCode(text: string): string {

  if (!text) return "";

  text = text
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```javascript/g, "")
    .replace(/```/g, "");

  const start = text.indexOf("import");

  if (start !== -1) {
    text = text.substring(start);
  }

  const end = text.lastIndexOf("}");

  if (end !== -1) {
    text = text.substring(0, end + 1);
  }

  return text.trim();
}



/**
 * Sanitize hallucinated junk
 */
function sanitizeCode(code: string): string {

  if (!code) return "";

  code = code.replace(/Corrected Test:/gi, "");

  code = code.replace(
    /https:\/\/[^\s'"]+/g,
    (url) => {
      if (url.includes("saucedemo")) {
        return "https://www.saucedemo.com";
      }
      return url;
    }
  );

  return code.trim();
}



/**
 * Compile validation ⭐ important
 */
function compileCheck(code: string): boolean {

  try {

    ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS
      }
    });

    return true;

  } catch {

    return false;
  }
}



/**
 * Basic validation
 */
function validateStructure(code: string) {

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
 * Deterministic fix — assertion
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
 * Deterministic fix — wait logic
 */
function addWaitLogic(code: string): string {

  console.log("🛠 Applying wait strategy...");

  if (code.includes("waitForTimeout")) return code;

  return code.replace(
    /await page\.click\((.*?)\);/g,
    `await page.click($1);
    await page.waitForLoadState('networkidle');`
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
You are a senior Playwright automation engineer.

Fix the failing test.

STRICT RULES:

- Return ONLY TypeScript
- Must compile
- Keep same scenario
- Do not change test name
- Keep Playwright style
- Fix only failure

TEST:
${code}

ERROR:
${error}
`;

  const raw = await ollamaChat(prompt, {
    temperature: 0.1
  });

  if (!raw) {
    throw new Error("Empty AI response");
  }

  let healed = extractCode(raw);

  healed = sanitizeCode(healed);

  validateStructure(healed);

  if (!compileCheck(healed)) {
    throw new Error("Compile failed");
  }

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
   * Strategy 1 — Assertion fix
   */
  if (evaluation.strategy === "fix-assertion") {

    try {

      const fixed = fixAssertion(code);

      if (compileCheck(fixed)) {
        return fixed;
      }

    } catch {
      console.log("⚠️ Assertion fix failed → fallback AI");
    }
  }



  /**
   * Strategy 2 — Wait retry
   */
  if (evaluation.strategy === "wait-retry") {

    try {

      const fixed = addWaitLogic(code);

      if (compileCheck(fixed)) {
        return fixed;
      }

    } catch {
      console.log("⚠️ Wait fix failed → fallback AI");
    }
  }



  /**
   * Strategy 3 — AI regenerate
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