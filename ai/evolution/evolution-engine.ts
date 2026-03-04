import { comparePages } from "./page-diff";

export async function evolveIfNeeded(pageName: string) {

  const humanPath = `pages/human-generated/${pageName}.ts`;
  const aiPath = `pages/ai_generated/${pageName}.ts`;

  const same = await comparePages(humanPath, aiPath);

  if (!same) {
    console.log("🧠 Evolution triggered for:", pageName);
    // Sau này có thể call LLM để improve code
  }
}