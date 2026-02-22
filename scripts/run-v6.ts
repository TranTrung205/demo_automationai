import { runTestV6 } from "../ai/orchestrator-v6";

/**
 * Entry script for V6 Self-Planning Agent
 */
async function main() {
  try {
    await runTestV6(
      "Login with standard user and verify inventory page"
    );

    console.log("\n✅ V6 run completed");
  } catch (err) {
    console.error("\n💥 V6 run crashed");
    console.error(err);
  }
}

main();