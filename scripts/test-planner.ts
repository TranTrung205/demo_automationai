import { planSteps } from "../ai/planner/ai-planner.ts";

async function main() {
  try {
    const instruction = "Login to SauceDemo and verify inventory page";

    const fakeDOM = `
    Username input
    Password input
    Login button
    Products title
    `;

    const memory = {};

    const steps = await planSteps(instruction, fakeDOM, memory);

    console.log("===== RESULT =====");
    console.dir(steps, { depth: null });

  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err);
  }
}

main();