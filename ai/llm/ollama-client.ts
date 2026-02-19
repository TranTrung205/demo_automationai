import axios from "axios";

export async function askLLM(prompt: string): Promise<string> {
  try {
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "llama3.1:8b",
      prompt,
      stream: false,
    });

    return response.data.response;
  } catch (error: any) {
    console.error("LLM Error:", error.message);
    throw error;
  }
}
