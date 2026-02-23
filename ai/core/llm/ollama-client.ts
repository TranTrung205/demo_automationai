import axios from "axios";

export interface OllamaOptions {
  model?: string;
  system?: string;
  temperature?: number;
  timeoutMs?: number;
  retries?: number;
  maxTokens?: number;
}

const DEFAULT_MODEL = "phi3";
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  if (!text) return "";

  return text
    .replace(/```json/g, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "")
    .trim();
}


/**
 * V6 Ollama Chat PRO
 * ✔ higher timeout
 * ✔ retry + backoff
 * ✔ latency logs
 * ✔ CPU friendly
 * ✔ safe return
 */
export async function ollamaChat(
  prompt: string,
  options: OllamaOptions = {}
): Promise<string> {

  const {
    model = DEFAULT_MODEL,
    system,
    temperature = 0.1,
    timeoutMs = 180000,   // ⭐ 3 minutes (important)
    retries = 2,
    maxTokens = 400       // ⭐ reduce for phi3 speed
  } = options;

  const messages: any[] = [];

  if (system) {
    messages.push({
      role: "system",
      content: system
    });
  }

  messages.push({
    role: "user",
    content: prompt
  });

  for (let attempt = 1; attempt <= retries; attempt++) {

    const start = Date.now();

    try {

      console.log(`🧠 Ollama attempt ${attempt}`);

      const res = await axios.post(
        OLLAMA_URL,
        {
          model,
          messages,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens,
            top_p: 0.9,
            repeat_penalty: 1.1
          }
        },
        {
          timeout: timeoutMs
        }
      );

      const latency = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`⚡ Ollama response in ${latency}s`);

      const content = res.data?.message?.content || "";

      if (!content) {
        throw new Error("Empty LLM response");
      }

      return cleanResponse(content);

    } catch (err: any) {

      const msg = err?.message || "Unknown error";

      console.log(`⚠️ Ollama error attempt ${attempt}: ${msg}`);

      if (attempt === retries) {
        console.error("❌ Ollama failed after retries");
        return "";
      }

      // exponential backoff
      await sleep(2000 * attempt);
    }
  }

  return "";
}