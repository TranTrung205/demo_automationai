import fs from 'fs';
import path from 'path';
import {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';

import { StepTracker } from '../metadata/step-tracker';
import { detectErrorType } from '../analyzer/error-analyzer';

class AIJsonReporter implements Reporter {

  private results: any[] = [];

  onTestBegin() {
    StepTracker.reset();
  }

  onTestEnd(test: TestCase, result: TestResult) {

    const steps = StepTracker.getSteps();

    const errorMessage = result.error?.message || null;

    const errorType = errorMessage
      ? detectErrorType(errorMessage)
      : null;

    this.results.push({
      test: test.title,
      status: result.status,
      duration: result.duration,

      error: errorMessage,
      errorType,

      steps,

      timestamp: Date.now(),

      agent: {
        version: "V5",
        framework: "Playwright AI",
      }
    });

  }

  async onEnd() {

    const reportDir = path.join(process.cwd(), 'reports');

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    const filePath = path.join(reportDir, 'ai-report.json');

    fs.writeFileSync(
      filePath,
      JSON.stringify(this.results, null, 2)
    );

    console.log('✅ AI Dataset Generated:', filePath);

  }

}

export default AIJsonReporter;