import { evaluateFailure } from "../brain/evaluator/ai-evaluator";
import { healSteps } from "../execution/healer/healer";
import { generateTest } from "../execution/generator/test/test-generator";
import type { TestStep } from "../brain/planner/step-types";

export interface FixResult {
  fixed: boolean;
  regenerated: boolean;
  aborted?: boolean;
  strategy?: string;
  confidence?: number;
  steps: TestStep[];
  filePath?: string;
}

export async function fixTest(
  steps: TestStep[],
  errorOutput: string,
  testName: string
): Promise<FixResult> {

  console.log("🧠 Fixer analyzing failure...");

  const evaluation = evaluateFailure(errorOutput);

  console.log("📊 Category:", evaluation.category);
  console.log("🩹 Strategy:", evaluation.strategy);
  console.log("🎯 Confidence:", evaluation.confidence);

  /**
   * HARD ABORT
   */
  if (evaluation.strategy === "abort") {
    console.log("⛔ Critical failure. Aborting autonomous recovery.");

    return {
      fixed: false,
      regenerated: false,
      aborted: true,
      strategy: "abort",
      confidence: evaluation.confidence,
      steps
    };
  }

  /**
   * LOW CONFIDENCE → safer to replan
   */
  if (evaluation.confidence < 40) {
    console.log("⚠️ Low confidence → Regenerating test");

    const generated = await generateTest(steps, testName);

    return {
      fixed: true,
      regenerated: true,
      strategy: "low-confidence-regenerate",
      confidence: evaluation.confidence,
      steps,
      filePath: generated.filePath
    };
  }

  /**
   * HEAL STRATEGY
   */
  if (
    evaluation.strategy === "heal-locator" ||
    evaluation.strategy === "wait-retry" ||
    evaluation.strategy === "vision-heal"
  ) {

    const heal = healSteps(steps, errorOutput);

    if (heal.healed) {

      console.log("🩹 Steps healed → regenerating test");

      const generated = await generateTest(
        heal.steps,
        testName
      );

      return {
        fixed: true,
        regenerated: true,
        strategy: evaluation.strategy,
        confidence: evaluation.confidence,
        steps: heal.steps,
        filePath: generated.filePath
      };
    }

    console.log("❌ Healing failed → fallback to regenerate");
  }

  /**
   * REPLAN STRATEGY
   */
  if (evaluation.strategy === "replan") {

    console.log("🔁 Replanning → Regenerating test");

    const generated = await generateTest(
      steps,
      testName
    );

    return {
      fixed: true,
      regenerated: true,
      strategy: "replan",
      confidence: evaluation.confidence,
      steps,
      filePath: generated.filePath
    };
  }

  /**
   * FALLBACK
   */
  console.log("❌ No valid recovery strategy worked.");

  return {
    fixed: false,
    regenerated: false,
    strategy: "none",
    confidence: evaluation.confidence,
    steps
  };
}