import { execSync } from "child_process";
import { generateTest } from "./testGenerator.js";
import { fixTest } from "./selfHealingAgent.js";
import { aiFixTest } from "./aiFixer.js";
import { autoCommit } from "./gitHelper.js";

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
    result = await runTests();

    if (result !== true) {

      console.log("🤖 AI Healing...");
      await aiFixTest(result);

      console.log("🔁 Re-running tests after AI fix...");
      result = await runTests();

      if (result === true) {
        await autoCommit("🤖 AI fixed failing tests automatically");
      }

    } else {
      await autoCommit("🛠️ Self-healing fixed locator");
    }

  } else {
    console.log("✅ Tests passed");
  }
}

main();
