import fs from "fs/promises";
import path from "path";

export async function generateUI(
  pageName: string,
  elements: any[]
) {

  const cleanName = String(pageName)
    .replace(/\s+/g, "")
    .replace(".yaml", "");

  const folder = path.join(
    process.cwd(),
    "pages",
    "ai_generated",
    "ui"
  );

  await fs.mkdir(folder, { recursive: true });

  const filePath = path.join(
    folder,
    `${cleanName}.ui.ts`
  );

  const elementMap: any = {};

  for (const el of elements) {

    const name =
      el.name ||
      el.target ||
      "element";

    elementMap[name] = {
      primary: "AUTO_DETECT",
      description: name
    };
  }

  const code = `
export const ${cleanName}UI = {
  pageName: "${cleanName}",
  elements: ${JSON.stringify(elementMap, null, 2)}
};
`;

  await fs.writeFile(filePath, code);

  console.log("🎨 UI generated:", filePath);
}