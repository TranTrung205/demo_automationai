// ai-generator.ts
// Generate Playwright test using Ollama + deepseek-coder

import fs from "fs/promises";

export interface AIGenerateOptions {
  model?: string;
  temperature?: number;
}

const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";

function cleanCodeBlock(text: string): string {
  if (!text) return "";

  return text
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```javascript/g, "")
    .replace(/```js/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function generatePlaywrightTest(
  domPath: string,
  instruction: string,
  options: AIGenerateOptions = {}
): Promise<string> {
  const model = options.model || "deepseek-coder:6.7b";
  const temperature = options.temperature ?? 0.1;

  const dom = await fs.readFile(domPath, "utf-8");

  const prompt = `
You are a senior Playwright automation engineer.

TASK:
Generate a complete Playwright TypeScript test.

STRICT RULES:
- Use: import { test, expect } from '@playwright/test'
- Prefer getByRole / getByLabel / getByText
- Avoid XPath unless necessary
- Use await properly
- Return ONLY runnable code
- No explanation
- No markdown

TEST SCENARIO:
${instruction}

DOM SNAPSHOT:
${dom}
`;

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data: any = await response.json();

  const rawText = data.response || "";
  const cleaned = cleanCodeBlock(rawText);

  return cleaned;
}