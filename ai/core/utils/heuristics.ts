export function isNavigationInstruction(text: string) {

  const t = text.toLowerCase();

  return (
    t.includes("open") ||
    t.includes("navigate") ||
    t.includes("go to") ||
    t.includes("website")
  );
}


export function isLoginInstruction(text: string) {

  const t = text.toLowerCase();

  return (
    t.includes("login") ||
    t.includes("username") ||
    t.includes("password")
  );
}