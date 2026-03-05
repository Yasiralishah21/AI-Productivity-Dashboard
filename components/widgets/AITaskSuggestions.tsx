// "use client";

// import { useEffect, useState } from "react";
// import type { AITaskSuggestion } from "@/types";

// const priorityColors = {
//   high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
//   medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
//   low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
// };

// export default function AITaskSuggestions({ initialData }: { initialData?: AITaskSuggestion[] | null }) {
//   const [suggestions, setSuggestions] = useState<AITaskSuggestion[] | null>(initialData ?? null);
//   const [loading, setLoading] = useState(!initialData);

//   useEffect(() => {
//     if (initialData) return;
//     let cancelled = false;
//     fetch("/api/ai-tasks")
//       .then((res) => res.json())
//       .then((data) => {
//         if (!cancelled) setSuggestions(Array.isArray(data) ? data : []);
//       })
//       .catch(() => {
//         if (!cancelled) setSuggestions([]);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [initialData]);

//   if (loading) {
//     return (
//       <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
//         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           AI Task Suggestions
//         </h3>
//         <div className="flex items-center justify-center py-8">
//           <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
//         </div>
//       </div>
//     );
//   }

//   if (!suggestions?.length) {
//     return (
//       <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
//         <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           AI Task Suggestions
//         </h3>
//         <p className="text-sm text-slate-500 dark:text-slate-400">No suggestions right now.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
//       <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//         AI Task Suggestions
//       </h3>
//       <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
//         {suggestions.map((s) => (
//           <div
//             key={s.id}
//             className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
//           >
//             <div className="flex items-start justify-between gap-2">
//               <p className="text-sm font-medium text-slate-900 dark:text-white">{s.title}</p>
//               <span
//                 className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${priorityColors[s.priority] ?? priorityColors.medium}`}
//               >
//                 {s.priority}
//               </span>
//             </div>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.reason}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";

type Task = { title: string; priority: string; notes: string };

export default function AiTasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-tasks");
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to fetch AI tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        AI Task Suggestions
        <button
          onClick={fetchTasks}
          className="ml-2 text-xs text-blue-500 hover:underline"
        >
          Refresh
        </button>
      </h3>
      <ul className="space-y-3">
        {loading && <li className="text-xs text-slate-500">Loading...</li>}
        {tasks.map((task, i) => (
          <li key={i} className="rounded-lg p-2 bg-slate-50 dark:bg-slate-700/50">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{task.priority}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{task.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}