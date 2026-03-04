import fs from "fs/promises";

export async function comparePages(
  humanPath: string,
  aiPath: string
) {
  try {
    const human = await fs.readFile(humanPath, "utf-8");
    const ai = await fs.readFile(aiPath, "utf-8");

    if (human === ai) {
      console.log("✅ AI matches human page");
      return true;
    }

    console.log("⚠️ Difference detected between human and AI page");
    return false;

  } catch {
    console.log("⚠️ Human page not found → AI is first version");
    return false;
  }
}