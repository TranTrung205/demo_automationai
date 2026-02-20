import { runAgent } from "./ai/orchestrator";

/**
 * Add default context if user prompt too vague
 */
function enrichPrompt(prompt: string): string {
  if (!prompt.includes("http")) {
    return `
Test login functionality on https://www.saucedemo.com

username: standard_user
password: secret_sauce

Expected: user navigates to inventory page
`;
  }

  return prompt;
}

async function main() {
  const rawPrompt = process.argv.slice(2).join(" ");

  if (!rawPrompt) {
    console.log('Usage: npm run ai "test login"');
    return;
  }

  const prompt = enrichPrompt(rawPrompt);

  console.log("🤖 AI Agent started...");
  console.log("Prompt:", rawPrompt);

  const start = Date.now();

  try {
    await runAgent(prompt);
  } catch (err) {
    console.error("❌ Agent crashed:", err);
  }

  const end = Date.now();
  console.log(`⏱ TOTAL: ${(end - start) / 1000}s`);
}

main();