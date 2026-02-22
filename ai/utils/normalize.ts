export interface AgentAction {
  action: string;
  selector?: string;
  value?: string;
  url?: string;
}

export function normalizeAction(raw: any): AgentAction {
  if (!raw) return raw;

  const actionMap: Record<string, string> = {
    type: "fill",
    input: "fill",
    enter: "fill",
    press: "press",
    clickElement: "click",
    navigate: "goto",
    open: "goto",
  };

  const action = actionMap[raw.action] || raw.action;

  return {
    action,
    selector: raw.selector || raw.target,
    value: raw.value || raw.text,
    url: raw.url,
  };
}