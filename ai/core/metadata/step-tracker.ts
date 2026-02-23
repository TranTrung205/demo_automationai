export interface AIStep {
  action: string;
  target?: string;
  value?: string;

  status?: "passed" | "failed";

  error?: string;

  attempt?: number;

  ai?: {
    confidence?: number;
    healed?: boolean;
    source?: "generator" | "healer" | "executor";
  };

  timestamp: number;
}

export class StepTracker {

  private static steps: AIStep[] = [];

  static addStep(step: AIStep) {
    this.steps.push({
      ...step,
      timestamp: step.timestamp || Date.now()
    });
  }

  static getSteps(): AIStep[] {
    return this.steps;
  }

  static reset() {
    this.steps = [];
  }

}