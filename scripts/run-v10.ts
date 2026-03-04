import fs from "fs";
import path from "path";
import yaml from "yaml";
import readline from "readline";

import { runV10 } from "../ai/orchestrator/orchestrator-v10";

/**
 * =====================================
 * SCAN SCENARIOS
 * =====================================
 */
function scanScenarios(dir: string): string[] {
  const results: string[] = [];

  function scan(current: string) {
    const files = fs.readdirSync(current);

    for (const file of files) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (file.endsWith(".yaml") || file.endsWith(".yml")) {
        results.push(fullPath);
      }
    }
  }

  scan(dir);
  return results;
}

/**
 * =====================================
 * CLI SELECT
 * =====================================
 */
async function chooseScenario(paths: string[]): Promise<string> {
  console.log("\n📂 Available scenarios:\n");

  paths.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const index: number = await new Promise((resolve) => {
    rl.question("\n👉 Select scenario number: ", (answer) => {
      rl.close();
      resolve(Number(answer));
    });
  });

  const selected = paths[index - 1];
  if (!selected) throw new Error("Invalid selection");

  return selected;
}

/**
 * =====================================
 * MAIN
 * =====================================
 */
async function main() {
  const args = process.argv.slice(2);
  const scenarioArg = args.find((a) => a.startsWith("--scenario="));

  let scenarioPath: string;

  if (scenarioArg) {
    scenarioPath = scenarioArg.split("=")[1];
  } else {
    const scenarioDir = path.resolve("scenarios");

    if (!fs.existsSync(scenarioDir)) {
      throw new Error("❌ scenarios folder not found");
    }

    const files = scanScenarios(scenarioDir);

    if (!files.length) {
      throw new Error("❌ No scenarios found");
    }

    scenarioPath = await chooseScenario(files);
  }

  console.log("\n📂 Loading scenario:", scenarioPath);

  const file = fs.readFileSync(scenarioPath, "utf-8");
  const scenario = yaml.parse(file);

  const steps = scenario.steps || [];
  const url =
    steps.find((s: any) => s.action === "goto")?.target ||
    "https://www.saucedemo.com";

  const uiState = {
    elements: steps.map((s: any) => ({
      selector: s.target || "body",
    })),
  };

  try {
    const result = await runV10(
      uiState,
      steps,
      scenario.name || "ai_test",
      url
    );

    console.log("\n🎯 Generation completed:", result);
  } catch (err) {
    console.error("❌ Agent crashed:", err);
  }
}

main();