import fs from "fs";
import path from "path";
import { generateTest } from "./generator/ai-generator";

/**
 * Clean AI response
 */
function cleanCode(raw: string): string {
  return raw
    .replace(/Here is.*?:/gi, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "")
    .trim();
}

async function run() {
  try {

    console.log("🚀 AI Agent Started");

    const requirement = "Login to saucedemo with valid user";

    const rawCode = await generateTest(requirement);

    console.log("Generated Test:\n", rawCode);

    /**
     * Clean AI output
     */
    const cleanedCode = cleanCode(rawCode);

    /**
     * Output path
     */
    const outputDir = "tests/ui";
    const outputFile = path.join(outputDir, "ai-login.spec.ts");

    /**
     * Ensure folder exists
     */
    fs.mkdirSync(outputDir, { recursive: true });

    /**
     * Save file
     */
    fs.writeFileSync(outputFile, cleanedCode);

    console.log("✅ Test saved to:", outputFile);

  } catch (error: any) {

    console.error("❌ Agent Error:", error.message);

  }
}

run();
