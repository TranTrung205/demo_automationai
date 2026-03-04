export function mapStepToAction(s: any) {
  return {
    action: s.action,
    target: s.target,
    value: s.value,
  };
}

export function mapSteps(rawSteps: any[]) {
  return rawSteps.map(mapStepToAction);
}