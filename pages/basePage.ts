import { Page } from '@playwright/test';
import { StepTracker } from '../ai/metadata/step-tracker';

export class BasePage {

  constructor(protected page: Page) {}

  async click(selector: string) {

    StepTracker.addStep({
      action: 'click',
      target: selector,
      timestamp: Date.now()
    });

    await this.page.click(selector);

  }

  async fill(selector: string, value: string) {

    StepTracker.addStep({
      action: 'fill',
      target: selector,
      value,
      timestamp: Date.now()
    });

    await this.page.fill(selector, value);

  }

}
