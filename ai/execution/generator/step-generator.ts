import { TestStep } from "../../brain/planner/step-types";

export function generateStepsCode(
  steps: TestStep[]
): string {

  let code = "";

  for (const step of steps) {

    switch (step.action) {

      case "goto":
        code += `await page.goto("${step.target}");\n`;
        break;

      case "click":
        code += `await page.locator("${step.target}").click();\n`;
        break;

      case "fill":
        code += `await page.locator("${step.target}").fill("${step.value}");\n`;
        break;

      case "assert":
        code += `await expect(page.locator("${step.target}")).toBeVisible();\n`;
        break;

      case "wait":
        code += `await page.waitForTimeout(1000);\n`;
        break;
    }
  }

  return code;
}