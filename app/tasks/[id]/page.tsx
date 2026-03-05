"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Task } from "@/types";

const priorityStyles = {
  high: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tasks/${id}`)
      .then((res) => {
        if (res.status === 404) return null;
        return res.json();
      })
      .then((data) => {
        setTask(data);
        if (data) {
          setTitle(data.title);
          setDescription(data.description ?? "");
        }
      })
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!task || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task || saving || !confirm("Delete this task?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (res.ok) router.push("/tasks");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Task" subtitle="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout title="Task" subtitle="Not found">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-slate-500 dark:text-slate-400">Task not found.</p>
          <Link href="/tasks" className="mt-4 inline-block text-indigo-600 hover:underline dark:text-indigo-400">
            Back to Tasks
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={task.title} subtitle={task.completed ? "Completed" : "In progress"}>
      <div className="max-w-2xl">
        <Link href="/tasks" className="mb-4 inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          ← Back to Tasks
        </Link>
        <div className="card-hover rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {editing ? (
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Title"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Description (optional)"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className={`text-xl font-semibold ${task.completed ? "text-slate-500 line-through dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>
                    {task.title}
                  </h1>
                  {task.description && (
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{task.description}</p>
                  )}
                </div>
                <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${priorityStyles[task.priority] ?? priorityStyles.medium}`}>
                  {task.priority}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleToggleComplete}
                  disabled={saving}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  {task.completed ? "Mark incomplete" : "Mark complete"}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/30"
                >
                  Delete
                </button>
              </div>
            </>
          )}
          {(task.dueDate || task.createdAt) && (
            <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {task.dueDate && <span>Due: {task.dueDate}</span>}
              {task.dueDate && task.createdAt && " · "}
              {task.createdAt && <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
