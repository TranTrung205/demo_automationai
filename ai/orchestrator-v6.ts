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

  /**
   * Load memory
   */
  const memory = loadMemory();

  /**
   * Scan DOM
   */
  console.log("🔎 Scanning DOM...");
  const dom = await scanDOM("https://www.saucedemo.com");

  /**
   * Plan steps
   */
  const steps = await planSteps(
    instruction,
    dom,
    memory
  );

  console.log(`📋 Planner created ${steps.length} steps`);

  /**
   * Generate code for each step
   */
  const stepCodes: string[] = [];

  for (const step of steps) {

    console.log(`⚙️ Generating: ${step.description}`);

    const code = await generateStepCode(step);

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

    if (result.success) {

      console.log("\n🎉 TEST SUCCESS");

      /**
       * Save success memory
       */
      saveMemory({
        instruction,
        steps,
        success: true,
        timestamp: Date.now()
      });

      return;
    }

    /**
     * Failed → heal
     */
    const failedIndex =
      result.failedStepIndex !== undefined
        ? result.failedStepIndex
        : stepCodes.length - 1;

    console.log(`❌ Failed at step ${failedIndex + 1}`);

    console.log("🧠 Healing...");

    const healedCode = await healStep(
      stepCodes[failedIndex],
      result.output || ""
    );

    stepCodes[failedIndex] = healedCode;

    attempt++;
  }

  console.log("\n💥 TEST FAILED AFTER RETRIES");

  saveMemory({
    instruction,
    steps,
    success: false,
    timestamp: Date.now()
  });
}