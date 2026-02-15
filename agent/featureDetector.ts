import fs from "fs";

const SNAPSHOT_PATH = "agent/ui-snapshot.json";

function getCurrentSnapshot() {
  // giả lập scan UI
  return {
    buttons: ["login-button", "logout-button", "checkout-button"]
  };
}

function loadOldSnapshot(): any {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;

  return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
}

function saveSnapshot(snapshot: any) {
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
}

export function detectNewFeature(): string[] {
  const current = getCurrentSnapshot();
  const old = loadOldSnapshot();

  if (!old) {
    saveSnapshot(current);
    return [];
  }

  const newButtons = current.buttons.filter(
    (b: string) => !old.buttons.includes(b)
  );

  saveSnapshot(current);

  return newButtons;
}
