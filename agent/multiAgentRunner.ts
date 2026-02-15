import { plannerAgent } from "./plannerAgent.js";
import { testerAgent } from "./testerAgent.js";
import { reviewerAgent } from "./reviewerAgent.js";

async function main() {

  console.log("🚀 Multi-Agent System Starting...");

  // STEP 1 — PLAN
  const plan = await plannerAgent();
  console.log("📋 Plan:", plan);

  // STEP 2 — GENERATE TEST
  const code = await testerAgent(plan);

  // STEP 3 — REVIEW
  const review = await reviewerAgent(code);
  console.log("🧐 Review:", review);

  console.log("✅ Multi-Agent Done");
}

main();
