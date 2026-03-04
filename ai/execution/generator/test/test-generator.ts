import fs from "fs/promises";
import path from "path";

function normalizeName(name: string): string {
  return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

export async function generateTest(
  steps: any[],
  testName: string
) {

  if (!Array.isArray(steps)) {
    throw new Error("Steps must be an array");
  }

  const cleanName = normalizeName(testName);
  const className = `${cleanName}Page`;

  const filePath = path.join(
    process.cwd(),
    "tests",
    "ai_generated",
    "ui",
    `${cleanName}.spec.ts`
  );

  const actions = steps.map((step) => {

    // ✅ GOTO
    if (step.action === "goto") {
      return `  await pageObject.goto("${step.target}");`;
    }

    const key = normalizeName(step.target || step.id || "");

    // ✅ VERIFY
    if (step.action === "verify") {
      return `  await pageObject.expectVisible("${key}");`;
    }

    // ✅ FILL
    if (step.value) {
      return `  await pageObject.performAction("${key}", "${step.value}");`;
    }

    // ✅ CLICK
    return `  await pageObject.performAction("${key}");`;

  }).join("\n");

  const content = `import { test } from "@playwright/test";
import { ${className} } from "../../../pages/ai_generated/pom/${className}";

test("${testName}", async ({ page }) => {

  const pageObject = new ${className}(page);

${actions}

});
`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);

  console.log("✅ Test generated at:", filePath);

  return { filePath };
}