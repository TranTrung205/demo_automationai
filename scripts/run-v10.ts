import fs from "fs";
import path from "path";
import yaml from "yaml";
import readline from "readline";
import { exec } from "child_process";
import util from "util";

import { runV10 } from "../ai/orchestrator/orchestrator-v10";

const execAsync = util.promisify(exec);

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

  if (!selected) throw new Error("❌ Invalid selection");

  return selected;
}

/**
 * =====================================
 * EXTRACT ELEMENTS FROM STEPS
 * =====================================
 */
function extractElements(steps: any[]) {
  const uniqueTargets = [
    ...new Set(
      steps
        .filter((s) => s.target)
        .map((s) => s.target)
    ),
  ];

  return uniqueTargets.map((name) => ({
    name,
    selector: "AUTO_DETECT",
  }));
}

/**
 * =====================================
 * RUN GENERATED TESTS
 * =====================================
 */
async function runGeneratedTests() {
  console.log("\n🚀 Running generated tests...\n");

  try {
    const { stdout, stderr } = await execAsync(
      "npx playwright test tests/ai_generated/ui"
    );

    console.log(stdout);

    if (stderr) {
      console.log(stderr);
    }

    console.log("✅ Test execution finished");
  } catch (error: any) {
    console.log("❌ Test execution failed");

    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
  }
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

  /**
   * Extract URL
   */
  const url =
    steps.find((s: any) => s.type === "goto")?.url ||
    "https://www.saucedemo.com";

  /**
   * Extract elements
   */
  const elements = extractElements(steps);

  const uiState = {
    elements,
  };

  console.log("📦 Elements detected:", elements.length);

  try {
    const result = await runV10(
      uiState,
      steps,
      scenario.name || "ai_test",
      url
    );

    console.log("\n🎯 Generation completed:", result);

    /**
     * RUN TEST AFTER GENERATION
     */
    await runGeneratedTests();

  } catch (err) {
    console.error("❌ Agent crashed:", err);
  }
}

main();