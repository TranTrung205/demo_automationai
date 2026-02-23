/**
 * Allowed step actions for agent execution
 */
export type StepAction =
  | "goto"
  | "click"
  | "fill"
  | "select"
  | "wait"
  | "assert"
  | "hover"
  | "press"
  | "unknown";


/**
 * Core test step definition
 */
export interface TestStep {

  id: string;

  description: string;

  action: StepAction;

  target: string;

  value?: string;

  expected?: string;

  timeout?: number;

  optional?: boolean;

  meta?: {

    page?: string;

    confidence?: number;

    source?: "planner" | "healer" | "memory";

  };
}