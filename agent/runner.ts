import { execSync } from "child_process";

// STEP 1 — Generate base test
import { generateTest } from "./testGenerator.js";

// STEP 3 — Smart self healing
import { fixTest } from "./selfHealingAgent.js";

// STEP 4 — AI healing
import { aiFixTest } from "./aiFixer.js";

// STEP 7 — Memory agent
import { applyMemoryFix } from "./memoryAgent.js";

// STEP 6 — Dashboard report
import { generateDashboard } from "./dashboard.js";

// STEP 8 — Autonomous feature detection
import { detectNewFeature } from "./featureDetector.js";
import { createTestForFeature } from "./autoTestCreator.js";


// ===============================
// Run Playwright tests
// ===============================
async function runTests() {
  try {
    execSync("npx playwright test", { stdio: "inherit" });
    return true;
  } catch (err: any) {
    return err.toString();
  }
}


// ===============================
// MAIN AGENT FLOW
// ===============================
async function main() {

  console.log("🤖 AI TEST AGENT STARTING...\n");


  // =========================================================
  // STEP 8 — Detect new feature and auto create tests
  // =========================================================
  console.log("🔍 Checking for new features...");

  const newFeatures = detectNewFeature();

  if (newFeatures.length > 0) {
    console.log("🆕 New features detected:", newFeatures);

    for (const feature of newFeatures) {
      createTestForFeature(feature);
    }
  } else {
    console.log("✅ No new features");
  }


  // =========================================================
  // STEP 1 — Generate main test
  // =========================================================
  console.log("\n📝 Generating test...");
  await generateTest();


  // =========================================================
  // STEP 2 — Run tests
  // =========================================================
  console.log("\n🚀 Running tests...");
  let result = await runTests();


  // =========================================================
  // IF TEST FAIL → HEALING PIPELINE
  // =========================================================
  if (result !== true) {

    // =====================================================
    // STEP 7 — MEMORY HEALING (FIRST PRIORITY)
    // =====================================================
    console.log("\n🧠 Checking memory...");
    const memoryFixed = applyMemoryFix();

    if (memoryFixed) {

      console.log("🔁 Re-running after memory fix...");
      const retryMemory = await runTests();

      if (retryMemory === true) {
        generateDashboard("PASS", "Recovered using memory");
        return;
      }
    }


    // =====================================================
    // STEP 3 — SMART HEALING
    // =====================================================
    console.log("\n🤖 Smart healing...");
    await fixTest(result);

    console.log("🔁 Re-running tests...");
    let retry = await runTests();


    // =====================================================
    // STEP 4 — AI HEALING (LAST RESORT)
    // =====================================================
    if (retry !== true) {

      console.log("\n🧠 AI Healing...");
      await aiFixTest(retry);

      console.log("🔁 Re-running after AI...");
      retry = await runTests();

      if (retry !== true) {

        console.log("❌ Still failing after AI");
        generateDashboard("FAIL", retry);

      } else {

        console.log("✅ Recovered using AI");
        generateDashboard("PASS", "Recovered using AI");

      }

    } else {

      console.log("✅ Recovered using smart healing");
      generateDashboard("PASS", "Recovered after smart healing");

    }

  } else {

    // =====================================================
    // TEST PASS FIRST TRY
    // =====================================================
    console.log("\n✅ Tests passed");
    generateDashboard("PASS", "All tests passed");

  }

  console.log("\n🏁 Agent finished");
}

main();
