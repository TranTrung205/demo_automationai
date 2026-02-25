import fs from "fs/promises";
import path from "path";
import { TestStep } from "../../brain/planner/step-types";
import { generateStepsCode } from "./step-generator";

export interface GeneratedTest {
  filePath: string;
  code: string;
}

/**
 * Generate Playwright test file
 */
export async function generateTest(
  steps: TestStep[],
  name: string = "ai-test"
): Promise<GeneratedTest> {

  const stepsCode = generateStepsCode(steps);

  const code = `
import { test, expect } from '@playwright/test';

test('${name}', async ({ page }) => {

${stepsCode}

});
`;

  const filePath = path.join(
    "tests",
    `${name}.spec.ts`
  );

  await fs.writeFile(filePath, code);

  console.log("📝 Test generated:", filePath);

  return {
    filePath,
    code
  };
}