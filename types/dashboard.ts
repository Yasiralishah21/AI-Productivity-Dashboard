import type { Dispatch, SetStateAction } from "react";

/**
 * Shared task type for dashboard, sidebar, and task widget.
 * `id` is required for stable checkbox sync when list order changes (e.g. shuffle).
 */
export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export type SetTasksAction = Dispatch<SetStateAction<Task[]>>;

export type DashboardPhase = "prompt" | "city" | "input" | "dashboard";
