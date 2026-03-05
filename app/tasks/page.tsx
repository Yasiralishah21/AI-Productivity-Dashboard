"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Task } from "@/types";

const priorityStyles = {
  high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (res.ok) {
        setNewTitle("");
        fetchTasks();
      }
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    if (res.ok) fetchTasks();
  };

  return (
    <DashboardLayout title="Tasks" subtitle="Manage your to-do list">
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-slate-500 dark:text-slate-400">No tasks yet. Add one above.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="card-hover flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/50"
              >
                <button
                  type="button"
                  onClick={() => toggleComplete(task)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-slate-300 transition-colors hover:border-indigo-500 dark:border-slate-600"
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed && (
                    <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <Link
                  href={`/tasks/${task.id}`}
                  className={`min-w-0 flex-1 ${task.completed ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-white"}`}
                >
                  {task.title}
                </Link>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority] ?? priorityStyles.medium}`}
                >
                  {task.priority}
                </span>
                <Link
                  href={`/tasks/${task.id}`}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
