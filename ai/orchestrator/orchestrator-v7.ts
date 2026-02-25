import { Page } from "playwright";

import { scanDOM } from "../perception/scanner/dom-scanner";
import { planSteps } from "./planner/ai-planner";
import { generateStep } from "./generator/ai-generator";
import { executeSteps } from "../execution/executor/code-executor";
import { healStep } from "./healer/healer";
import { loadMemory } from "../memory/knowledge/memory";

/**
 * V7 Orchestrator
 * Shared session multi-step agent
 */
export async function runTestV7(
  instruction: string,
  page: Page
) {
  console.log("🚀 V7 Agent Started");
  console.log("📝 Instruction:", instruction);

  await loadMemory();

  const text = instruction.toLowerCase();

  /**
   * =========================
   * NAVIGATION HEURISTIC
   * =========================
   */
  if (text.includes("open") || text.includes("navigate")) {
    console.log("🌐 Navigating to base URL...");

    if (!page.url().includes("saucedemo")) {
      await page.goto("https://www.saucedemo.com/");
    }

    console.log("✅ Navigation step completed (AI skipped)");
    return;
  }

  /**
   * =========================
   * LOGIN HEURISTIC
   * =========================
   */
  if (text.includes("login")) {
    console.log("🔐 Login heuristic activated");

    if (!page.url().includes("saucedemo")) {
      await page.goto("https://www.saucedemo.com/");
    }

    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");

    await page.waitForTimeout(1500);

    console.log("✅ Login completed");
    return;
  }

  /**
   * =========================
   * NORMAL AI FLOW
   * =========================
   */

  console.log("🔎 Scanning DOM...");
  const dom = await scanDOM(page);

  console.log("🧠 Planning steps...");
  const plannedSteps = await planSteps(instruction, dom);

  console.log("📋 Planner created", plannedSteps.length, "steps");

  for (const s of plannedSteps) {
    console.log(`➡️ ${s.id}: ${s.action} ${s.target}`);
  }

  /**
   * Generate code for steps
   */
  const executableSteps = [];

  for (const step of plannedSteps) {
    console.log(`⚙️ Generating ${step.id}`);
    const code = await generateStep(step);
    executableSteps.push({ ...step, code });
  }

  /**
   * Execution with self-healing
   */
  let success = false;

  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`\n🚀 Execution Attempt ${attempt}`);

    let failedIndex = -1;

    for (let i = 0; i < executableSteps.length; i++) {
      const step = executableSteps[i];

      console.log(`▶️ Executing step ${i + 1}`);

      const ok = await executeSteps(step, page);

      if (!ok) {
        console.log("❌ Failed at step", i + 1);
        failedIndex = i;
        break;
      }
    }

    if (failedIndex === -1) {
      success = true;
      break;
    }

    /**
     * Healing failed step
     */
    console.log("🩹 Healing step", failedIndex + 1);

    const healedCode = await healStep(
      executableSteps[failedIndex],
      page
    );

    executableSteps[failedIndex].code = healedCode;

    console.log("✅ Step healed");
  }

  if (!success) {
    console.log("\n💥 TEST FAILED AFTER RETRIES");
  } else {
    console.log("\n🎉 TEST PASSED");
  }
}