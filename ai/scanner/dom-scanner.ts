import fs from "fs";
import path from "path";
import { chromium } from "@playwright/test";

const DOM_DIR = path.join(process.cwd(), "dom");
const DOM_FILE = path.join(DOM_DIR, "dom.json");

export async function scanDOM(url: string): Promise<string> {

  if (!fs.existsSync(DOM_DIR)) {
    fs.mkdirSync(DOM_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const result = await page.evaluate(() => {

    function isVisible(el: HTMLElement) {

      const style = window.getComputedStyle(el);

      return (
        style &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0
      );
    }

    function getAccessibleName(el: HTMLElement): string | null {

      if (el.getAttribute("aria-label")) {
        return el.getAttribute("aria-label");
      }

      if (el.textContent) {
        const text = el.textContent.trim();
        if (text.length > 0) return text;
      }

      if (el.getAttribute("placeholder")) {
        return el.getAttribute("placeholder");
      }

      return null;
    }

    const nodes = Array.from(
      document.querySelectorAll(
        "button, input, a, select, textarea"
      )
    );

    const elements = nodes.map((el: any) => {

      const visible = isVisible(el);

      const name = getAccessibleName(el);

      return {
        tag: el.tagName.toLowerCase(),
        name,
        text: el.textContent?.trim() || null,
        id: el.id || null,
        class: el.className || null,
        type: el.getAttribute("type"),
        role: el.getAttribute("role"),
        ariaLabel: el.getAttribute("aria-label"),
        placeholder: el.getAttribute("placeholder"),

        visible,

        selectors: {
          role: el.getAttribute("role"),
          text: el.textContent?.trim() || null,
          label: el.getAttribute("aria-label") || null,
          css: el.id ? `#${el.id}` : null
        }
      };
    });

    return {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      elements
    };
  });

  await browser.close();

  fs.writeFileSync(
    DOM_FILE,
    JSON.stringify(result, null, 2)
  );

  console.log("✅ DOM saved:", DOM_FILE);

  return DOM_FILE;
}