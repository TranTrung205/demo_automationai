import { TestStep } from "../planner/step-types";

/**
 * Convert planner steps → Playwright test
 */
export function stepsToTestCode(
  steps: TestStep[]
): string {

  let body = "";

  for (const step of steps) {

    switch (step.action) {

      case "goto":

        body += `
  await page.goto('${step.target}');
`;
        break;

      case "click":

        body += `
  await page.getByText('${step.target}').click();
`;
        break;

      case "fill":

        body += `
  await page.getByLabel('${step.target}').fill('${step.value || ""}');
`;
        break;

      case "assert":

        body += `
  await expect(
    page.getByText('${step.expected || step.target}')
  ).toBeVisible();
`;
        break;

      case "wait":

        body += `
  await page.waitForTimeout(${step.value || 1000});
`;
        break;

      default:

        body += `
  // Unknown step: ${step.description}
`;
    }
  }

  return `
import { test, expect } from '@playwright/test';

test('AI Planned Test', async ({ page }) => {

${body}

});
`;
}