import fs from "fs";
import path from "path";

const FEATURES_FILE = "agent/features.json";

export function detectNewFeature(): string | null {

  const testDir = "tests";

  if (!fs.existsSync(FEATURES_FILE)) {
    fs.writeFileSync(FEATURES_FILE, JSON.stringify([]));
  }

  const knownFeatures: string[] = JSON.parse(
    fs.readFileSync(FEATURES_FILE, "utf-8")
  );

  const files = fs.readdirSync(testDir);

  for (const file of files) {
    if (!knownFeatures.includes(file)) {

      knownFeatures.push(file);
      fs.writeFileSync(FEATURES_FILE, JSON.stringify(knownFeatures, null, 2));

      console.log("🆕 New feature detected:", file);
      return file;
    }
  }

  return null;
}
