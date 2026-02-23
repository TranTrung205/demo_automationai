import fs from "fs";
import yaml from "js-yaml";

import { runTestV6 } from "../ai/orchestrator-v6";

interface Step {
  instruction: string;
}

interface Scenario {
  name: string;
  steps: Step[];
}

/**
 * READ CLI ARG
 */
const args = process.argv;

const scenarioArg = args.find((a) =>
  a.includes("--scenario=")
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

/**
 * LOAD YAML
 */
const fileContent = fs.readFileSync(
  scenarioPath,
  "utf8"
);

const scenario = yaml.load(fileContent) as Scenario;

console.log("\n==============================");
console.log("🚀 V7 SCENARIO:", scenario.name);
console.log("==============================");

/**
 * RUN STEPS
 */
async function main() {
  for (let i = 0; i < scenario.steps.length; i++) {

    const step = scenario.steps[i];

    console.log(
      `\n👉 STEP ${i + 1}: ${step.instruction}`
    );

    try {

      await runTestV6(step.instruction);

    } catch (err) {

      console.error("❌ Step failed:", err);
      break;

    }
  }

  console.log("\n✅ Scenario Completed\n");
}

main();