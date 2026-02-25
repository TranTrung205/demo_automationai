import { evaluateFailure } from "../brain/evaluator/ai-evaluator";
import { healSteps } from "../execution/healer/healer";
import { generateTest } from "../execution/generator/ai-generator";
import { TestStep } from "../brain/planner/step-types";

export interface FixResult {
  fixed: boolean;
  regenerated: boolean;
  steps: TestStep[];
  filePath?: string;
}

/**
 * AI Fixer Orchestrator
 *
 * Decide:
 *  - heal locator
 *  - add wait
 *  - regenerate test
 */
export async function fixTest(
  steps: TestStep[],
  errorOutput: string,
  testName: string
): Promise<FixResult> {

  console.log("🧠 Fixer analyzing failure...");

  const evaluation = evaluateFailure(errorOutput);

  console.log("📊 Failure type:", evaluation.type);
  console.log("🩹 Strategy:", evaluation.strategy);

  /**
   * STRATEGY: HEAL LOCATOR / TIMEOUT
   */
  if (
    evaluation.strategy === "heal-locator" ||
    evaluation.strategy === "wait-retry"
  ) {

    const heal = healSteps(
      steps,
      errorOutput
    );

    if (heal.healed) {

      console.log("🩹 Steps healed → regenerating test");

      const generated = await generateTest(
        heal.steps,
        testName
      );

      return {
        fixed: true,
        regenerated: true,
        steps: heal.steps,
        filePath: generated.filePath
      };
    }
  }

  /**
   * STRATEGY: FULL REGENERATE
   */
  if (evaluation.strategy === "regenerate") {

    console.log("🔁 Regenerating test from scratch...");

    const generated = await generateTest(
      steps,
      testName
    );

    return {
      fixed: true,
      regenerated: true,
      steps,
      filePath: generated.filePath
    };
  }

  /**
   * NOTHING WORKED
   */
  return {
    fixed: false,
    regenerated: false,
    steps
  };
}