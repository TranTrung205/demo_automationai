import { TestStep } from "./step-types";

export async function planSteps(
  goal: string,
  uiState: any
): Promise<TestStep[]> {

  const steps: TestStep[] = [];

  const pageName = uiState?.pageName || "UnknownPage";

  const elements = uiState?.elements || [];

  // 🔥 Simple rule-based planning (can replace with LLM later)

  if (goal.toLowerCase().includes("login")) {

    const username = findElement(elements, "input", "user");
    const password = findElement(elements, "input", "pass");
    const loginBtn = findElement(elements, "button", "login");

    if (username) {
      steps.push(createStep({
        id: "fill_username",
        description: "Enter username",
        action: "fill",
        target: username.selector,
        value: "standard_user",
        pageName
      }));
    }

    if (password) {
      steps.push(createStep({
        id: "fill_password",
        description: "Enter password",
        action: "fill",
        target: password.selector,
        value: "secret_sauce",
        pageName
      }));
    }

    if (loginBtn) {
      steps.push(createStep({
        id: "click_login",
        description: "Click login button",
        action: "click",
        target: loginBtn.selector,
        pageName
      }));
    }

    steps.push(createStep({
      id: "verify_login",
      description: "Verify inventory page visible",
      action: "assert",
      target: ".inventory_list",
      expected: "visible",
      pageName
    }));
  }

  return steps;
}

/**
 * Helper: create step with consistent meta
 */
function createStep(params: {
  id: string;
  description: string;
  action: any;
  target: string;
  value?: string;
  expected?: any;
  pageName: string;
}): TestStep {

  return {
    id: params.id,
    description: params.description,
    action: params.action,
    target: params.target,
    value: params.value,
    expected: params.expected,
    meta: {
      page: params.pageName,
      confidence: 0.9,
      source: "planner"
    }
  };
}

/**
 * Basic element matcher
 */
function findElement(
  elements: any[],
  type: string,
  keyword: string
) {

  return elements.find((el) =>
    el.type === type &&
    (
      el.label?.toLowerCase().includes(keyword) ||
      el.selector?.toLowerCase().includes(keyword)
    )
  );
}