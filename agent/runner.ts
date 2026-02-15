import { execSync } from "child_process";
import { generateTest } from "./testGenerator.js";
import { fixTest } from "./selfHealingAgent.js";

function runPlaywright(): string | null {
    try {
        execSync("npx playwright test", { stdio: "inherit" });
        console.log("✅ Tests passed");
        return null;
    } catch (e: any) {
        return e.stdout?.toString() || "Unknown error";
    }
}

async function main() {
    await generateTest();

    let error = runPlaywright();

    if (error) {
        console.log("❌ Failed → AI fixing...");
        await fixTest(error);
        runPlaywright();
    }
}

main();
