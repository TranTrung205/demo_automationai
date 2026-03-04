import fs from "fs/promises";
import path from "path";

function normalizeName(name: string): string {
  return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

export async function generatePageObject(
  testName: string
) {
  const cleanName = normalizeName(testName);
  const className = `${cleanName}Page`;
  const uiName = `${cleanName}UI`;

  const filePath = path.join(
    process.cwd(),
    "pages",
    "ai_generated",
    "pom",
    `${className}.ts`
  );

  const content = `import { BasePage } from "../../base/BasePage";
import { ${uiName} } from "../ui/${cleanName}.ui";

export class ${className} extends BasePage {

  async performAction(
    selectorKey: string,
    value?: string
  ) {

    const selector = ${uiName}.elements[selectorKey];

    if (!selector) {
      throw new Error("Invalid selector key: " + selectorKey);
    }

    if (value) {
      await this.fill(selector, value);
    } else {
      await this.click(selector);
    }
  }

  async expectVisible(selectorKey: string) {
    const selector = ${uiName}.elements[selectorKey];

    if (!selector) {
      throw new Error("Invalid selector key: " + selectorKey);
    }

    await this.expectVisibleSelector(selector);
  }
}
`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);

  console.log("✅ Page Object generated at:", filePath);
}