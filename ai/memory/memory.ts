import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "memory.json");

export function loadMemory(): any {

  if (!fs.existsSync(FILE)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(FILE, "utf-8")
  );
}

export function saveMemory(data: any) {

  fs.writeFileSync(
    FILE,
    JSON.stringify(data, null, 2)
  );
}