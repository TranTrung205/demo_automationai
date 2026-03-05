import fs from "fs/promises";
import path from "path";

function normalizeName(name: string): string {
  return name
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export async function generatePageObject(testName: string) {

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

    const element = ${uiName}.elements?.[selectorKey];

    if (!element) {
      throw new Error(
        "❌ Invalid selector key: " + selectorKey +
        " in ${uiName}"
      );
    }

    if (value !== undefined) {
      await this.fill(element, value);
    } else {
      await this.click(element);
    }
  }

  async expectVisible(selectorKey: string) {

    const element = ${uiName}.elements?.[selectorKey];

    if (!element) {
      throw new Error(
        "❌ Invalid selector key: " + selectorKey +
        " in ${uiName}"
      );
    }

    await this.expectVisibleSelector(element);
  }

}
`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  await fs.writeFile(filePath, content);

  console.log("✅ Page Object generated:", filePath);
}