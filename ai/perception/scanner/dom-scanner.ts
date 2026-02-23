import { Page } from "playwright";

export async function scanDOM(page: Page) {

  if (!page) {
    console.error("❌ scanDOM: page undefined");
    return [];
  }

  try {

    await page.waitForLoadState("domcontentloaded");

    const jsCode = `
      (() => {

        function getSelector(el) {

          if (el.id) return "#" + el.id;

          if (el.className)
            return el.tagName.toLowerCase() + "." +
              el.className.toString().replace(/\\s+/g, ".");

          return el.tagName.toLowerCase();
        }

        const elements = Array.from(
          document.querySelectorAll("input,button,a,select")
        );

        return elements.map(el => ({
          tag: el.tagName,
          text: el.innerText || "",
          placeholder: el.placeholder || "",
          id: el.id || "",
          class: el.className || "",
          selector: getSelector(el)
        }));

      })();
    `;

    const dom: any[] = await page.evaluate(jsCode);

    console.log("✅ DOM scanned:", dom?.length || 0, "elements");

    return dom || [];

  } catch (err) {

    console.error("❌ DOM scan error:", err);

    return [];
  }
}