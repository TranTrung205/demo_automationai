import axios from "axios";

/**
 * Call local Ollama LLM
 */
async function askLLM(prompt: string): Promise<string> {

  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3.1:8b",
      prompt: prompt,
      stream: false,
    }
  );

  return response.data.response;
}


/**
 * Generate Playwright test from requirement
 */
export async function generateTest(requirement: string): Promise<string> {

  const prompt = `
You are a senior Playwright automation engineer.

IMPORTANT:
- Use ONLY Playwright Test framework
- Use: import { test, expect } from '@playwright/test'
- DO NOT use describe()
- DO NOT use it()
- Test format must be:

test('test name', async ({ page }) => {
  ...
});

Rules:
- Use TypeScript
- Use stable selectors
- Prefer expect(page).toHaveURL()
- Return ONLY code
- No markdown
- No explanation

Scenario:
${requirement}
`;

  const result = await askLLM(prompt);

  return result;
}
