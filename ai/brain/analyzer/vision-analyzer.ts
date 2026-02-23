import fs from "fs";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const VISION_MODEL = "llava"; // vision model (IMPORTANT)

/**
 * Vision analysis result
 */
export interface VisionResult {
  description: string;
  visibleElements: string[];
  pageType: string;
  confidence?: number;
}

/**
 * Safe JSON parse from LLM output
 */
function safeParse(text: string): VisionResult {

  try {

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }

  } catch (err) {
    console.warn("⚠️ Vision JSON parse failed");
  }

  return {
    description: text || "unknown screen",
    visibleElements: [],
    pageType: "unknown",
    confidence: 0.3
  };
}

/**
 * Analyze screenshot using LLaVA vision model
 */
export async function analyzeVision(
  screenshotPath: string,
  instruction: string
): Promise<VisionResult> {

  if (!fs.existsSync(screenshotPath)) {
    throw new Error("Screenshot not found: " + screenshotPath);
  }

  const imageBase64 = fs.readFileSync(screenshotPath, {
    encoding: "base64"
  });

  const prompt = `
You are a UI vision analyzer for an automation testing AI agent.

Goal:
Understand what is visible on screen to help automation planning.

User instruction:
${instruction}

Return STRICT JSON only:

{
  "description": "short description of screen",
  "visibleElements": ["login button", "username input"],
  "pageType": "login | inventory | cart | form | modal | unknown",
  "confidence": 0.0-1.0
}
`;

  try {

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        prompt,
        images: [imageBase64],
        stream: false,
        options: {
          temperature: 0.1
        }
      })
    });

    const data = await response.json();

    const result = safeParse(data.response);

    console.log("👁️ Vision:", result.pageType);

    return result;

  } catch (err) {

    console.warn("⚠️ Vision analysis error:", err);

    return {
      description: "vision failed",
      visibleElements: [],
      pageType: "unknown",
      confidence: 0.2
    };
  }
}