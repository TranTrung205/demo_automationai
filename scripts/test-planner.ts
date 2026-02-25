import fs from "fs";
import path from "path";
import { chromium } from "playwright";

import { analyzeUIState } from "../ai/brain/analyzer/ui-state-analyzer";
import { planSteps } from "../ai/brain/planner/ai-planner";

async function testPlanner() {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto("https://www.saucedemo.com");

  const tmpDir = path.join(
    process.cwd(),
    "tmp"
  );

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const screenshotPath = path.join(
    tmpDir,
    "planner.png"
  );

  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  const dom = await page.content();

  const state = await analyzeUIState(
    dom,
    screenshotPath,
    "Login"
  );

  const steps = await planSteps(
    "Login with standard user",
    state
  );

  console.log("\n📋 Planner Output:");
  console.log(JSON.stringify(steps, null, 2));

  await browser.close();
}

testPlanner();