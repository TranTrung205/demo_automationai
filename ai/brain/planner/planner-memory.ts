/**
 * V8 Planner Memory
 * Lightweight memory for better planning decisions
 */

export interface PlannerMemory {

  visitedPages: string[];

  recentSteps: string[];

  lastError?: string;

  hints?: string[];

  timestamp: number;
}


/**
 * Create empty memory
 */
export function createMemory(): PlannerMemory {

  return {
    visitedPages: [],
    recentSteps: [],
    hints: [],
    timestamp: Date.now()
  };
}


/**
 * Update visited page
 */
export function rememberPage(
  memory: PlannerMemory,
  pageType?: string
) {

  if (!pageType) return;

  if (!memory.visitedPages.includes(pageType)) {
    memory.visitedPages.push(pageType);
  }
}


/**
 * Remember executed step
 */
export function rememberStep(
  memory: PlannerMemory,
  stepDescription: string
) {

  if (!stepDescription) return;

  memory.recentSteps.push(stepDescription);

  // keep memory small
  if (memory.recentSteps.length > 10) {
    memory.recentSteps.shift();
  }
}


/**
 * Remember error
 */
export function rememberError(
  memory: PlannerMemory,
  error: string
) {

  memory.lastError = error;
}


/**
 * Add planning hint
 */
export function addHint(
  memory: PlannerMemory,
  hint: string
) {

  if (!hint) return;

  memory.hints = memory.hints || [];

  memory.hints.push(hint);

  if (memory.hints.length > 5) {
    memory.hints.shift();
  }
}