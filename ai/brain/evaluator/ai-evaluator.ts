/**
 * V8 SMART Evaluator
 * Understand failure → choose best healing strategy
 */

import { detectErrorType, ErrorAnalysis } from "../analyzer/error-analyzer";

export type HealStrategy =
  | "heal-locator"
  | "wait-retry"
  | "vision-heal"
  | "regenerate"
  | "abort";

export interface EvaluationResult {
  type: string;
  message: string;
  strategy: HealStrategy;
  severity: "low" | "medium" | "high";
  confidence: number;
}

/**
 * Extract most relevant error line
 */
function extractMainError(log: string): string {

  if (!log) return "Unknown error";

  const lines = log.split("\n");

  for (const line of lines) {

    const l = line.toLowerCase();

    if (
      l.includes("error") ||
      l.includes("failed") ||
      l.includes("timeout") ||
      l.includes("locator")
    ) {
      return line.trim();
    }
  }

  return log.slice(0, 300);
}

/**
 * Decide strategy from structured error
 */
function decideStrategy(error: ErrorAnalysis): HealStrategy {

  switch (error.type) {

    case "locator":
      return "vision-heal"; // V8 uses vision for locator recovery

    case "timeout":
      return "wait-retry";

    case "navigation":
      return "wait-retry";

    case "assertion":
      return "regenerate";

    case "dom":
      return "wait-retry";

    case "network":
      return "wait-retry";

    default:
      return "regenerate";
  }
}

/**
 * Main evaluator
 */
export function evaluateFailure(errorLog: string): EvaluationResult {

  if (!errorLog) {
    return {
      type: "unknown",
      message: "No error output",
      strategy: "regenerate",
      severity: "low",
      confidence: 0.3
    };
  }

  const mainMessage = extractMainError(errorLog);

  // Use analyzer V8
  const analysis = detectErrorType(errorLog);

  const strategy = decideStrategy(analysis);

  let confidence = 0.7;

  if (analysis.type === "unknown") {
    confidence = 0.4;
  }

  if (analysis.severity === "high") {
    confidence += 0.1;
  }

  return {
    type: analysis.type,
    message: mainMessage,
    strategy,
    severity: analysis.severity,
    confidence
  };
}