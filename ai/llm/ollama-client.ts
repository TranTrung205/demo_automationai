import axios from "axios";

export async function ollamaChat(prompt: string): Promise<string> {
  try {
    const res = await axios.post("http://127.0.0.1:11434/api/chat", {
      model: "deepseek-coder:6.7b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });

    return res.data.message?.content || "";
  } catch (err: any) {
    console.error("❌ Ollama error:", err.message);
    return "";
  }
}