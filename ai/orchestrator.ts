import fs from "fs";
import { execSync } from "child_process";

import { scanDOM } from "./scanner/dom-scanner";
import { generateTest } from "./generator/ai-generator";
import { healTest } from "./healer/ai-healer";

/**
 * Clean AI output
 */
function cleanCode(raw: string): string {
  return raw
    .replace(/Here is.*?:/gi, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Convert requirement → filename
 */
function toFileName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function run() {

  console.log("🚀 AI Agent V3 Multi Scenario Started");

  const url = "https://www.saucedemo.com";

  const requirements = [
    "Login with valid user",
    "Add product to cart",
    "Remove product from cart",
    "Logout user"
  ];

  fs.mkdirSync("tests/ui", { recursive: true });

  /**
   * STEP 1 — Scan DOM
   */
  console.log("🔎 Scanning DOM...");
  const dom = await scanDOM(url);

  for (const requirement of requirements) {

    console.log("\n==============================");
    console.log("🤖 Scenario:", requirement);

    const fileName = toFileName(requirement);
    const testPath = `tests/ui/ai-${fileName}.spec.ts`;

    try {

      /**
       * STEP 2 — Generate
       */
      console.log("🧠 Generating test...");

      const raw = await generateTest(
        url,          // ✅ FIX QUAN TRỌNG
        requirement,
        dom
      );

      const code = cleanCode(raw);

      fs.writeFileSync(testPath, code);

      console.log("✅ Test generated →", testPath);

      /**
       * STEP 3 — Run
       */
      console.log("▶ Running Playwright...");

      execSync(`npx playwright test ${testPath}`, {
        stdio: "inherit",
      });

      console.log("🎉 Test Passed");

    } catch (err: any) {

      console.log("❌ Test Failed — Healing...");

      const errorMessage = err.toString();
      const oldCode = fs.readFileSync(testPath, "utf-8");

      /**
       * STEP 4 — Heal
       */
      const healedRaw = await healTest(
        requirement,
        errorMessage,
        oldCode
      );

      const healedCode = cleanCode(healedRaw);

      fs.writeFileSync(testPath, healedCode);

      console.log("🩹 Healed test saved");

      /**
       * STEP 5 — Re-run
       */
      console.log("▶ Re-running...");

      execSync(`npx playwright test ${testPath}`, {
        stdio: "inherit",
      });

      console.log("✅ Healing completed");
    }
  }

  console.log("\n🚀 ALL SCENARIOS COMPLETED");
}

run();