import fs from "fs";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

export interface VisionResult {
  description: string;
  visibleElements: string[];
  pageType?: string;
}



/**
 * Analyze screenshot with LLaVA
 */
export async function analyzeVision(
  screenshotPath: string,
  instruction: string
): Promise<VisionResult> {

  const imageBase64 = fs.readFileSync(
    screenshotPath,
    {
      encoding: "base64"
    }
  );

  const prompt = `
You are a UI vision analyzer for automation testing.

Instruction:
${instruction}

Analyze screenshot and return JSON:

{
  "description": "what is visible",
  "visibleElements": ["login button"],
  "pageType": "login | inventory | cart | form | unknown"
}
`;

  const response = await fetch(
    OLLAMA_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llava",
        prompt,
        images: [imageBase64],
        stream: false
      })
    }
  );

  const data = await response.json();

  try {

    return JSON.parse(data.response);

  } catch {

    return {
      description: data.response || "",
      visibleElements: [],
      pageType: "unknown"
    };
  }
}