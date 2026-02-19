/**
 * ==================================
 * STEP TRACKER (FINAL V2)
 * ==================================
 *
 * Collects execution steps for AI dataset.
 *
 * Example:
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

  /**
   * Add new step
   */
  static addStep(step: AIStep) {
    this.steps.push(step);
  }

  /**
   * Get all steps
   */
  static getSteps(): AIStep[] {
    return this.steps;
  }

  /**
   * Reset steps (used between tests)
   */
  static reset() {
    this.steps = [];
  }

}
