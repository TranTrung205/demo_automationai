import { Page } from "@playwright/test";

export interface DOMElementInfo {
  tag: string;
  id?: string;
  classes?: string[];
  text?: string;
  role?: string;
  name?: string;
}

export interface DOMSnapshot {
  url: string;
  title: string;
  elements: DOMElementInfo[];
}

export async function scanDOM(page: Page): Promise<DOMSnapshot> {

  const snapshot = await page.evaluate(() => {

    const elements = Array.from(document.querySelectorAll("button, input, a, select"));

    return {
      url: window.location.href,
      title: document.title,
      elements: elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || undefined,
        classes: el.className ? el.className.split(" ") : undefined,
        text: el.textContent?.trim() || undefined,
        role: el.getAttribute("role") || undefined,
        name: el.getAttribute("name") || undefined
      }))
    };

  });

  return snapshot;
}