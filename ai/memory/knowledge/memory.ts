export interface MemoryRecord {

  id: string;

  type: "locator" | "healing" | "planner" | "vision";

  key: string;

  value: any;

  confidence: number;

  createdAt: number;

  usageCount: number;
}

const memoryStore: MemoryRecord[] = [];

/**
 * Save new memory
 */
export function saveMemory(record: Omit<MemoryRecord, "id" | "createdAt" | "usageCount">) {

  memoryStore.push({
    ...record,
    id: Date.now().toString(),
    createdAt: Date.now(),
    usageCount: 0
  });
}

/**
 * Retrieve memory by key
 */
export function getMemory(key: string): MemoryRecord | undefined {

  const found = memoryStore.find(m => m.key === key);

  if (found) {
    found.usageCount++;
  }

  return found;
}

/**
 * Get all memory
 */
export function getAllMemory(): MemoryRecord[] {
  return memoryStore;
}