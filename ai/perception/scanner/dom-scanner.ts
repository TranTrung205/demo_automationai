import { Page } from "@playwright/test";


export interface ElementInfo {
  tag: string;
  text: string;
  id?: string;
  class?: string;
  placeholder?: string;
  name?: string;
  role?: string;
}


export interface ScanResult {
  url: string;
  title: string;
  elements: ElementInfo[];
}


/**
 * Extract visible UI elements from page
 * Optimized for LLM consumption
 */
export async function scanDOM(
  page: Page
): Promise<ScanResult> {

  const result = await page.evaluate(() => {

    function getText(el: Element): string {
      return (el.textContent || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 120);
    }

    const nodes = Array.from(
      document.querySelectorAll(
        "button, input, a, select, textarea, [role='button']"
      )
    );

    const elements = nodes.map((el: any) => ({

      tag: el.tagName?.toLowerCase(),

      text: getText(el),

      id: el.id || "",

      class: el.className || "",

      placeholder: el.placeholder || "",

      name: el.name || "",

      role: el.getAttribute?.("role") || ""

    }));

    return {
      url: location.href,
      title: document.title,
      elements
    };

  });

  return result;
}