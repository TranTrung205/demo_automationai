import { ollamaChat } from "../llm/ollama-client";

export interface PlanStep {
  action: string;
  target?: string;
  value?: string;
  url?: string;
}

function extractJSON(text: string): PlanStep[] {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}

export async function planTest(userPrompt: string): Promise<PlanStep[]> {

  const prompt = `
You are a senior QA automation engineer.

Create a Playwright execution plan in JSON array format.

Allowed actions:
- goto
- click
- fill
- press
- expect

Rules:
- Return ONLY JSON
- No explanation
- No markdown

Example:
[
  { "action": "goto", "url": "https://example.com" },
  { "action": "fill", "target": "Username field", "value": "user1" },
  { "action": "click", "target": "Login button" }
]

Task:
${userPrompt}
`;

  const response = await ollamaChat(prompt);

  return extractJSON(response);
}