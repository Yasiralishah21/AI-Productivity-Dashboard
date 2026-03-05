"use client";

import { useTasks } from "@/context/TasksContext";
import TaskWidget from "@/components/widgets/TaskWidget";
import StatsWidget from "@/components/widgets/StatsWidget";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import NewsWidget from "@/components/widgets/NewsWidget";

/**
 * Dashboard: Main dashboard area. Reads tasks and selectedCity from TasksContext.
 * Passes selectedCity to WeatherWidget and NewsWidget so they fetch data for the user's city.
 */
export default function Dashboard() {
  const { tasks, setTasks, toggleTask, selectedCity } = useTasks();

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TaskWidget tasks={tasks} setTasks={setTasks} toggleTask={toggleTask} />
          <WeatherWidget city={selectedCity} />
        </div>
        <div className="space-y-6">
          <StatsWidget tasks={tasks} />
          <NewsWidget city={selectedCity} />
        </div>
      </div>
    </div>
  );
}
