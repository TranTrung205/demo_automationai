import { chromium } from "@playwright/test";

/**
 * Scan DOM elements for AI
 */
export async function scanDOM(url: string): Promise<string> {

  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const dom = await page.evaluate(() => {

    const elements = Array.from(
      document.querySelectorAll("input, button, a, select, textarea")
    );

    return elements.map(el => {

      const element = el as HTMLElement;

      return {
        tag: element.tagName,

        id: element.id || null,

        name: element.getAttribute("name"),

        type: element.getAttribute("type"),

        placeholder: element.getAttribute("placeholder"),

        text: element.textContent?.trim(),

        class: element.className,

        "data-test": element.getAttribute("data-test"),

        aria: element.getAttribute("aria-label")
      };
    });

  });

  await browser.close();

  return JSON.stringify(dom, null, 2);
}