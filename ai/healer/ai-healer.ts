import axios from "axios";

/**
 * Call Ollama
 */
async function askLLM(prompt: string): Promise<string> {
  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3.1:8b",
      prompt,
      stream: false,
      options: {
        temperature: 0.1
      }
    }
  );

  return response.data.response;
}

/**
 * Heal Playwright test using AI
 */
export async function healTest(
  requirement: string,
  error: string,
  oldCode: string
): Promise<string> {

  const prompt = `
You are a senior Playwright automation engineer.

A Playwright test FAILED.

Your job:
Fix the test so it passes.

Requirement:
${requirement}

Error:
${error}

Broken Code:
${oldCode}

STRICT RULES:
- Keep Playwright TypeScript syntax
- DO NOT change test intention
- Fix selectors based on error
- Prefer selector priority:
  id > data-test > name > placeholder > role > text
- If locator timeout → add expect(locator).toBeVisible()
- ALWAYS ensure page.goto exists
- Prefer expect(page).toHaveURL
- Return ONLY code
- NO markdown
- NO explanation

Return the FULL corrected test.
`;

  return await askLLM(prompt);
}