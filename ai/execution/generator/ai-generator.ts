import { ollamaChat } from "../llm/ollama-client";

export interface Step {
  id: string;
  action: string;
  target: string;
  value?: any;
  expected?: string;
}

/**
 * Normalize action names
 */
function normalizeAction(action: string) {
  if (!action) return "";

  const a = action.toLowerCase();

  if (a.includes("click")) return "click";
  if (a.includes("fill") || a.includes("type")) return "fill";
  if (a.includes("navigate")) return "navigate";
  if (a.includes("verify")) return "verify";

  return a;
}

/**
 * Extract JS code block
 */
function extractCode(text: string): string {
  if (!text) return "";

  text = text
    .replace(/```javascript/g, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "");

  const start = text.indexOf("async");

  if (start !== -1) {
    text = text.substring(start);
  }

  const end = text.lastIndexOf("}");

  if (end !== -1) {
    text = text.substring(0, end + 1);
  }

  return text.trim();
}

/**
 * Fallback safe code
 */
function fallbackStep(step: Step): string {

  if (step.action === "click") {
    return `
async function step(page){
  await page.click("${step.target}");
}
`;
  }

  if (step.action === "fill") {
    return `
async function step(page){
  await page.fill("${step.target}", "${step.value || ""}");
}
`;
  }

  if (step.action === "verify") {
    return `
async function step(page){
  await page.waitForSelector("${step.target}");
}
`;
  }

  return `
async function step(page){
  console.log("fallback step");
}
`;
}

/**
 * Generate step code
 */
export async function generateStep(step: Step): Promise<string> {

  const action = normalizeAction(step.action);

  console.log("🧠 Generating code for", step.id);

  const prompt = `
You are a senior Playwright automation engineer.

Generate ONLY a JavaScript async function.

STRICT RULES:

- Function name: step
- Signature: async function step(page)
- Use Playwright Page API
- No import
- No test()
- No explanation
- Must work with existing browser session
- Return ONLY code

STEP INFO:

Action: ${action}
Target: ${step.target}
Value: ${step.value || ""}
Expected: ${step.expected || ""}

Example:

async function step(page){
  await page.click("#login-button");
}
`;

  const raw = await ollamaChat(prompt, {
    model: "phi3",
    temperature: 0.1,
    system: "You are a senior Playwright automation engineer."
  });

  if (!raw) {
    console.log("⚠️ Empty LLM response — fallback");
    return fallbackStep(step);
  }

  const code = extractCode(raw);

  if (!code.includes("async")) {
    console.log("⚠️ Invalid code — fallback");
    return fallbackStep(step);
  }

  console.log("✅ Step generated");

  return code;
}