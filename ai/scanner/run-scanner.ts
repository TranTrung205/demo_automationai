import { chromium } from "@playwright/test";
import fs from "fs";
import { scanDOM } from "./dom-scanner";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://www.saucedemo.com");

  const dom = await scanDOM(page);

  fs.writeFileSync("dom.json", dom);

  console.log("✅ DOM saved to dom.json");

  await browser.close();
}

main();