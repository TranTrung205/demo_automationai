import { planSteps } from "./planner/ai-planner";
import { generateStepCode } from "./generator/step-generator";
import { executeSteps } from "./executor/executor";
import { healStep } from "./healer/healer";
import { scanDOM } from "./scanner/dom-scanner";

import { loadMemory, saveMemory } from "./memory/memory";

/**
 * Instruction → self-healing execution
 */
export async function runTestV6(instruction: string) {

  console.log("🚀 V6 Agent Started");
  console.log("📝 Instruction:", instruction);

  try {

    /**
     * Load memory
     */
    console.log("📂 Loading memory...");
    const memory = await loadMemory();

    /**
     * Scan DOM
     */
    console.log("🔎 Scanning DOM...");
    const domObject = await scanDOM("https://www.saucedemo.com");

    const dom = JSON.stringify(domObject, null, 2);

    /**
     * Plan steps
     */
    console.log("🧠 Planning steps...");
    const steps = await planSteps(
      instruction,
      dom,
      memory
    );

    if (!steps || !steps.length) {
      throw new Error("Planner returned empty steps");
    }

    console.log(`📋 Planner created ${steps.length} steps`);

    /**
     * ⭐ FIX — SHOW STEP INDEX CLEARLY
     */
    steps.forEach((step, index) => {
      console.log(
        `➡️ Step ${index + 1}: ${step.action} ${step.target || ""}`
      );
    });

    /**
     * Generate code for each step
     */
    const stepCodes: string[] = [];

    for (let i = 0; i < steps.length; i++) {

      const step = steps[i];

      console.log(
        `⚙️ Generating Step ${i + 1}: ${step.description || step.action}`
      );

      const code = await generateStepCode(step);

      if (!code) {
        throw new Error("Step generator returned empty code");
      }

      stepCodes.push(code);
    }

    /**
     * Execute with healing loop
     */
    let attempt = 0;
    const MAX_ATTEMPT = 3;

    while (attempt < MAX_ATTEMPT) {

      console.log(`\n🚀 Execution Attempt ${attempt + 1}`);

      const result: any = await executeSteps(stepCodes);

      if (result?.success) {

        console.log("\n🎉 TEST SUCCESS");

        /**
         * Save success memory
         */
        await saveMemory({
          instruction,
          steps,
          success: true,
          timestamp: Date.now()
        });

        return;
      }

      /**
       * ⭐ FIX FAILED STEP INDEX
       * executor returns: failedIndex
       */
      const failedIndex =
        result?.failedIndex !== undefined
          ? result.failedIndex
          : stepCodes.length - 1;

      console.log(`❌ Failed at step ${failedIndex + 1}`);

      console.log("🧠 Healing step...");

      const healedCode = await healStep(
        stepCodes[failedIndex],
        result?.output || "Unknown error"
      );

      if (!healedCode) {
        console.log("⚠️ Healing returned empty — skipping");
        attempt++;
        continue;
      }

      stepCodes[failedIndex] = healedCode;

      attempt++;
    }

    /**
     * FAIL FINAL
     */
    console.log("\n💥 TEST FAILED AFTER RETRIES");

    await saveMemory({
      instruction,
      steps,
      success: false,
      timestamp: Date.now()
    });

  } catch (err) {

    console.error("\n💥 V6 run crashed");
    console.error(err);
  }
}