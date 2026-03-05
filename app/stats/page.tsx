"use client";

import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TasksChart = dynamic(() => import("@/components/stats/TasksChart"), {
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    </div>
  ),
  ssr: false,
});

export default function StatsPage() {
  return (
    <DashboardLayout title="Statistics" subtitle="Task analytics and productivity overview">
      <div className="space-y-6">
        <TasksChart />
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Productivity summary
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Use the charts above to track completed vs pending tasks and priority distribution. Complete more high-priority tasks to improve your productivity score.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
