"use client";
import { useEffect, useState } from "react";

export default function TaskWidget({ userTasks }: { userTasks: string[] }) {
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle tasks for AI-like suggestion
    const shuffled = [...userTasks].sort(() => Math.random() - 0.5);
    setTasks(shuffled);
  }, [userTasks]);

  return (
    <div className="card-hover rounded-xl border p-5 shadow-sm bg-white dark:bg-slate-800/50 dark:border-slate-700">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        AI Task Suggestions
      </h3>
      <ul className="space-y-1">
        {tasks.map((t, i) => (
          <li key={i} className="text-slate-900 dark:text-white">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}