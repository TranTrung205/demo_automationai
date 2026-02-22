import { Page, expect } from "@playwright/test";
import { TestStep } from "../planner/step-types";

/**
 * Execute single step
 */
export async function runStep(page: Page, step: TestStep) {

  console.log(`➡️ ${step.id} — ${step.description}`);

  switch (step.action) {

    case "goto":

      if (!step.target) throw new Error("Missing URL");

      await page.goto(step.target);
      break;


    case "click":

      await page.getByText(step.target!, { exact: false }).click();
      break;


    case "fill":

      await page.getByLabel(step.target!).fill(step.value || "");
      break;


    case "wait":

      await page.waitForTimeout(Number(step.value) || 1000);
      break;


    case "assert":

      await expect(
        page.getByText(step.expected || step.target!)
      ).toBeVisible();
      break;


    default:

      throw new Error(`Unknown action: ${step.action}`);
  }

}