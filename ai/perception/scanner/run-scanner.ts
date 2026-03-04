import { Page } from "@playwright/test";
import { scanDOM, DOMSnapshot } from "./dom-scanner";

export async function runScanner(page: Page): Promise<DOMSnapshot> {

  console.log("🔎 Running DOM Scanner...");

  const result = await scanDOM(page);

  console.log(`✅ Scanned ${result.elements.length} elements`);

  return result;
}