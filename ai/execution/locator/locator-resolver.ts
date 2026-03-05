import { Page } from "@playwright/test";

export async function resolveLocator(
  page: Page,
  element: any
): Promise<string> {

  if (!element) {
    throw new Error("❌ Element is undefined");
  }

  // nếu element là selector string
  if (typeof element === "string") {

    if (element === "AUTO_DETECT") {
      throw new Error("❌ AUTO_DETECT cannot be used without description");
    }

    return element;
  }

  // nếu element object có primary selector
  if (element.primary && element.primary !== "AUTO_DETECT") {
    return element.primary;
  }

  // AI fallback mapping
  const description = element.description;

  const fallbackSelectors: Record<string, string> = {

    username: "#user-name",
    password: "#password",
    loginButton: "#login-button",
    inventoryList: ".inventory_list",

  };

  const selector = fallbackSelectors[description];

  if (selector) {
    console.log(
      "🧠 AI resolved locator:",
      description,
      "→",
      selector
    );
    return selector;
  }

  throw new Error(
    "❌ AI could not resolve selector for: " + description
  );
}