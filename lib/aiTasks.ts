import { mockAITasks } from "./mockData";
import type { AITaskSuggestion } from "@/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function parseAIResponse(content: string): AITaskSuggestion[] {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const arr = JSON.parse(jsonMatch[0]) as Record<string, unknown>[];
      return arr.slice(0, 5).map((item, i) => ({
        id: `ai-${i + 1}`,
        title: String(item.title ?? ""),
        reason: String(item.reason ?? ""),
        priority: ["low", "medium", "high"].includes(String(item.priority))
          ? (item.priority as "low" | "medium" | "high")
          : "medium",
      }));
    }
  } catch {
    // ignore
  }
  return [];
}

export async function getAITasks(): Promise<AITaskSuggestion[]> {
  if (!OPENAI_API_KEY) return mockAITasks;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a productivity assistant. Return exactly 5 task suggestions as a JSON array. Each object must have: title (string), reason (string), priority (one of: low, medium, high). Use id as 1-based index (e.g. ai-1, ai-2).",
          },
          {
            role: "user",
            content: "Suggest 5 productivity tasks for today based on best practices.",
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
      next: { revalidate: 300 },
    });

    if (!res.ok) return mockAITasks;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return mockAITasks;
    const parsed = parseAIResponse(content);
    return parsed.length > 0 ? parsed : mockAITasks;
  } catch {
    return mockAITasks;
  }
}
