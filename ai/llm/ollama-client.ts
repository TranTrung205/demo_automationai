import axios from "axios";

export interface OllamaOptions {
  model?: string;
  system?: string;
  temperature?: number;
  timeoutMs?: number;
  retries?: number;
}

const DEFAULT_MODEL = "phi3";
const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanResponse(text: string): string {
  if (!text) return "";

  return text
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * PRO Ollama Chat
 * - timeout safe
 * - retry
 * - backoff
 * - clean output
 */
export async function ollamaChat(
  prompt: string,
  options: OllamaOptions = {}
): Promise<string> {

  const {
    model = DEFAULT_MODEL,
    system,
    temperature = 0.2,
    timeoutMs = 300000,
    retries = 3
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

    try {

      console.log(`🧠 Ollama attempt ${attempt}`);

      const res = await axios.post(
        OLLAMA_URL,
        {
          model,
          messages,
          options: { temperature },
          stream: false
        },
        {
          timeout: timeoutMs
        }
      );

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