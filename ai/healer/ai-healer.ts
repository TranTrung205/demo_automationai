import { ollamaChat } from "../llm/ollama-client";

export async function healTest(code: string, error: string) {
  const prompt = `
You are a Playwright self-healing AI.

Test Code:
${code}

Error:
${error}

Fix the code.

Rules:
- Keep structure
- Only modify broken locator or step
- Return code only
`;

  return await ollamaChat(prompt);
}