const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

export interface OllamaOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface OllamaResponse {
  response: string;
}

const DEFAULT_MODEL = "phi3";

export async function ollamaChat(
  prompt: string,
  options: OllamaOptions = {}
): Promise<string> {

  const {
    temperature = 0.1,
    maxTokens = 200,
    model = DEFAULT_MODEL
  } = options;

  for (let attempt = 1; attempt <= 2; attempt++) {

    try {

      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens
          }
        })
      });

      const data = await res.json() as OllamaResponse;

      if (!data.response) {
        throw new Error("Empty LLM response");
      }

      return data.response;

    } catch (err) {

      console.log("⚠️ Ollama attempt failed:", attempt);

      if (attempt === 2) {
        throw err;
      }
    }
  }

  return "";
}