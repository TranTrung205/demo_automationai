import fs from "fs/promises";
import path from "path";

const BASE_PAGE_PATH = path.join(
  process.cwd(),
  "pages",
  "base",
  "BasePage.ts"
);

export async function generateBasePageIfNotExists() {
  try {
    await fs.access(BASE_PAGE_PATH);
    console.log("📦 BasePage already exists");
    return;
  } catch {
    console.log("🧱 Generating BasePage...");
  }

  const content = `import { Page, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 🌍 Navigate
  async goto(url: string) {
    await this.page.goto(url);
  }

  // 🖱 Click
  async click(selector: string) {
    await this.page.locator(selector).click();
  }

  // ✏️ Fill
  async fill(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  // 👀 Expect visible
  async expectVisibleSelector(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  // 📝 Expect text
  async expectText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  // ⏳ Wait for selector
  async waitForVisible(selector: string) {
    await this.page.locator(selector).waitFor({ state: "visible" });
  }

  // 🔍 Get text
  async getText(selector: string) {
    return await this.page.locator(selector).innerText();
  }
}
`;

  await fs.mkdir(path.dirname(BASE_PAGE_PATH), { recursive: true });
  await fs.writeFile(BASE_PAGE_PATH, content);

  console.log("✅ BasePage generated at:", BASE_PAGE_PATH);
}