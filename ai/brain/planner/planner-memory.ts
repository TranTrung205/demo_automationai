import { TestStep } from "./step-types";

const memoryStore: {
  successfulSteps: TestStep[];
  failedSelectors: string[];
} = {
  successfulSteps: [],
  failedSelectors: []
};

export function rememberSuccess(step: TestStep) {
  memoryStore.successfulSteps.push(step);
}

export function rememberFailure(selector: string) {
  memoryStore.failedSelectors.push(selector);
}

export function getSuccessfulSteps(): TestStep[] {
  return memoryStore.successfulSteps;
}

export function getFailedSelectors(): string[] {
  return memoryStore.failedSelectors;
}

export function clearMemory() {
  memoryStore.successfulSteps = [];
  memoryStore.failedSelectors = [];
}