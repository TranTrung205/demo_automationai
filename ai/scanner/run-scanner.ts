import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { scanDOM } from "./dom-scanner.js";

const OUTPUT_FILE = "dom/dom.json";

export async function runScanner(url: string) {

  console.log("🔍 Scanning DOM:", url);

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {

    await page.goto(url, {
      waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(2000);

    const dom = await scanDOM(page);

    const dir = path.dirname(OUTPUT_FILE);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, dom);

    console.log("✅ DOM saved:", OUTPUT_FILE);

  } catch (err: any) {

    console.error("❌ Scanner failed:", err.message);

  } finally {

    await browser.close();

  }
}


// CLI mode
const url = process.argv[2] || "https://www.saucedemo.com";

runScanner(url);