"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import type { Task } from "@/types";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const doughnutColors = ["#6366f1", "#22c55e", "#f59e0b"];

export default function TasksChart() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;

  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: [doughnutColors[1], doughnutColors[0]],
        borderWidth: 0,
      },
    ],
  };

  const priorityCounts = { high: 0, medium: 0, low: 0 };
  tasks.forEach((t) => {
    if (t.priority in priorityCounts) priorityCounts[t.priority as keyof typeof priorityCounts]++;
  });

  const barData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks by priority",
        data: [priorityCounts.high, priorityCounts.medium, priorityCounts.low],
        backgroundColor: ["#f43f5e", "#f59e0b", "#22c55e"],
        borderRadius: 6,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Tasks: Completed vs Pending
        </h3>
        <div className="chart-container">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Completed: <strong>{completed}</strong>
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            Pending: <strong>{pending}</strong>
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Tasks by Priority
        </h3>
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
