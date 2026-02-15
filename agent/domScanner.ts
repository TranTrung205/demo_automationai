import { chromium } from "playwright";

export async function scanDOM(url: string) {

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const data = await page.evaluate(() => {

    const buttons = Array.from(document.querySelectorAll("button"));
    const inputs = Array.from(document.querySelectorAll("input"));
    const links = Array.from(document.querySelectorAll("a"));

    return {

      buttons: buttons.map((b: any) => ({
        text: b.innerText,
        id: b.id,
        class: b.className,
        type: b.type,
      })),

      inputs: inputs.map((i: any) => ({
        id: i.id,
        name: i.name,
        placeholder: i.placeholder,
        type: i.type,
        class: i.className,
      })),

      links: links.map((l: any) => ({
        text: l.innerText,
        href: l.href,
      })),

    };
  });

  await browser.close();

  return data;
}
