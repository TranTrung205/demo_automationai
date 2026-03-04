// ai/core/utils/heuristics.ts

import { normalizeText } from "./normalize";

export function similarityScore(a: string, b: string): number {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);

  if (!s1 || !s2) return 0;

  if (s1 === s2) return 100;

  const shorter = s1.length < s2.length ? s1 : s2;
  const longer = s1.length >= s2.length ? s1 : s2;

  if (longer.includes(shorter)) {
    return Math.round((shorter.length / longer.length) * 100);
  }

  return 0;
}

export function findBestMatch(
  target: string,
  candidates: string[]
): { match: string | null; score: number } {

  let bestScore = 0;
  let bestMatch: string | null = null;

  for (const candidate of candidates) {
    const score = similarityScore(target, candidate);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  return { match: bestMatch, score: bestScore };
}

export function isLikelyNavigationChange(oldUrl: string, newUrl: string): boolean {
  if (!oldUrl || !newUrl) return false;

  const baseOld = oldUrl.split("?")[0];
  const baseNew = newUrl.split("?")[0];

  return baseOld !== baseNew;
}

export function isLikelyErrorPage(text: string): boolean {
  const normalized = normalizeText(text);

  return (
    normalized.includes("error") ||
    normalized.includes("not found") ||
    normalized.includes("invalid") ||
    normalized.includes("failed")
  );
}