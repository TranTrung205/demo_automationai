import { TestStep } from "../../brain/planner/step-types";

export interface StepResult {

  step: TestStep;

  success: boolean;

  error?: string;

  duration: number;

  timestamp: number;
}


export class StepTracker {

  private history: StepResult[] = [];

  startTime: number = 0;

  start() {
    this.startTime = Date.now();
  }

  record(
    step: TestStep,
    success: boolean,
    error?: string
  ) {

    const result: StepResult = {

      step,
      success,
      error,
      duration: Date.now() - this.startTime,
      timestamp: Date.now()

    };

    this.history.push(result);
  }

  getHistory(): StepResult[] {
    return this.history;
  }

  getLastError(): string | undefined {

    const failed = this.history
      .slice()
      .reverse()
      .find(s => !s.success);

    return failed?.error;
  }
}