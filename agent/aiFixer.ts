import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function aiFixTest(errorLog: string) {
  console.log("🤖 AI healing started...");

  const filePath = "tests/login.spec.ts";
  const code = fs.readFileSync(filePath, "utf8");

  const prompt = `
You are a senior Playwright automation engineer.

The test below is failing.

ERROR:
${errorLog}

CODE:
${code}

Fix the test so it passes.

Rules:
- Use Playwright TypeScript
- Do not add hard waits
- Keep test readable
- Return ONLY the updated code
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const newCode = response.output_text;

  if (!newCode) {
    console.log("⚠️ AI returned empty response");
    return;
  }

  fs.writeFileSync(filePath, newCode);

  console.log("✅ AI updated the test");
}
