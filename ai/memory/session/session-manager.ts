import { chromium, Browser, Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;

export async function getSession() {

  if (!browser) {
    browser = await chromium.launch({ headless: false });
  }

  if (!page) {
    const context = await browser.newContext();
    page = await context.newPage();
  }

  return { browser, page };
}

export async function closeSession() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
}