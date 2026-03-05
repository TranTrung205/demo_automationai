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
import { resolveLocator } from "../../ai/execution/locator/locator-resolver";

export class BasePage {

  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  private async getSelector(element: any) {

    if (!element) {
      throw new Error("❌ Element config missing");
    }

    const selector = await resolveLocator(
      this.page,
      element
    );

    if (!selector) {
      throw new Error(
        "❌ Unable to resolve selector for element: " +
        JSON.stringify(element)
      );
    }

    return selector;
  }

  async click(element: any) {

    const selector = await this.getSelector(element);

    await this.page.locator(selector).click();
  }

  async fill(element: any, value: string) {

    const selector = await this.getSelector(element);

    await this.page.locator(selector).fill(value);
  }

  async expectVisibleSelector(element: any) {

    const selector = await this.getSelector(element);

    await expect(
      this.page.locator(selector)
    ).toBeVisible();
  }

  async expectText(element: any, text: string) {

    const selector = await this.getSelector(element);

    await expect(
      this.page.locator(selector)
    ).toContainText(text);
  }

}
`;

  await fs.mkdir(path.dirname(BASE_PAGE_PATH), { recursive: true });

  await fs.writeFile(BASE_PAGE_PATH, content);

  console.log("✅ BasePage generated:", BASE_PAGE_PATH);
}