import type { NewsArticle } from "@/types";
import { mockNews } from "./mockData";

const API_KEY = process.env.NEWS_API_KEY;

export async function getNews(limit = 5): Promise<NewsArticle[]> {
  if (!API_KEY) return mockNews.slice(0, limit);

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=${limit}&apiKey=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return mockNews.slice(0, limit);
    const data = await res.json();
    if (data.status === "error") return mockNews.slice(0, limit);
    const articles = (data.articles ?? []).slice(0, limit).filter((a: { title?: string }) => a.title);
    return articles.map((a: { title: string; source?: { name?: string }; url: string; publishedAt?: string }) => ({
      title: a.title,
      source: a.source?.name ?? "Unknown",
      url: a.url ?? "#",
      publishedAt: a.publishedAt,
    }));
  } catch {
    return mockNews.slice(0, limit);
  }
}
