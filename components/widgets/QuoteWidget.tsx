// import type { Quote } from "@/types";

// export default function QuoteWidget({ quote }: { quote: Quote }) {
//   return (
//     <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
//       <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//         Quote of the Day
//       </h3>
//       <blockquote className="border-l-4 border-indigo-500 pl-4">
//         <p className="text-slate-700 dark:text-slate-300">&ldquo;{quote.content}&rdquo;</p>
//         <cite className="mt-2 block text-sm font-medium not-italic text-indigo-600 dark:text-indigo-400">
//           — {quote.author}
//         </cite>
//       </blockquote>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";

interface Quote {
  content: string;
  author?: string;
}

export default function QuoteWidget() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/quote");
        const data = await res.json();
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        Loading quote...
      </div>
    );
  }

  if (!quote?.content) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h3 className="text-sm uppercase text-gray-400 dark:text-gray-300">Quote of the Day</h3>
        <p className="mt-3 text-gray-600 dark:text-gray-400">No quote available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-sm uppercase text-gray-400 dark:text-gray-300">
        Quote of the Day
      </h3>
      <p className="mt-3 text-lg font-medium text-gray-800 dark:text-gray-100">
        &ldquo;{quote.content}&rdquo;
      </p>
      <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
        — {quote.author ?? "Unknown"}
      </p>
    </div>
  );
}