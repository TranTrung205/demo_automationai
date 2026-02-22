import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ts from "typescript";

import { generateTest } from "./generator/ai-generator.js";
import { healTest } from "./healer/ai-healer.js";
import { evaluateFailure } from "./evaluator/ai-evaluator.js";
import { loadMemory, saveMemory } from "./memory/ai-memory.js";

const ROOT = process.cwd();

const TEST_DIR = path.join(ROOT, "tests/ui");
const TEST_FILE = path.join(TEST_DIR, "ai-test.spec.ts");

const DOM_FILE = path.join(ROOT, "dom", "dom.json");

const MAX_ATTEMPTS = 5;



/**
 * Ensure folder
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}



/**
 * Clean AI output
 */
function cleanAIOutput(content: string): string {
  if (!content) return "";

  return content
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```javascript/g, "")
    .replace(/```/g, "")
    .trim();
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
function validateCode(code: string): boolean {

  if (!code) return false;

  if (!code.includes("test(")) return false;

  if (!code.includes("@playwright/test")) return false;

  if (!code.includes("await")) return false;

  return true;
}



/**
 * Run Playwright
 */
function runTest(): { success: boolean; output?: string } {

  try {

    execSync(
      `npx playwright test ${TEST_FILE}`,
      { stdio: "pipe" }
    );

    return { success: true };

  } catch (err: any) {

    return {
      success: false,
      output: err.stdout?.toString() || err.message
    };
  }
}



/**
 * Save learning memory
 */
async function learnMemory(instruction: string, success: boolean, failure?: string) {

  await saveMemory({
    instruction,
    success,
    failure,
    timestamp: new Date().toISOString()
  });

}



/**
 * MAIN AGENT
 */
export async function runAgent(instruction: string) {

  console.log("📂 Loading memory...");
  const memory = await loadMemory();

  if (!fs.existsSync(DOM_FILE)) {
    throw new Error("dom.json not found. Run scanner first.");
  }

  ensureDir(TEST_DIR);

  let code = "";

  try {

    /**
     * GENERATE
     */
    console.log("🧠 Generating test...");

    const raw = await generateTest(DOM_FILE, instruction);

    code = cleanAIOutput(raw);

    if (!validateCode(code) || !compileCheck(code)) {
      throw new Error("AI generated invalid test");
    }

    fs.writeFileSync(TEST_FILE, code);



    /**
     * LOOP ATTEMPTS
     */
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {

      console.log(`\n🚀 Attempt ${attempt}`);

      const result = runTest();

      if (result.success) {

        console.log("✅ Test passed");

        await learnMemory(instruction, true);

        return;
      }

      console.log("❌ Failed");

      const failureOutput = result.output || "";

      const evaluation = evaluateFailure(failureOutput);

      console.log("🧠 Evaluation:", evaluation);



      /**
       * HEAL
       */
      console.log("🩹 Healing...");

      const healedRaw = await healTest(
        code,
        evaluation
      );

      const healed = cleanAIOutput(healedRaw);

      if (!validateCode(healed) || !compileCheck(healed)) {

        console.log("❌ Invalid healed code — retrying");

        continue;
      }

      fs.writeFileSync(TEST_FILE, healed);

      code = healed;
    }



    /**
     * FAIL FINAL
     */
    console.log("❌ Max attempts reached");

    await learnMemory(
      instruction,
      false,
      "Max attempts reached"
    );

  } catch (err: any) {

    console.error("❌ Agent crashed:", err);

    await learnMemory(
      instruction,
      false,
      err?.message
    );
  }
}