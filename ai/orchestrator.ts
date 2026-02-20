// orchestrator.ts
import fs from "fs/promises";
import path from "path";

import { generatePlaywrightTest } from "./generator/ai-generator";
import { healTest } from "./healer/ai-healer";
import { runTest } from "./runner/test-runner";

const TEST_FILE = "tests/generated.spec.ts";
const DOM_FILE = "dom.json";

export async function runAgent(instruction: string) {
  console.log("🤖 AI Agent started...");
  console.log("Instruction:", instruction);

  console.time("TOTAL");

  try {
    // 1️⃣ GENERATE
    console.log("⚙️ Generating test...");

    let code = await generatePlaywrightTest(
      DOM_FILE,
      instruction
    );

    await fs.mkdir(path.dirname(TEST_FILE), { recursive: true });
    await fs.writeFile(TEST_FILE, code);

    // 2️⃣ RUN FIRST TIME
    console.log("🚀 Run attempt 1");

    let result = await runTest();

    if (result.success) {
      console.log("✅ Test passed");
      console.timeEnd("TOTAL");
      return;
    }

    // 3️⃣ HEAL (1 TIME ONLY → FAST)
    console.log("❌ Failed. Healing...");

    code = await healTest(code, result.error || "");

    await fs.writeFile(TEST_FILE, code);

    console.log("🚀 Run attempt 2");

    result = await runTest();

    if (result.success) {
      console.log("✅ Test passed after healing");
    } else {
      console.log("❌ Still failed");
      console.log("Error:", result.error);
    }

  } catch (err: any) {
    console.error("🔥 Agent crashed:", err.message);
  }

  console.timeEnd("TOTAL");
}