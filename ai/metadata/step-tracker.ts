/**
 * ==================================
 * STEP TRACKER
 * ==================================
 *
 * Collects execution steps for AI dataset.
 *
 * Example output:
 * [
 *   { action: "click", target: "#login-button" },
 *   { action: "fill", target: "#user-name" }
 * ]
 */

export interface AIStep {
  action: string;
  target?: string;
  value?: string;
  timestamp: number;
}

export class StepTracker {

  private static steps: AIStep[] = [];

  static addStep(step: AIStep) {

    this.steps.push(step);

  }

  static getSteps() {

    return this.steps;

  }

  static clear() {

    this.steps = [];

  }

}
