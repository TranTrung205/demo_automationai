import fs from "fs/promises";
import path from "path";

function normalizeName(name: string): string {
  return String(name)
    .replace(".yaml", "")
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export async function generateTest(
  testName: any,
  pageName: any,
  steps: any[]
) {

  if (!steps || !Array.isArray(steps)) {
    throw new Error("❌ Steps is undefined or not an array");
  }

  const cleanTestName = normalizeName(testName);
  const cleanPageName = normalizeName(pageName?.name || pageName);

  const folderPath = path.join(
    process.cwd(),
    "tests",
    "ai_generated",
    "ui"
  );

  await fs.mkdir(folderPath, { recursive: true });

  const filePath = path.join(
    folderPath,
    `${cleanTestName}.spec.ts`
  );

  const stepCode = steps
    .map((step) => {

      if (!step) return "";

      // goto
      if (step.type === "goto") {
        return `await pageObject.goto("${step.url}");`;
      }

      // action
      if (step.type === "action") {

        const target = step.target || "unknown";

        if (step.value !== undefined) {
          return `await pageObject.performAction("${target}", "${step.value}");`;
        }

        return `await pageObject.performAction("${target}");`;
      }

      // assert
      if (step.type === "assert") {

        const target = step.target || "unknown";

        return `await pageObject.expectVisible("${target}");`;
      }

      return "";

    })
    .filter(Boolean)
    .join("\n  ");

  const code = `import { test } from "@playwright/test";
import { ${cleanPageName}Page } from "../../../pages/ai_generated/pom/${cleanPageName}Page";

test("${cleanTestName}", async ({ page }) => {

  const pageObject = new ${cleanPageName}Page(page);

  ${stepCode}

});
`;

  await fs.writeFile(filePath, code);

  console.log("🧪 Test generated:", filePath);
}