import fs from "fs/promises";
import path from "path";

function normalizeName(name: string): string {
  return name.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
}

function isValidSelector(value: string): boolean {
  if (!value) return false;

  // ❌ ignore URLs
  if (value.startsWith("http")) return false;

  return true;
}

export async function generateUI(
  uiState: any,
  testName: string
) {
  const cleanName = normalizeName(testName);
  const uiName = `${cleanName}UI`;

  const elements: Record<string, string> = {};

  uiState.elements.forEach((el: any, index: number) => {

    const selector = el.selector || el.target || "";

    // ✅ SKIP URL
    if (!isValidSelector(selector)) return;

    const rawKey =
      el.id ||
      el.name ||
      el.text?.replace(/\s+/g, "") ||
      `element${index}`;

    const key = normalizeName(rawKey);

    elements[key] = selector;
  });

  const filePath = path.join(
    process.cwd(),
    "pages",
    "ai_generated",
    "ui",
    `${cleanName}.ui.ts`
  );

  const content = `export const ${uiName} = {
  pageName: "${cleanName}",
  elements: ${JSON.stringify(elements, null, 2)}
};
`;

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);

  console.log("✅ UI abstraction generated at:", filePath);
}