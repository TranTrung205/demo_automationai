import { Page } from "@playwright/test";

export async function scanDOM(page: Page) {
  const elements = await page.evaluate(() => {
    const interactive = Array.from(
      document.querySelectorAll("button, input, a, select")
    );

    return interactive.map(el => ({
      tag: el.tagName,
      text: el.textContent,
      id: el.id,
      class: el.className
    }));
  });

  return JSON.stringify(elements, null, 2);
}
