import { execSync } from "child_process";
import { generateTest } from "./testGenerator.js";
import { fixTest } from "./selfHealingAgent.js";
import { aiFixTest } from "./aiFixer.js";
import { autoCommit } from "./gitHelper.js";
import { generateDashboard } from "./dashboard.js";

async function runTests() {
  try {
    execSync("npx playwright test", { stdio: "inherit" });
    return true;
  } catch (err: any) {
    return err.toString();
  }
}

async function main() {
  await generateTest();

  console.log("🚀 Running tests...");
  let result = await runTests();

  if (result !== true) {
    console.log("❌ Failed → Self healing...");
    await fixTest(result);

    console.log("🔁 Re-running tests...");
    const retry = await runTests();

    if (retry !== true) {
      generateDashboard("FAIL", retry);
    } else {
      generateDashboard("PASS", "Recovered after healing");
    }

  } else {
    console.log("✅ Tests passed");
    generateDashboard("PASS", "All tests passed");
  }
}


main();
