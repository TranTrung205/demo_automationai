import fs from "fs";
import path from "path";
import { chromium } from "playwright";

import { analyzeUIState } from "../ai/brain/analyzer/ui-state-analyzer";
import { planSteps } from "../ai/brain/planner/ai-planner";
import { mapStepToAction } from "../ai//execution/generator/test/step-mapper";

async function debugAgent() {

  const url = process.argv[2] || "https://www.saucedemo.com";
  const goal = process.argv[3] || "Login with standard user";

  console.log("🌍 URL:", url);
  console.log("🎯 Goal:", goal);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const screenshotPath = path.join(tmpDir, "debug.png");

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  const dom = await page.content();

  console.log("\n🔎 Analyze UI...");
  const state = await analyzeUIState(dom, screenshotPath, goal);

  console.log("\n🧠 UI STATE:");
  console.log(JSON.stringify(state, null, 2));

  console.log("\n🧠 Planning...");
  const steps = await planSteps(goal, state);

  console.log("\n📋 RAW STEPS:");
  console.log(JSON.stringify(steps, null, 2));

  console.log("\n🧩 Mapping Steps → Actions:");

  const mapped = steps.map(step => mapStepToAction(step));

  console.log(JSON.stringify(mapped, null, 2));

  await browser.close();
}

debugAgent();