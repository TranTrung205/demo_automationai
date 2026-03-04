// ai/brain/analyzer/vision-analyzer.ts

import { Page } from "@playwright/test";

export interface VisionMatch {
  found: boolean;
  textMatches: string[];
  approximateLocation?: {
    x: number;
    y: number;
  };
  confidence: number; // 0-100
}

export async function analyzeVision(
  page: Page,
  keyword: string
): Promise<VisionMatch> {
  const textContent = await page.evaluate(() => document.body.innerText);

  const lower = textContent.toLowerCase();
  const target = keyword.toLowerCase();

  const found = lower.includes(target);

  const matches = found
    ? lower
        .split("\n")
        .filter((line) => line.includes(target))
        .slice(0, 5)
    : [];

  // Simple heuristic confidence
  const confidence = found ? Math.min(90, matches.length * 20) : 0;

  return {
    found,
    textMatches: matches,
    confidence,
  };
}