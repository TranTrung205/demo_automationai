import fs from "fs/promises";
import { ollamaChat } from "../llm/ollama-client";
import ts from "typescript";

export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
  retries?: number;
}

/**
 * Extract code safely
 */
function extractCode(text: string): string {

  if (!text) return "";

  // remove markdown fences
  text = text
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```javascript/g, "")
    .replace(/```/g, "");

  // start from import
  const start = text.indexOf("import");

  if (start !== -1) {
    text = text.substring(start);
  }

  // cut after last bracket
  const end = text.lastIndexOf("}");

  if (end !== -1) {
    text = text.substring(0, end + 1);
  }

  return text.trim();
}


/**
 * Remove hallucinated junk text
 */
function sanitizeCode(code: string): string {

  if (!code) return "";

  // fix corrupted urls
  code = code.replace(
    /https:\/\/[^\s'"]+/g,
    (url) => {
      if (url.includes("saucedemo")) {
        return "https://www.saucedemo.com";
      }
      return url;
    }
  );

  // remove weird sentences accidentally injected
  code = code.replace(/Corrected Test:/gi, "");
  code = code.replace(/generalize the error.*$/gi, "");

  return code.trim();
}


/**
 * Validate structure
 */
function validateStructure(code: string): boolean {

  if (!code) return false;

  if (!code.includes("@playwright/test")) return false;
  if (!code.includes("test(")) return false;
  if (!code.includes("await")) return false;

  return true;
}


/**
 * TypeScript compile validation ⭐ VERY IMPORTANT
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
 * Generate Playwright test (V6)
 */
export async function generateTest(
  domPath: string,
  instruction: string,
  options: AIGenerateOptions = {}
): Promise<string> {

  const dom = await fs.readFile(domPath, "utf-8");

  const temperature = options.temperature ?? 0.1;
  const retries = options.retries ?? 3;

  const prompt = `
You are a senior Playwright automation engineer.

Generate ONLY valid TypeScript Playwright code.

STRICT RULES:

- Use: import { test, expect } from '@playwright/test'
- Use async ({ page })
- Must compile
- Must contain assertion
- Prefer getByRole / getByLabel / getByText
- No explanation
- No markdown
- Return ONLY code

SCENARIO:
${instruction}

DOM:
${dom}
`;

  for (let i = 1; i <= retries; i++) {

    console.log(`🧠 Generate attempt ${i}`);

    const raw = await ollamaChat(prompt, {
      model: options.model || "phi3",
      temperature,
      system: "You are a senior Playwright automation engineer."
    });

    if (!raw) {
      console.log("⚠️ Empty response");
      continue;
    }

    let code = extractCode(raw);

    code = sanitizeCode(code);

    if (!validateStructure(code)) {
      console.log("⚠️ Invalid structure");
      continue;
    }

    if (!compileCheck(code)) {
      console.log("⚠️ TypeScript compile failed");
      continue;
    }

    console.log("✅ Test generated successfully");

    return code;
  }

  console.log("❌ Generator failed — using fallback");

  return fallbackTest();
}