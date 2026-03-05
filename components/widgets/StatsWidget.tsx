"use client";

import type { Task } from "@/types/dashboard";

interface StatsWidgetProps {
  tasks: Task[];
}

/**
 * StatsWidget: Shows completed vs total. Updates when tasks or done state change
 * (synced from Sidebar or TaskWidget checkboxes).
 */
export default function StatsWidget({ tasks }: StatsWidgetProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Task stats
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {completed}
        </span>
        <span className="text-slate-500 dark:text-slate-400">/</span>
        <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {total}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          completed
        </span>
      </div>
      {total > 0 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {Math.round((completed / total) * 100)}% done
        </p>
      )}
    </div>
  );
}
