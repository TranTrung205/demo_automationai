/**
 * Detect Playwright error type from logs
 */
export function detectErrorType(log: string): string {

  if (!log) return "unknown";

  const text = log.toLowerCase();

  if (text.includes("timeout"))
    return "timeout";

  if (text.includes("locator") || text.includes("selector"))
    return "locator";

  if (text.includes("expect") || text.includes("assert"))
    return "assertion";

  if (text.includes("navigation"))
    return "navigation";

  if (text.includes("detached"))
    return "dom";

  return "unknown";
}