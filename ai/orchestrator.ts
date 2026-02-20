import fs from "fs";
import { execSync } from "child_process";
import { generateTest } from "./generator/ai-generator";
import { healTest } from "./healer/ai-healer";

function cleanCode(raw: string): string {
  return raw
    .replace(/Here is.*?:/gi, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "")
    .trim();
}

async function run() {
  console.log("🚀 AI Agent V2 Started");

  const requirement = "Login to saucedemo with valid user";

  // Step 1 — Generate test
  const raw = await generateTest(requirement);
  const code = cleanCode(raw);

  const testPath = "tests/ui/ai-login.spec.ts";

  fs.writeFileSync(testPath, code);

  console.log("✅ Test generated");

  try {
    console.log("▶ Running Playwright...");
    execSync("npx playwright test tests/ui/ai-login.spec.ts", {
      stdio: "inherit",
    });

    console.log("🎉 Test Passed — No healing needed");
  } catch (err: any) {
    console.log("❌ Test Failed — Healing...");

    const errorMessage = err.toString();

    // Step 2 — Heal test
    const healedRaw = await healTest(requirement, errorMessage, code);
    const healedCode = cleanCode(healedRaw);

    fs.writeFileSync(testPath, healedCode);

    console.log("🩹 Healed test saved");

    console.log("▶ Re-running Playwright...");

    execSync("npx playwright test tests/ui/ai-login.spec.ts", {
      stdio: "inherit",
    });

    console.log("✅ Healing completed");
  }
}

run();