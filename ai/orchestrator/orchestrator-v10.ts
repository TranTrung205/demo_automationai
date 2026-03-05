import { generateBasePageIfNotExists } from "../execution/generator/base/base-page-generator";
import { generateUI } from "../execution/generator/ui/ui-generator";
import { generatePageObject } from "../execution/generator/page/page-object-generator";
import { generateTest } from "../execution/generator/test/test-generator";

export async function runV10(
  uiState: any,
  steps: any[],
  scenarioName: string,
  url: string
) {

  console.log("🚀 V10 Orchestrator Started");

  /**
   * Ensure steps
   */
  if (!Array.isArray(steps)) {
    throw new Error("❌ Steps must be an array");
  }

  /**
   * Ensure elements
   */
  if (!uiState || !uiState.elements) {
    throw new Error("❌ uiState.elements missing");
  }

  const elements = Array.isArray(uiState.elements)
    ? uiState.elements
    : Object.values(uiState.elements);

  console.log("📦 Elements detected:", elements.length);

  /**
   * Normalize names
   */
  const pageName = scenarioName.replace(/\s+/g, "");
  const testName = pageName;

  /**
   * 1️⃣ Generate BasePage
   */
  await generateBasePageIfNotExists();

  /**
   * 2️⃣ Generate UI
   */
  await generateUI(pageName, elements);

  /**
   * 3️⃣ Generate Page Object
   */
  await generatePageObject(pageName);

  /**
   * 4️⃣ Generate Test
   */
  await generateTest(testName, pageName, steps);

  return {
    page: pageName,
    test: testName,
    elements: elements.length,
    url
  };
}