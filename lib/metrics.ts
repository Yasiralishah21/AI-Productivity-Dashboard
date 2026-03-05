/**
 * Lightweight metrics for resume-ready and performance tracking.
 * In production, replace console/object with your analytics (Vercel Analytics, etc.).
 */

export interface DashboardMetrics {
  loadTimeMs?: number;
  aiTasksCount: number;
  widgetsLoaded: string[];
  timestamp: string;
}

const METRICS_KEY = "ai-dashboard-metrics";

export function captureDashboardLoad(metrics: Omit<DashboardMetrics, "timestamp">) {
  const payload: DashboardMetrics = {
    ...metrics,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      const history = getStoredMetrics();
      history.push(payload);
      const trimmed = history.slice(-50);
      localStorage.setItem(METRICS_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
    if (process.env.NODE_ENV === "development") {
      console.info("[Dashboard metrics]", payload);
    }
  }
}

export function getStoredMetrics(): DashboardMetrics[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getResumeMetrics(): {
  totalLoads: number;
  avgLoadTimeMs: number | null;
  totalAITasksServed: number;
} {
  const history = typeof window !== "undefined" ? getStoredMetrics() : [];
  const totalLoads = history.length;
  const withTime = history.filter((m) => m.loadTimeMs != null);
  const avgLoadTimeMs =
    withTime.length > 0
      ? withTime.reduce((s, m) => s + (m.loadTimeMs ?? 0), 0) / withTime.length
      : null;
  const totalAITasksServed = history.reduce((s, m) => s + (m.aiTasksCount ?? 0), 0);
  return { totalLoads, avgLoadTimeMs, totalAITasksServed };
}
