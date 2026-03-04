import { generateBasePageIfNotExists } from "../execution/generator/base/base-page-generator";
import { generateUI } from "../execution/generator/ui/ui-generator";
import { generatePageObject } from "../execution/generator/page/page-object-generator";
import { generateTest } from "../execution/generator/test/test-generator";

export async function runV10(
  uiState: any,
  steps: any[],
  testName: string,
  url: string
) {
  console.log("🚀 V10 Orchestrator Started");

  if (!uiState?.elements?.length) {
    throw new Error("Invalid UI state");
  }

  console.log("📦 Elements detected:", uiState.elements.length);

  // 1️⃣ Base
  await generateBasePageIfNotExists();

  // 2️⃣ UI abstraction
  await generateUI(uiState, testName);

  // 3️⃣ Page Object
  await generatePageObject(testName);

  // 4️⃣ Test
  const result = await generateTest(
    steps,
    testName
  );

  console.log("✅ V10 Generation Completed");

  return result;
}