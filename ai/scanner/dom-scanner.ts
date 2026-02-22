import { chromium } from "playwright";
import { compressDOM } from "../utils/dom-compressor";

export async function scanDOM(url: string) {

  const browser = await chromium.launch({
    headless: true
  });

  try {

    const page = await browser.newPage();

    console.log("🌐 Navigating:", url);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // small wait for dynamic UI
    await page.waitForTimeout(1000);

    /**
     * Use string evaluation to avoid TSX helper injection (__name bug)
     */
    const elements = await page.evaluate(`
      (() => {

        function getElementInfo(el) {
          return {
            tag: el.tagName?.toLowerCase(),
            id: el.id || "",
            text: (el.innerText || "").slice(0, 120),
            name: el.getAttribute("name") || "",
            type: el.getAttribute("type") || "",
            placeholder: el.getAttribute("placeholder") || "",
            role: el.getAttribute("role") || ""
          };
        }

        const elements = Array.from(
          document.querySelectorAll(
            "input,button,a,select,textarea"
          )
        );

        return elements.map(getElementInfo);

      })()
    `) as any[];   // ⭐ FIX TYPE ERROR HERE

    console.log(`🔎 DOM elements found: ${elements.length}`);

    /**
     * Compress for LLM
     */
    const compressed = compressDOM(elements);

    console.log(`🧠 DOM compressed: ${compressed.length}`);

    return compressed;

  } catch (err: any) {

    console.log("❌ DOM scan error:", err.message);

    return [];

  } finally {

    await browser.close();

  }
}