/**
 * Autonomous AI Evaluator
 * Analyze failure → decide healing strategy → return structured decision
 */

import {
  analyzeError,
  ErrorAnalysis,
  ErrorCategory,
} from "../analyzer/error-analyzer";

export type HealStrategy =
  | "heal-locator"
  | "wait-retry"
  | "vision-heal"
  | "replan"
  | "abort";

export interface EvaluationResult {
  category: ErrorCategory;
  message: string;
  strategy: HealStrategy;
  severity: "low" | "medium" | "high";
  confidence: number; // 0 - 100
  recoverable: boolean;
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
      l.includes("locator") ||
      l.includes("navigation")
    ) {
      return line.trim();
    }
  }

  return log.slice(0, 300);
}

/**
 * Map ErrorAnalysis → HealStrategy
 */
function decideStrategy(analysis: ErrorAnalysis): HealStrategy {
  switch (analysis.category) {
    case "SELECTOR_NOT_FOUND":
      // Autonomous upgrade:
      // First try locator heal, fallback to vision
      return "vision-heal";

    case "TIMEOUT":
      return "wait-retry";

    case "NAVIGATION_ERROR":
      return "replan";

    case "ASSERTION_FAILED":
      return "replan";

    case "NETWORK_ERROR":
      return "wait-retry";

    case "UNKNOWN":
    default:
      return "abort";
  }
}

/**
 * Derive severity based on category + recoverable
 */
function deriveSeverity(
  category: ErrorCategory,
  recoverable: boolean
): "low" | "medium" | "high" {
  if (!recoverable) return "high";

  switch (category) {
    case "SELECTOR_NOT_FOUND":
      return "medium";

    case "TIMEOUT":
      return "low";

    case "NAVIGATION_ERROR":
      return "medium";

    case "ASSERTION_FAILED":
      return "high";

    case "NETWORK_ERROR":
      return "medium";

    default:
      return "medium";
  }
}

/**
 * Main evaluator entry
 */
export function evaluateFailure(errorLog: string): EvaluationResult {
  if (!errorLog) {
    return {
      category: "UNKNOWN",
      message: "No error output",
      strategy: "abort",
      severity: "low",
      confidence: 10,
      recoverable: false,
    };
  }

  const mainMessage = extractMainError(errorLog);

  // Use Autonomous analyzer
  const analysis = analyzeError(errorLog);

  const strategy = decideStrategy(analysis);

  const severity = deriveSeverity(
    analysis.category,
    analysis.recoverable
  );

  // Confidence logic:
  // Base = analyzer confidence
  // Penalize unknown
  // Slight boost if recoverable
  let confidence = analysis.confidence;

  if (analysis.category === "UNKNOWN") {
    confidence -= 20;
  }

  if (analysis.recoverable) {
    confidence += 5;
  }

  // Clamp 0-100
  confidence = Math.max(0, Math.min(100, confidence));

  return {
    category: analysis.category,
    message: mainMessage,
    strategy,
    severity,
    confidence,
    recoverable: analysis.recoverable,
  };
}