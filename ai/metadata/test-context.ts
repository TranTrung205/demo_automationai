/**
 * ==================================
 * TEST CONTEXT
 * ==================================
 *
 * Stores metadata for current test run.
 */

import { StepTracker } from './step-tracker';

export class TestContext {

  static startTest(testName: string) {

    StepTracker.clear();

    console.log(`🧠 AI Test Start: ${testName}`);

  }

  static endTest() {

    const steps = StepTracker.getSteps();

    return {
      steps
    };

  }

}
