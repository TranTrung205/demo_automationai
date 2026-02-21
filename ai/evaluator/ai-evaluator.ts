/**
 * SMART Evaluator PRO
 * Hiểu lỗi → chọn strategy heal chính xác hơn
 */

export interface EvaluationResult {
  type: string;
  message: string;
  strategy: string;
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
 * Main evaluator
 */
export function evaluateFailure(error: string): EvaluationResult {

  if (!error) {
    return {
      type: "unknown",
      message: "No error output",
      strategy: "regenerate"
    };
  }

  const msg = extractMainError(error);
  const lower = msg.toLowerCase();

  /**
   * LOCATOR ERRORS
   */
  if (
    lower.includes("locator") ||
    lower.includes("selector") ||
    lower.includes("not found") ||
    lower.includes("strict mode violation")
  ) {
    return {
      type: "locator",
      message: msg,
      strategy: "heal-locator"
    };
  }

  /**
   * TIMEOUT ERRORS
   */
  if (
    lower.includes("timeout") ||
    lower.includes("waiting for") ||
    lower.includes("loadstate")
  ) {
    return {
      type: "timeout",
      message: msg,
      strategy: "wait-retry"
    };
  }

  /**
   * ASSERTION ERRORS
   */
  if (
    lower.includes("expect") ||
    lower.includes("tohave") ||
    lower.includes("assert")
  ) {
    return {
      type: "assertion",
      message: msg,
      strategy: "regenerate"
    };
  }

  /**
   * NAVIGATION ERRORS
   */
  if (
    lower.includes("navigation") ||
    lower.includes("net::") ||
    lower.includes("page.goto")
  ) {
    return {
      type: "navigation",
      message: msg,
      strategy: "wait-retry"
    };
  }

  /**
   * SYNTAX / COMPILATION
   */
  if (
    lower.includes("syntaxerror") ||
    lower.includes("unexpected token") ||
    lower.includes("cannot find name")
  ) {
    return {
      type: "syntax",
      message: msg,
      strategy: "regenerate"
    };
  }

  /**
   * DEFAULT
   */
  return {
    type: "unknown",
    message: msg,
    strategy: "regenerate"
  };
}