"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/types/dashboard";
import type { SetTasksAction } from "@/types/dashboard";

interface TaskWidgetProps {
  tasks: Task[];
  setTasks: SetTasksAction;
  toggleTask: (id: string) => void;
}

/**
 * TaskWidget: Shows tasks in shuffled order (AI-suggestion style).
 * Checkbox toggles call toggleTask(id) so state stays in sync with Sidebar and StatsWidget.
 */
export default function TaskWidget({
  tasks,
  toggleTask,
}: TaskWidgetProps) {
  const [seed, setSeed] = useState(0);

  const shuffledOrder = useMemo(() => {
    const ids = tasks.map((t) => t.id);
    return [...ids].sort(() => Math.random() - 0.5);
  }, [tasks.length, seed]);

  const orderedTasks = useMemo(() => {
    const byId = new Map(tasks.map((t) => [t.id, t]));
    return shuffledOrder
      .map((id) => byId.get(id))
      .filter((t): t is Task => t != null);
  }, [tasks, shuffledOrder]);

  if (tasks.length === 0) {
    return (
      <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          AI Task Suggestions
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No tasks yet. Add tasks from the initial prompt to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="card-hover rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          AI Task Suggestions
        </h3>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Shuffle
        </button>
      </div>
      <ul className="space-y-2">
        {orderedTasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <button
              type="button"
              onClick={() => toggleTask(t.id)}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-slate-300 transition hover:border-indigo-500 dark:border-slate-600"
              aria-label={t.done ? "Mark incomplete" : "Mark complete"}
            >
              {t.done && (
                <svg
                  className="h-2.5 w-2.5 text-indigo-600 dark:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <span
              className={`text-sm ${
                t.done
                  ? "text-slate-500 line-through dark:text-slate-400"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {t.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
