import fs from 'fs';
import path from 'path';
import { StepTracker } from '../metadata/step-tracker';

export class AIGenerator {

  /**
   * Convert tracked steps → Playwright test code
   */
  static generateTestCode(testName: string = 'AI Generated Test'): string {

    const steps = StepTracker.getSteps();

    const actions: string[] = [];

    for (const step of steps) {

      switch (step.action) {

        case 'goto':
          actions.push(`await page.goto('${step.target}');`);
          break;

        case 'click':
          actions.push(`await page.click('${step.target}');`);
          break;

        case 'fill':
          actions.push(
            `await page.fill('${step.target}', '${step.value ?? ''}');`
          );
          break;

        case 'api_get':
          actions.push(`await request.get('${step.target}');`);
          break;

        case 'api_post':
          actions.push(
            `await request.post('${step.target}', { data: ${step.value ?? '{}'} });`
          );
          break;

        case 'api_put':
          actions.push(
            `await request.put('${step.target}', { data: ${step.value ?? '{}'} });`
          );
          break;

        case 'api_delete':
          actions.push(`await request.delete('${step.target}');`);
          break;

        default:
          actions.push(`// Unknown step: ${step.action}`);
      }

    }

    return `
import { test, expect } from '@playwright/test';

test('${testName}', async ({ page, request }) => {

  ${actions.join('\n  ')}

});
`;
  }

  /**
   * Save generated test to file
   */
  static saveToFile(fileName: string = 'ai-generated.spec.ts') {

    const code = this.generateTestCode();

    const outputDir = path.resolve(process.cwd(), 'tests/generated');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, code);

    console.log('✅ AI Test generated at:', filePath);

  }

}
