import { runAgentV6 } from "../agent/orchestrator";

async function main() {

  const instruction =
    "Login to SauceDemo and verify inventory page";

  const result = await runAgentV6(instruction);

  console.log("\n🎯 FINAL RESULT:");
  console.dir(result, { depth: null });
}

main();