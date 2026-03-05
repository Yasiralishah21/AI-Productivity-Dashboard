import type { Quote } from "@/types";
import { mockQuote } from "./mockData";

export async function getQuote(): Promise<Quote> {
  try {
    const res = await fetch("https://api.quotable.io/random?maxLength=120", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return mockQuote;
    const data = await res.json();
    return { content: data.content ?? mockQuote.content, author: data.author ?? mockQuote.author };
  } catch {
    return mockQuote;
  }
}
