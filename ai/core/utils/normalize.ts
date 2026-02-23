import { StepAction } from "../../brain/planner/step-types";


/**
 * Normalize AI action text
 */
export function normalizeAction(action: string): StepAction {

  if (!action) return "unknown";

  const a = action.toLowerCase();

  if (a.includes("click")) return "click";

  if (a.includes("fill") || a.includes("type"))
    return "fill";

  if (a.includes("goto") || a.includes("navigate"))
    return "goto";

  if (a.includes("wait"))
    return "wait";

  if (a.includes("assert") || a.includes("verify"))
    return "assert";

  if (a.includes("hover"))
    return "hover";

  if (a.includes("press"))
    return "press";

  return "unknown";
}