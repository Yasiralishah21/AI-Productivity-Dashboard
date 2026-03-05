// import type { NewsArticle } from "@/types";

// export default function NewsWidget({ articles }: { articles: { title: string; source: string; url: string }[] }) {
//   return (
//     <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
//       <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//         Top Headlines
//       </h3>
//       <ul className="space-y-3">
//         {articles.map((article, i) => (
//           <li key={i}>
//             <a
//               href={article.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
//             >
//               <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
//                 {article.title}
//               </p>
//               <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
//                 {article.source}
//               </p>
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

/**
 * NewsWidget: Fetches latest news from /api/news. Refresh button to refetch.
 * Styled with Tailwind to match dashboard cards.
 */

type Article = { title: string; url: string; source: string };

interface NewsWidgetProps {
  /** City from Home flow; news query includes city when set. */
  city?: string | null;
}

export default function NewsWidget({ city }: NewsWidgetProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = city
        ? `/api/news?city=${encodeURIComponent(city)}`
        : "/api/news";
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [city]);

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Top Headlines
        <button
          onClick={fetchNews}
          className="ml-2 text-xs text-blue-500 hover:underline"
        >
          Refresh
        </button>
      </h3>
      <ul className="space-y-3">
        {articles.map((article, i) => (
          <li key={i}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                {article.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {article.source}
              </p>
            </a>
          </li>
        ))}
        {loading && <li className="text-xs text-slate-500">Loading...</li>}
      </ul>
    </div>
  );
}