import { chromium } from "playwright";
import { scanDOM } from "./dom-scanner";

async function main() {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto("https://www.saucedemo.com");

  const scan = await scanDOM(page);

  console.log("\n===== DOM SCAN RESULT =====\n");

  console.log(JSON.stringify(scan, null, 2));

  await browser.close();
}

main();