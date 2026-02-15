import { execSync } from "child_process";
import { generateTest } from "./testGenerator.js";
import { fixTest } from "./selfHealingAgent.js";
import { aiFixTest } from "./aiFixer.js";
import { applyMemoryFix } from "./memoryAgent.js";
import { generateDashboard } from "./dashboard.js";

async function runTests() {
  try {
    execSync("npx playwright test", { stdio: "inherit" });
    return true;
  } catch (err: any) {
    return err.toString();
  }
}

async function main() {
  await generateTest();

  console.log("🚀 Running tests...");
  let result = await runTests();

  if (result !== true) {

    // 🧠 STEP 1 — MEMORY
    console.log("🧠 Checking memory...");
    const memoryFixed = applyMemoryFix();

    if (memoryFixed) {
      console.log("🔁 Re-running after memory fix...");
      const retryMemory = await runTests();

      if (retryMemory === true) {
        generateDashboard("PASS", "Recovered using memory");
        return;
      }
    }

    // 🤖 STEP 2 — SMART HEAL
    console.log("❌ Failed → Self healing...");
    await fixTest(result);

    console.log("🔁 Re-running tests...");
    let retry = await runTests();

    if (retry !== true) {

      // 🧠 STEP 3 — AI HEAL
      console.log("🧠 AI Healing...");
      await aiFixTest(retry);

      console.log("🔁 Re-running after AI...");
      retry = await runTests();

      if (retry !== true) {
        generateDashboard("FAIL", retry);
      } else {
        generateDashboard("PASS", "Recovered using AI");
      }

    } else {
      generateDashboard("PASS", "Recovered after smart healing");
    }

  } else {
    console.log("✅ Tests passed");
    generateDashboard("PASS", "All tests passed");
  }
}

main();
