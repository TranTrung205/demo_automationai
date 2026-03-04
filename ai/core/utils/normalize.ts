// ai/core/utils/normalize.ts

export function normalizeText(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/gi, "")
    .trim();
}

export function normalizeSelector(selector: string): string {
  if (!selector) return "";

  return selector
    .replace(/\s+/g, " ")
    .replace(/['"]/g, "")
    .trim();
}

export function truncateText(text: string, maxLength = 2000): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
}