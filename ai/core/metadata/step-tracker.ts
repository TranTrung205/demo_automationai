import { TestStep } from "../../brain/planner/step-types";
import { ErrorCategory } from "../../brain/analyzer/error-analyzer";
import { HealStrategy } from "../../brain/evaluator/ai-evaluator";

export interface StepResult {
  step: TestStep;

  success: boolean;

  error?: string;

  errorCategory?: ErrorCategory;

  strategyUsed?: HealStrategy;

  healed?: boolean;

  retries?: number;

  duration: number;

  timestamp: number;

  confidence?: number;
}

export class StepTracker {
  private history: StepResult[] = [];

  private stepStartTime: number = 0;

  startStep() {
    this.stepStartTime = Date.now();
  }

  record(result: Omit<StepResult, "duration" | "timestamp">) {
    const finalResult: StepResult = {
      ...result,
      duration: Date.now() - this.stepStartTime,
      timestamp: Date.now(),
    };

    this.history.push(finalResult);
  }

  getHistory(): StepResult[] {
    return this.history;
  }

  getLastError(): StepResult | undefined {
    return [...this.history].reverse().find(s => !s.success);
  }

  getFailureCount(): number {
    return this.history.filter(s => !s.success).length;
  }

  getHealCount(): number {
    return this.history.filter(s => s.healed).length;
  }

  getAverageDuration(): number {
    if (!this.history.length) return 0;

    const total = this.history.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    return Math.round(total / this.history.length);
  }

  getConfidenceScore(): number {
    if (!this.history.length) return 100;

    let score = 100;

    for (const step of this.history) {
      if (!step.success) score -= 10;
      if (step.healed) score -= 5;
      if (step.retries && step.retries > 1) score -= 3;
    }

    return Math.max(0, score);
  }
}