import fs from "fs";
import path from "path";
import { chromium } from "playwright";

import { analyzeUIState } from "../brain/analyzer/ui-state-analyzer";
import { planSteps } from "../brain/planner/ai-planner";

import { generateTest } from "../execution/generator/ai-generator";
import { executeCode } from "../execution/executor/code-executor";

import { fixTest } from "../fixer/ai-fixer";

import { loadMemory } from "../memory/knowledge/memory";


export interface RunOptions {
  instruction: string;
  url: string;
  testName?: string;
  headless?: boolean;
  maxRetry?: number;
}



/**
 * ============================================
 * V8 AI AUTOMATION ORCHESTRATOR (FINAL)
 * ============================================
 *
 * Pipeline:
 *
 * Browser → Screenshot → Vision → Planner
 * → Generator → Executor → Fixer → Retry
 *
 */
export async function runAgentV8(
  options: RunOptions
) {

  const {
    instruction,
    url,
    testName = "ai-test",
    headless = false,
    maxRetry = 2
  } = options;

  console.log("\n================================");
  console.log("🚀 V8 AGENT STARTED");
  console.log("================================");

  console.log("📝 Instruction:", instruction);
  console.log("🌐 URL:", url);

  /**
   * LOAD MEMORY
   */
  let memory: any = {};

  try {
    memory = loadMemory?.() || {};
  } catch {
    memory = {};
  }

  /**
   * START BROWSER
   */
  const browser = await chromium.launch({
    headless
  });

  const page = await browser.newPage();

  await page.goto(url);

  /**
   * PREP TMP FOLDER
   */
  const tmpDir = path.join(
    process.cwd(),
    "tmp"
  );

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  /**
   * TAKE SCREENSHOT
   */
  const screenshotPath = path.join(
    tmpDir,
    `screen-${Date.now()}.png`
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  /**
   * GET DOM
   */
  const dom = await page.content();

  /**
   * ANALYZE UI
   */
  console.log("🔎 Analyzing UI...");

  const uiState = await analyzeUIState(
    dom,
    screenshotPath,
    instruction
  );

  /**
   * PLAN STEPS
   */
  console.log("🧠 Planning steps...");

  const steps = await planSteps(
    instruction,
    uiState,
    memory
  );

  console.log("📋 Steps created:", steps.length);

  /**
   * GENERATE TEST
   */
  console.log("⚙️ Generating test...");

  const generated = await generateTest(
    steps,
    testName
  );

  let testFile = generated.filePath;

  /**
   * EXECUTE
   */
  console.log("⚡ Executing test...");

  let result = await executeCode(
    `npx playwright test ${testFile}`
  );

  /**
   * HEAL LOOP
   */
  let retry = 0;

  while (!result.success && retry < maxRetry) {

    console.log("\n🩹 Healing attempt:", retry + 1);

    retry++;

    const fix = await fixTest(
      steps,
      result.output,
      testName
    );

    if (!fix?.fixed) {

      console.log("❌ Healing failed");

      break;
    }

    testFile = fix.filePath!;

    console.log("⚡ Re-executing...");

    result = await executeCode(
      `npx playwright test ${testFile}`
    );
  }

  /**
   * FINAL RESULT
   */
  console.log("\n================================");

  if (result.success) {

    console.log("✅ TEST PASSED");

  } else {

    console.log("❌ TEST FAILED");
  }

  console.log("================================\n");

  /**
   * CLEANUP
   */
  await browser.close();

  return {
    success: result.success,
    output: result.output,
    steps,
    testFile
  };
}