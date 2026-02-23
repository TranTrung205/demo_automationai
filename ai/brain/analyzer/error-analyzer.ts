/**
 * Error types used across the agent
 */
export type ErrorType =
  | "timeout"
  | "locator"
  | "assertion"
  | "navigation"
  | "dom"
  | "network"
  | "unknown";

export interface ErrorAnalysis {
  type: ErrorType;
  message: string;
  severity: "low" | "medium" | "high";
  hint?: string;
}

/**
 * Detect Playwright error type from logs
 * V8 version: richer analysis for healing + vision support
 */
export function detectErrorType(log: string): ErrorAnalysis {

  if (!log) {
    return {
      type: "unknown",
      message: "",
      severity: "low"
    };
  }

  const text = log.toLowerCase();

  // Timeout
  if (text.includes("timeout")) {
    return {
      type: "timeout",
      message: log,
      severity: "medium",
      hint: "Element may not be visible yet or page still loading"
    };
  }

  // Locator / selector issues
  if (
    text.includes("locator") ||
    text.includes("selector") ||
    text.includes("not found") ||
    text.includes("strict mode violation")
  ) {
    return {
      type: "locator",
      message: log,
      severity: "high",
      hint: "Selector may be incorrect or UI changed"
    };
  }

  // Assertion failures
  if (
    text.includes("expect") ||
    text.includes("assert") ||
    text.includes("tohave") ||
    text.includes("received")
  ) {
    return {
      type: "assertion",
      message: log,
      severity: "medium",
      hint: "Expected UI state not matching actual state"
    };
  }

  // Navigation
  if (
    text.includes("navigation") ||
    text.includes("net::err") ||
    text.includes("failed to load")
  ) {
    return {
      type: "navigation",
      message: log,
      severity: "high",
      hint: "Page navigation failed or URL incorrect"
    };
  }

  // DOM detached / stale element
  if (
    text.includes("detached") ||
    text.includes("stale") ||
    text.includes("element is not attached")
  ) {
    return {
      type: "dom",
      message: log,
      severity: "medium",
      hint: "DOM updated and element reference lost"
    };
  }

  // Network
  if (
    text.includes("network") ||
    text.includes("fetch") ||
    text.includes("connection")
  ) {
    return {
      type: "network",
      message: log,
      severity: "high",
      hint: "Network request failed"
    };
  }

  return {
    type: "unknown",
    message: log,
    severity: "low"
  };
}