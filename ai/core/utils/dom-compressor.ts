// ai/core/utils/dom-compressor.ts

import { Page } from "@playwright/test";
import { normalizeText } from "./normalize";

export interface CompressedDOM {
  text: string;
  interactiveElements: string[];
  hash: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export async function compressDOM(page: Page): Promise<CompressedDOM> {
  const result = await page.evaluate(() => {
    const interactiveSelectors = [
      "button",
      "a",
      "input",
      "select",
      "textarea",
      "[role='button']",
      "[data-testid]"
    ];

    const elements: string[] = [];

    interactiveSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const text =
          (el as HTMLElement).innerText ||
          (el as HTMLInputElement).value ||
          el.getAttribute("aria-label") ||
          el.getAttribute("data-testid") ||
          "";

        if (text.trim().length > 0) {
          elements.push(`${selector}: ${text.trim()}`);
        }
      });
    });

    const visibleText = document.body.innerText;

    return {
      visibleText,
      elements
    };
  });

  const normalizedText = normalizeText(result.visibleText);

  return {
    text: normalizedText.slice(0, 8000), // prevent LLM overload
    interactiveElements: result.elements.slice(0, 200),
    hash: simpleHash(normalizedText)
  };
}