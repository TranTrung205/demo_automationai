export function detectErrorType(log: string) {
  if (log.includes("Timeout"))
    return "timeout";

  if (log.includes("locator"))
    return "selector";

  if (log.includes("expect"))
    return "assertion";

  return "unknown";
}