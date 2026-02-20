import { ollamaChat } from "../llm/ollama-client";

export async function planTest(userPrompt: string) {
  const prompt = `
You are a QA test planner.

Create a step-by-step Playwright test plan for:

${userPrompt}

Return steps as numbered list.
`;

  const response = await ollamaChat(prompt);

  return response;
}