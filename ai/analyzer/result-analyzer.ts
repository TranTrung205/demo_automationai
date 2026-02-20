export function analyzeResult(output: string) {
  if (output.includes("failed"))
    return { success: false };

  if (output.includes("passed"))
    return { success: true };

  return { success: false };
}