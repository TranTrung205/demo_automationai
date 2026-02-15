import fs from "fs";

const MEMORY_PATH = "agent/memory.json";

function loadMemory(): any {
  if (!fs.existsSync(MEMORY_PATH)) {
    return { selectors: {} };
  }

  return JSON.parse(fs.readFileSync(MEMORY_PATH, "utf8"));
}

function saveMemory(memory: any) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

export function learnSelector(oldSelector: string, newSelector: string) {
  const memory = loadMemory();

  memory.selectors[oldSelector] = newSelector;

  saveMemory(memory);

  console.log(`🧠 Memory learned: ${oldSelector} → ${newSelector}`);
}

export function applyMemoryFix(): boolean {
  const memory = loadMemory();

  if (!memory.selectors) return false;

  let code = fs.readFileSync("tests/login.spec.ts", "utf8");

  let changed = false;

  for (const oldSel in memory.selectors) {
    const newSel = memory.selectors[oldSel];

    if (code.includes(oldSel)) {
      code = code.replaceAll(oldSel, newSel);
      changed = true;

      console.log(`🧠 Applied memory fix: ${oldSel} → ${newSel}`);
    }
  }

  if (changed) {
    fs.writeFileSync("tests/login.spec.ts", code);
  }

  return changed;
}
