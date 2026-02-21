import fs from "fs/promises";
import path from "path";

const MEMORY_FILE = path.join(process.cwd(), "memory-db.json");

export async function loadMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveMemory(entry: any) {
  const memory = await loadMemory();
  memory.push(entry);

  await fs.writeFile(
    MEMORY_FILE,
    JSON.stringify(memory, null, 2)
  );
}