import { ollamaChat } from "../llm/ollama-client";
import { TestStep } from "./step-types";
import { compressDOM } from "../utils/dom-compressor";
import { UIState } from "../analyzer/ui-state-analyzer";


/**
 * Detect login page from UIState
 */
function detectLogin(state: UIState): boolean {

  if (!state) return false;

  if (state.pageType === "login") return true;

  const text = JSON.stringify(state.domSummary || "").toLowerCase();

  return (
    text.includes("user") &&
    text.includes("pass")
  );
}


/**
 * Login heuristic plan (bypass LLM)
 */
function loginPlan(): TestStep[] {

  console.log("🔐 Login detected → bypass LLM");

  return [
    {
      id: "step-1",
      description: "Fill username",
      action: "fill",
      target: "#user-name",
      value: "standard_user",
      expected: ""
    },
    {
      id: "step-2",
      description: "Fill password",
      action: "fill",
      target: "#password",
      value: "secret_sauce",
      expected: ""
    },
    {
      id: "step-3",
      description: "Click login",
      action: "click",
      target: "#login-button",
      value: "",
      expected: ""
    }
  ];
}


/**
 * Extract JSON array safely from LLM text
 */
function extractJSON(text: string): string {

  if (!text) throw new Error("Empty response");

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1) {
    throw new Error("No JSON array found");
  }

  if (end !== -1) {
    return cleaned.substring(start, end + 1);
  }

  console.log("⚠️ JSON truncated — attempting repair");

  let partial = cleaned.substring(start);

  if (!partial.trim().endsWith("}]")) {
    partial = partial.replace(/,\s*$/, "");
    partial += "]";
  }

  return partial;
}


/**
 * Normalize steps
 */
function normalizeSteps(steps: any[]): TestStep[] {

  return steps.map((s, i) => ({

    id: s.id || `step-${i + 1}`,
    description: s.description || "",
    action: (s.action || "unknown") as any,
    target: s.target || "",
    value: s.value || "",
    expected: s.expected || ""

  }));
}


/**
 * Fallback heuristic if LLM fails
 */
function fallbackPlan(instruction: string): TestStep[] {

  console.log("⚠️ Using fallback planner");

  return [
    {
      id: "step-1",
      description: "Open application",
      action: "goto",
      target: "/",
      value: "",
      expected: ""
    }
  ];
}


/**
 * Build planner prompt with Vision + DOM
 */
function buildPrompt(
  instruction: string,
  state: UIState,
  dom: any
): string {

  return `
You are an AI test planner.

Goal:
Create UI automation steps to complete the instruction.

Instruction:
${instruction}

Page Type:
${state.pageType || "unknown"}

Vision:
${JSON.stringify(state.vision || {}, null, 2)}

Elements:
${JSON.stringify(dom, null, 2)}

STRICT RULES:

- JSON array only
- Max 6 steps
- Only fields:
  id, description, action, target, value, expected

Allowed actions:
click, fill, goto, assert, wait

Example:

[
  {
    "id": "step-1",
    "description": "Open site",
    "action": "goto",
    "target": "https://example.com",
    "value": "",
    "expected": ""
  }
]
`;
}


/**
 * V8 Planner Agent (Vision Aware)
 */
export async function planSteps(
  instruction: string,
  state: UIState,
  memory: any = {}
): Promise<TestStep[]> {

  console.log("🧠 Planning steps...");

  /**
   * ⭐ STEP 1 — Login heuristic FIRST
   */
  if (detectLogin(state)) {
    return loginPlan();
  }

  /**
   * Compress DOM
   */
  const compactDOM = compressDOM(state.domSummary);

  let domToUse = compactDOM;

  for (let attempt = 1; attempt <= 2; attempt++) {

    console.log(`🧠 Planner attempt ${attempt}`);

    const prompt = buildPrompt(
      instruction,
      state,
      domToUse
    );

    try {

      const raw = await ollamaChat(prompt, {
        temperature: 0.1,
        maxTokens: 200
      });

      if (!raw) throw new Error("Empty LLM response");

      console.log("📦 RAW LLM:", raw);

      const jsonText = extractJSON(raw);

      const parsed = JSON.parse(jsonText);

      if (!Array.isArray(parsed)) {
        throw new Error("Planner did not return array");
      }

      const steps = normalizeSteps(parsed);

      console.log(`✅ Planner created ${steps.length} steps`);

      return steps;

    } catch (err) {

      console.log("⚠️ Planner error:", (err as any)?.message);

      // shrink DOM for retry
      domToUse = domToUse.slice(
        0,
        Math.floor(domToUse.length / 2)
      );
    }
  }

  return fallbackPlan(instruction);
}