/**
 * ==================================
 * AI JSON REPORTER V2 (FINAL)
 * ==================================
 *
 * Combines:
 * - Test result
 * - Duration
 * - Error
 * - Metadata steps (from StepTracker)
 *
 * Output:
 * reports/ai-report.json
 */

import fs from 'fs';
import path from 'path';
import {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';

import { StepTracker } from '../metadata/step-tracker';

class AIJsonReporter implements Reporter {

  private results: any[] = [];

  onTestBegin() {

    // Reset steps for new test
    StepTracker.reset();

  }

  onTestEnd(test: TestCase, result: TestResult) {

    const steps = StepTracker.getSteps();

    this.results.push({
      test: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message || null,
      steps
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
