/**
 * ==================================
 * AI JSON REPORTER
 * ==================================
 *
 * Converts Playwright test results into
 * structured dataset for AI training.
 *
 * Output:
 * reports/ai-report.json
 */

import fs from 'fs';
import path from 'path';
import {
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  Reporter
} from '@playwright/test/reporter';

class AIJsonReporter implements Reporter {

  private results: any[] = [];

  onTestEnd(test: TestCase, result: TestResult) {

    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message || null,
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

    console.log('✅ AI Report Generated:', filePath);

  }

}

export default AIJsonReporter;
