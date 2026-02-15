import fs from "fs";

function extractBrokenSelector(errorLog: string): string | null {
  const match = errorLog.match(/['"`](#[^'"`]+)['"`]/);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

function findBetterSelector(code: string): string | null {
  // simple heuristic examples
  if (code.includes("user-name")) return "#user-name";
  if (code.includes("login-button")) return "#login-button";

  return null;
}

export async function fixTest(errorLog: string) {
  console.log("🤖 Smart healing started...");

  const filePath = "tests/login.spec.ts";
  let code = fs.readFileSync(filePath, "utf8");

  const brokenSelector = extractBrokenSelector(errorLog);

  if (!brokenSelector) {
    console.log("⚠️ Could not detect broken selector");
    return;
  }

  console.log("❌ Broken selector detected:", brokenSelector);

  const betterSelector = findBetterSelector(code);

  if (!betterSelector) {
    console.log("⚠️ No better selector found");
    return;
  }

  console.log("✅ Replacing with:", betterSelector);

  code = code.replaceAll(brokenSelector, betterSelector);

  fs.writeFileSync(filePath, code);

  console.log("🎉 Test healed successfully");
}
