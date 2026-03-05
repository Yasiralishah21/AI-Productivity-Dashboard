"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { DashboardPhase, Task } from "@/types/dashboard";

interface TasksContextValue {
  phase: DashboardPhase;
  setPhase: (phase: DashboardPhase) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  toggleTask: (id: string) => void;
  /** City selected by user; passed to WeatherWidget and NewsWidget. */
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<DashboardPhase>("prompt");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []);

  const value: TasksContextValue = {
    phase,
    setPhase,
    tasks,
    setTasks,
    toggleTask,
    selectedCity,
    setSelectedCity,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
