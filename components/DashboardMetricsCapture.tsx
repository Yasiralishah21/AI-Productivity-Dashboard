"use client";

import { useEffect, useRef } from "react";
import { captureDashboardLoad } from "@/lib/metrics";

interface Props {
  aiTasksCount: number;
}

export default function DashboardMetricsCapture({ aiTasksCount }: Props) {
  const captured = useRef(false);

  useEffect(() => {
    if (captured.current || typeof window === "undefined") return;
    captured.current = true;

    const nav = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    const loadTimeMs =
      nav && nav.loadEventEnd > 0
        ? Math.round(nav.loadEventEnd - nav.fetchStart)
        : undefined;

    captureDashboardLoad({
      loadTimeMs,
      aiTasksCount,
      widgetsLoaded: ["weather", "news", "quote", "ai-tasks"],
    });
  }, [aiTasksCount]);

  return null;
}
