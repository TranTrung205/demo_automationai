import { analyzeVision, VisionResult } from "./vision-analyzer";

export interface UIState {
  domSummary: string;
  vision?: VisionResult | null;

  pageType?: string;
  confidence?: number;

  timestamp: number;
}

/**
 * Merge DOM + Vision into unified UI state
 * Used by planner, evaluator, healer
 */
export async function analyzeUIState(
  domSummary: string,
  screenshotPath?: string,
  instruction?: string
): Promise<UIState> {

  let vision: VisionResult | null = null;
  let pageType = "unknown";
  let confidence = 0.5;

  try {

    if (screenshotPath) {
      vision = await analyzeVision(
        screenshotPath,
        instruction || ""
      );

      if (vision?.pageType) {
        pageType = vision.pageType;
        confidence = 0.9;
      }
    }

  } catch (err) {

    console.warn("⚠️ Vision analysis failed:", err);

    vision = null;
    pageType = "unknown";
    confidence = 0.3;
  }

  return {
    domSummary,
    vision,
    pageType,
    confidence,
    timestamp: Date.now()
  };
}