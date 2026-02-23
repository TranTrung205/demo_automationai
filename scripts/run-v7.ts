import fs from "fs";
import yaml from "js-yaml";
import { chromium } from "playwright";

import { runTestV7 } from "../ai/orchestrator-v7";

interface Step {
  instruction: string;
}

interface Scenario {
  name: string;
  steps: Step[];
}

// ======================
// READ CLI ARG
// ======================

const args = process.argv.slice(2);

const scenarioArg = args.find((a) =>
  a.startsWith("--scenario=")
);

if (!scenarioArg) {
  console.error("❌ Missing --scenario argument");
  console.log(
    "Example: npm run v7 -- --scenario=scenarios/sauce-demo/login.yaml"
  );
  process.exit(1);
}

const scenarioPath = scenarioArg.split("=")[1];

if (!fs.existsSync(scenarioPath)) {
  console.error("❌ Scenario file not found:", scenarioPath);
  process.exit(1);
}

// ======================
// LOAD YAML
// ======================

const fileContent = fs.readFileSync(
  scenarioPath,
  "utf8"
);

const scenario = yaml.load(fileContent) as Scenario;

console.log("\n==============================");
console.log("🚀 V7 SCENARIO:", scenario.name);
console.log("==============================");

// ======================
// RUN SCENARIO WITH SHARED SESSION
// ======================

async function main() {

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {

    for (let i = 0; i < scenario.steps.length; i++) {

      const step = scenario.steps[i];

      console.log(
        `\n👉 STEP ${i + 1}: ${step.instruction}`
      );

      await runTestV7(step.instruction, page);

    }

    console.log("\n✅ Scenario Completed\n");

  } catch (err) {

    console.error("❌ Scenario failed:", err);

  } finally {

    await browser.close();

  }
}

main();