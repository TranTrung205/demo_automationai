import fs from "fs";
import path from "path";
import { chromium } from "playwright";

import { analyzeUIState } from "../ai/brain/analyzer/ui-state-analyzer";
import { planSteps } from "../ai/brain/planner/ai-planner";

async function debug() {

  const url = "https://www.saucedemo.com";

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto(url);

  const tmpDir = path.join(
    process.cwd(),
    "tmp"
  );

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const screenshotPath = path.join(
    tmpDir,
    "debug.png"
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  const dom = await page.content();

  console.log("🔎 Analyze UI");

  const state = await analyzeUIState(
    dom,
    screenshotPath,
    "Login with standard user"
  );

  console.log("VISION RESULT:");
  console.log(state);

  console.log("🧠 Planning...");

  const steps = await planSteps(
    "Login with standard user",
    state
  );

  console.log("STEPS:");
  console.log(steps);

  await browser.close();
}

debug();