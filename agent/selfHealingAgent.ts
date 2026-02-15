import fs from "fs";
import { learnSelector } from "./memoryAgent.js";

function findLocator(errorLog: string): string | null {
  const regex = /waiting for locator\(['"](.+?)['"]\)/i;
  const match = errorLog.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export async function fixTest(errorLog: string) {
  const locator = findLocator(errorLog);

  if (!locator) {
    console.log("⚠️ No locator found in error log");
    return;
  }

  console.log("🔍 Broken locator detected:", locator);

  let code = fs.readFileSync("tests/login.spec.ts", "utf8");

  // 🔥 SMART HEALING RULES
  let newLocator = locator;

  if (locator.includes("wrong-id")) {
    newLocator = "#user-name";
  }

  if (locator.includes("submit-login")) {
    newLocator = "#login-button";
  }

  if (locator.includes("password-input")) {
    newLocator = "#password";
  }

  if (newLocator !== locator) {
    code = code.replace(locator, newLocator);

    fs.writeFileSync("tests/login.spec.ts", code);

    console.log(`🤖 Fixed selector: ${locator} → ${newLocator}`);

    // 🧠 SAVE MEMORY
    learnSelector(locator, newLocator);

  } else {
    console.log("⚠️ No smart rule matched");
  }
}
