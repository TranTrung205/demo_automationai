// ai/brain/analyzer/error-analyzer.ts

export type ErrorCategory =
  | "SELECTOR_NOT_FOUND"
  | "TIMEOUT"
  | "NAVIGATION_ERROR"
  | "ASSERTION_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export interface ErrorAnalysis {
  category: ErrorCategory;
  recoverable: boolean;
  suggestedAction: "HEAL" | "RETRY" | "REPLAN" | "ABORT";
  confidence: number; // 0-100
  rootCause?: string;
}

export function analyzeError(error: unknown): ErrorAnalysis {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Selector issues
  if (
    message.includes("locator") ||
    message.includes("selector") ||
    message.includes("not found")
  ) {
    return {
      category: "SELECTOR_NOT_FOUND",
      recoverable: true,
      suggestedAction: "HEAL",
      confidence: 90,
      rootCause: "Element selector likely changed",
    };
  }

  // Timeout
  if (message.includes("timeout")) {
    return {
      category: "TIMEOUT",
      recoverable: true,
      suggestedAction: "RETRY",
      confidence: 85,
      rootCause: "Element slow render or async issue",
    };
  }

  // Navigation
  if (message.includes("navigation") || message.includes("net::")) {
    return {
      category: "NAVIGATION_ERROR",
      recoverable: true,
      suggestedAction: "REPLAN",
      confidence: 80,
      rootCause: "Unexpected route change or redirect",
    };
  }

  // Assertion
  if (message.includes("expect") || message.includes("assert")) {
    return {
      category: "ASSERTION_FAILED",
      recoverable: false,
      suggestedAction: "REPLAN",
      confidence: 75,
      rootCause: "UI state does not match expected condition",
    };
  }

  // Network
  if (message.includes("network")) {
    return {
      category: "NETWORK_ERROR",
      recoverable: true,
      suggestedAction: "RETRY",
      confidence: 70,
      rootCause: "Backend/API instability",
    };
  }

  return {
    category: "UNKNOWN",
    recoverable: false,
    suggestedAction: "ABORT",
    confidence: 40,
    rootCause: "Unclassified execution failure",
  };
}