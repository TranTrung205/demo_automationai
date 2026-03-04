import { Page, expect } from "@playwright/test";

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
