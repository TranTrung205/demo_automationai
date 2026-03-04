// ai/brain/analyzer/ui-state-analyzer.ts

import { Page } from "@playwright/test";

export interface UIState {
  url: string;
  title: string;
  hasModal: boolean;
  hasErrorBanner: boolean;
  hasLoader: boolean;
  domHash: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export async function analyzeUIState(page: Page): Promise<UIState> {
  const url = page.url();
  const title = await page.title();

  const html = await page.content();

  const hasModal = html.includes("modal");
  const hasErrorBanner =
    html.includes("error") || html.includes("alert") || html.includes("invalid");
  const hasLoader =
    html.includes("spinner") || html.includes("loading");

  return {
    url,
    title,
    hasModal,
    hasErrorBanner,
    hasLoader,
    domHash: simpleHash(html),
  };
}