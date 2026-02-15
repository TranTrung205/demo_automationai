import { execSync } from "child_process";
import { generateTest } from "./testGenerator.js";
import { fixTest } from "./selfHealingAgent.js";
import { aiFixTest } from "./aiFixer.js";
import { applyMemoryFix } from "./memoryAgent.js";
import { generateDashboard } from "./dashboard.js";
import { detectNewFeature } from "./featureDetector.js";
import { createTestForFeature } from "./autoTestCreator.js";

async function runTests() {
  try {
    execSync("npx playwright test", { stdio: "inherit" });
    return true;
  } catch (err: any) {
    return err.toString();
  }
}

async function main() {

  console.log("🚀 Autonomous QA Agent Starting...");

  // =========================
  // STEP 1 — Detect new feature
  // =========================
  const newFeature = detectNewFeature();

  if (newFeature) {
    await createTestForFeature(newFeature);
  }

  // =========================
  // STEP 2 — Generate base test
  // =========================
  await generateTest();

  console.log("🚀 Running tests...");
  let result = await runTests();

  if (result !== true) {

    // =========================
    // STEP 3 — Memory Fix
    // =========================
    console.log("🧠 Checking memory...");
    const memoryFixed = applyMemoryFix();

    if (memoryFixed) {
      const retryMemory = await runTests();

      if (retryMemory === true) {
        generateDashboard("PASS", "Recovered using memory");
        return;
      }
    }

    // =========================
    // STEP 4 — Smart Healing
    // =========================
    console.log("🤖 Smart healing...");
    await fixTest(result);

    let retry = await runTests();

    if (retry !== true) {

      // =========================
      // STEP 5 — AI Healing
      // =========================
      console.log("🧠 AI Healing...");
      await aiFixTest(retry);

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
    generateDashboard("PASS", "All tests passed");
  }
}

main();
