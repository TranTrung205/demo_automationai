import { Page } from "@playwright/test";
import { TestStep } from "../../brain/planner/step-types";
import { healAndRetry } from "../healer/healer";
import { rememberSuccess, rememberFailure } from "../../brain/planner/planner-memory";

export async function executeStep(
  page: Page,
  step: TestStep,
  uiState?: any,
  uiFile?: any
) {

  console.log(`👉 ${step.id || step.action} → ${step.target}`);

  try {

    await runAction(page, step);

    rememberSuccess(step);

  } catch (error) {

    console.log("❌ Step failed:", step.target);

    rememberFailure(step.id || step.target);

    if (!uiState || !uiFile) {
      console.log("⚠️ No healer context provided");
      throw error;
    }

    const healed = await healAndRetry(
      page,
      step.target,
      step.action,
      step.value,
      uiState,
      uiFile
    );

    if (!healed) {
      console.log("💥 Healing failed");
      throw error;
    }

    console.log("✅ Healed successfully, continuing...");
  }
}

/**
 * =====================================
 * RUN ACTION
 * =====================================
 */

async function runAction(page: Page, step: TestStep) {

  const timeout = step.timeout || 5000;

  switch (step.action) {

    case "goto":
      await page.goto(step.target, { timeout });
      break;

    case "click":
      await page.locator(step.target).click({ timeout });
      break;

    case "fill":
      await page.locator(step.target).fill(step.value || "", { timeout });
      break;

    case "select":
      await page.locator(step.target).selectOption(step.value || "");
      break;

    case "hover":
      await page.locator(step.target).hover({ timeout });
      break;

    case "press":
      await page.locator(step.target).press(step.value || "");
      break;

    case "wait":
      await page.waitForTimeout(step.timeout || 1000);
      break;

    case "assert":
      await page.waitForSelector(step.target, { timeout });
      break;

    default:
      console.log("⚠️ Unsupported action:", step.action);
  }
}