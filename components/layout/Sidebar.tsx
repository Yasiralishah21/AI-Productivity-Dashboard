"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useTasks } from "@/context/TasksContext";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    href: "/stats",
    label: "Stats",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const { phase, tasks, toggleTask } = useTasks();

  useEffect(() => setOpen(false), [pathname, setOpen]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo / brand */}
        <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              AI
            </span>
            <span>Productivity</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
                {item.label}
              </Link>
            );
          })}

          {/* Task list with checkboxes (only in dashboard phase) — synced with TaskWidget */}
          {phase === "dashboard" && tasks.length > 0 && (
            <>
              <div className="my-3 border-t border-slate-200 dark:border-slate-700" />
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                My tasks
              </p>
              <ul className="space-y-1">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 rounded-lg px-3 py-2">
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
                      className={`min-w-0 truncate text-sm ${
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
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
