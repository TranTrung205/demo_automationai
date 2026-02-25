import { Page } from "@playwright/test";
import { TestStep } from "../../brain/planner/step-types";

export async function executeStep(
  page: Page,
  step: TestStep
) {

  console.log(`👉 ${step.description}`);

  switch (step.action) {

    case "goto":
      await page.goto(step.target);
      break;

    case "click":
      await page.locator(step.target).click();
      break;

    case "fill":
      await page.locator(step.target).fill(step.value || "");
      break;

    case "assert":
      await page.waitForSelector(step.target);
      break;

    case "wait":
      await page.waitForTimeout(1000);
      break;

    default:
      console.log("⚠️ Unknown action:", step.action);
  }
}