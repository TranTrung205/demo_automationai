import { TestStep } from "../../brain/planner/step-types";

export interface HealResult {
  healed: boolean;
  steps: TestStep[];
}

/**
 * Simple locator healing strategy
 */
function healLocator(
  steps: TestStep[],
  error: string
): TestStep[] {

  const healed = [...steps];

  for (const step of healed) {

    if (step.target.includes("text=")) continue;

    // fallback to text locator
    if (step.description) {
      step.target = `text=${step.description}`;
    }
  }

  return healed;
}

/**
 * Main healer
 */
export function healSteps(
  steps: TestStep[],
  error: string
): HealResult {

  const lower = error.toLowerCase();

  /**
   * LOCATOR ERROR
   */
  if (
    lower.includes("locator") ||
    lower.includes("not found")
  ) {

    console.log("🩹 Healing locator...");

    const healed = healLocator(
      steps,
      error
    );

    return {
      healed: true,
      steps: healed
    };
  }

  /**
   * TIMEOUT
   */
  if (lower.includes("timeout")) {

    console.log("🩹 Healing timeout...");

    const extraWait: TestStep = {
      id: "heal-wait",
      description: "Wait for stability",
      action: "wait",
      target: "",
      value: "",
      expected: ""
    };

    return {
      healed: true,
      steps: [...steps, extraWait]
    };
  }

  return {
    healed: false,
    steps
  };
}