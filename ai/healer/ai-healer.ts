import axios from "axios";

/**
 * Call Ollama
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
 * Fix locator using AI
 */
export async function healTest(
  requirement: string,
  error: string,
  oldCode: string
): Promise<string> {
  const prompt = `
You are a senior Playwright automation engineer.

The test failed.

Requirement:
${requirement}

Error:
${error}

Old Code:
${oldCode}

Rules:
- Fix selectors
- Use stable selectors (#id, data-test)
- Use expect(page).toHaveURL
- TypeScript Playwright syntax
- Return ONLY code
- No markdown
`;

  const result = await askLLM(prompt);

  return result;
}