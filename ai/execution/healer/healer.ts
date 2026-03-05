import { Page } from "@playwright/test";

export async function healLocator(
  page: Page,
  element: any
): Promise<string | null> {

  console.log("🧠 AI attempting locator healing...");

  const nodes = await page.locator("*").all();

  for (const node of nodes) {

    const text = await node.innerText().catch(() => "");

    if (!text) continue;

    if (
      element?.description &&
      text.toLowerCase().includes(
        element.description.toLowerCase()
      )
    ) {

      const selector = await node.evaluate(el => {

        if (el.id) return `#${el.id}`;

        if (el.className)
          return "." + el.className.split(" ")[0];

        return el.tagName.toLowerCase();
      });

      console.log("✨ healed locator:", selector);

      return selector;
    }
  }

  return null;
}

export async function healAndRetry(
  page: Page,
  target: string,
  action: string,
  value: string | undefined,
  uiState: any,
  uiFile: any
): Promise<boolean> {

  const element = uiFile?.elements?.[target];

  if (!element) {
    console.log("⚠️ Cannot find element in UI map:", target);
    return false;
  }

  const healedSelector = await healLocator(page, element);

  if (!healedSelector) return false;

  console.log("🔁 Retrying with healed selector:", healedSelector);

  try {

    if (action === "click") {
      await page.locator(healedSelector).click();
    }

    if (action === "fill") {
      await page.locator(healedSelector).fill(value || "");
    }

    return true;

  } catch {
    return false;
  }
}