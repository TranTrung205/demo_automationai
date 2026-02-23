export function normalizeAction(action: string) {

  if (!action) return action;

  const a = action.toLowerCase();

  if (
    a.includes("open") ||
    a.includes("goto") ||
    a.includes("navigate")
  )
    return "goto";

  if (a.includes("click"))
    return "click";

  if (
    a.includes("fill") ||
    a.includes("type") ||
    a.includes("input")
  )
    return "fill";

  return action;
}