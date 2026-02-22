import { ollamaChat } from "../llm/ollama-client";
import { TestStep } from "./step-types";

/**
 * Extract JSON array safely
 */
function extractJSON(text: string): string {

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("Planner did not return JSON array");
  }

  return text.substring(start, end + 1);
}

/**
 * Validate + normalize steps
 */
function validateSteps(steps: any[]): TestStep[] {

  return steps.map((s, i) => ({
    id: s.id || `step-${i + 1}`,
    description: s.description || "",
    action: s.action || "unknown",
    target: s.target || "",
    value: s.value,
    expected: s.expected
  }));
}

/**
 * V6 Self-Planning Agent
 */
export async function planSteps(
  instruction: string,
  dom: string,
  memory: any = {}
): Promise<TestStep[]> {

  const prompt = `
You are a senior QA automation planner AI.

Convert the instruction into atomic UI test steps.

Instruction:
${instruction}

DOM Snapshot:
${dom}

Memory:
${JSON.stringify(memory)}

Return ONLY JSON array.

Step schema:

[
  {
    "id": "step-1",
    "description": "human readable",
    "action": "goto | click | fill | assert | wait",
    "target": "selector or url",
    "value": "optional",
    "expected": "optional"
  }
]

Rules:

- Max 8 steps
- Atomic actions only
- Prefer label/text selectors
- goto must contain full URL
- assert must verify visible UI
- No explanation
- ONLY JSON
`;

  console.log("🧠 Planner thinking...");

  const raw = await ollamaChat(prompt, {
    temperature: 0.1
  });

  if (!raw) {
    throw new Error("Planner received empty response");
  }

  let jsonText: string;

  try {

    jsonText = extractJSON(raw);

  } catch (err) {

    console.error("❌ Planner JSON extraction failed");
    console.error(raw);
    throw err;
  }

  try {

    const parsed = JSON.parse(jsonText);

    const steps = validateSteps(parsed);

    console.log(`✅ Planner created ${steps.length} steps`);

    return steps;

  } catch (err) {

    console.error("❌ Planner JSON parse failed");
    console.error(jsonText);
    throw err;
  }
}