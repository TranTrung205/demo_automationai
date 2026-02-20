import axios from "axios";

/**
 * Call local LLM via Ollama
 */
async function askLLM(prompt: string): Promise<string> {
  const response = await axios.post(
    "http://127.0.0.1:11434/api/generate",
    {
      model: "llama3.1:8b",
      prompt,
      stream: false,
      options: {
        temperature: 0.2,   // giảm hallucination
      }
    }
  );

  return response.data.response;
}

/**
 * Generate Playwright test from requirement + DOM
 */
export async function generateTest(
  url: string,
  requirement: string,
  dom: string
): Promise<string> {

  const prompt = `
You are a senior Playwright automation engineer.

Website URL:
${url}

Rules:
- Use TypeScript
- Use Playwright test syntax
- ALWAYS start with page.goto("${url}")
- NEVER use example.com
- Use provided DOM selectors
- Prefer expect(page).toHaveURL
- Return ONLY code
- No markdown
- No explanation

Scenario:
${requirement}

DOM:
${dom}
`;

  return await askLLM(prompt);
}