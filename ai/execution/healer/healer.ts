import type { Page } from "@playwright/test";
import type { TestStep } from "../../brain/planner/step-types";

/**
 * ===============================
 * RUNTIME HEALING (Playwright level)
 * ===============================
 */

type UIElement = {
  selector: string;
  type?: string;
};

type UIFile = {
  pageName: string;
  elements: Record<string, UIElement>;
};

export async function healAndRetry(
  page: Page,
  failedSelector: string,
  action: string,
  value: string | undefined,
  uiState: any,
  uiFile: UIFile
): Promise<boolean> {

  const candidates = uiState?.elements || [];

  const match = candidates.find(
    (el: any) =>
      el.selector !== failedSelector &&
      el.type === inferTypeFromAction(action)
  );

  if (!match) return false;

  try {
    await executeAction(page, action, match.selector, value);

    Object.keys(uiFile.elements).forEach((key) => {
      if (uiFile.elements[key].selector === failedSelector) {
        uiFile.elements[key].selector = match.selector;
      }
    });

    return true;

  } catch {
    return false;
  }
}

/**
 * ===============================
 * STRATEGIC HEALING (AI level)
 * ===============================
 */

export function healSteps(
  steps: TestStep[],
  errorOutput: string
): { healed: boolean; steps: TestStep[] } {

  let healed = false;

  const updatedSteps: TestStep[] = steps.map(step => {

    if (errorOutput.includes(step.target)) {
      healed = true;

      return {
        ...step,
        target: step.target.replace("button", "btn"),
        meta: {
          ...step.meta,
          source: "healer"
        }
      };
    }

    return step;
  });

  return { healed, steps: updatedSteps };
}

/**
 * Helpers
 */

function inferTypeFromAction(action: string) {
  if (action === "click") return "button";
  if (action === "fill") return "input";
  return "unknown";
}

async function executeAction(
  page: Page,
  action: string,
  selector: string,
  value?: string
) {
  switch (action) {
    case "click":
      await page.click(selector);
      break;
    case "fill":
      await page.fill(selector, value || "");
      break;
    case "assert":
      await page.waitForSelector(selector, { state: "visible" });
      break;
  }
}