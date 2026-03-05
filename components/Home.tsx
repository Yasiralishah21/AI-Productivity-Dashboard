"use client";

import { useState } from "react";
import { useTasks } from "@/context/TasksContext";
import type { Task } from "@/types/dashboard";
import Dashboard from "./Dashboard";

// ----- Cities available in the dropdown; user can also type a city manually -----
const CITY_OPTIONS = [
  "London",
  "New York",
  "Tokyo",
  "Paris",
  "Sydney",
  "Berlin",
  "Toronto",
  "Karachi",
  "Mumbai",
  "Dubai",
  "Singapore",
  "Los Angeles",
  "Chicago",
  "Miami",
  "San Francisco",
];

/**
 * Home: Main client component. Flow:
 * 1. Prompt — "Do you want AI task suggestions?" (Yes / No)
 * 2. City (only if Yes) — User selects or types a city and submits; then we allow tasks/dashboard
 * 3. Task input — Add daily tasks (only after city is submitted)
 * 4. Dashboard — Shows widgets; receives selectedCity from context for WeatherWidget & NewsWidget
 */
export default function Home() {
  const { phase, setPhase, tasks, setTasks, setSelectedCity } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  // City step: dropdown selection or manual type, then submit
  const [cityInput, setCityInput] = useState("");
  const [citySubmitError, setCitySubmitError] = useState<string | null>(null);

  // ----- Step A: Initial prompt — "Do you want AI task suggestions?" -----
  if (phase === "prompt") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12">
        <h1 className="text-center text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
          Do you want AI task suggestions?
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPhase("city")}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setPhase("dashboard")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  // ----- Step B: City input — select from list or type city; submit to proceed -----
  if (phase === "city") {
    const handleCitySubmit = async () => {
      const city = cityInput.trim();
      if (!city) {
        setCitySubmitError("Please enter or select a city.");
        return;
      }
      setCitySubmitError(null);
      // Optional: validate by fetching weather; on success store city and move to task input
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setCitySubmitError(err?.error ?? "Could not find weather for this city. Try another.");
          return;
        }
        setSelectedCity(city);
        setPhase("input");
      } catch {
        setCitySubmitError("Failed to verify city. Try again.");
      }
    };

    return (
      <div className="flex min-h-[60vh] flex-col items-center gap-8 px-4 py-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Choose your city
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          We’ll use it for weather and local news. Select from the list or type a city name.
        </p>

        {/* City section: visually separated card */}
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-600 dark:bg-slate-800/50">
          <label htmlFor="city-input" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            City
          </label>
          <div className="flex gap-2">
            <input
              id="city-input"
              list="city-list"
              type="text"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setCitySubmitError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCitySubmit()}
              placeholder="Select or type a city"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
            <datalist id="city-list">
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={handleCitySubmit}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
          {citySubmitError && (
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
              {citySubmitError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ----- Step C: Task input form (only after user chose Yes and submitted city) -----
  if (phase === "input") {
    const addTask = () => {
      const title = newTaskTitle.trim();
      if (!title) return;
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        done: false,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
    };

    return (
      <div className="flex min-h-[60vh] flex-col items-center gap-6 px-4 py-12">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Enter your daily tasks
        </h2>
        <div className="flex w-full max-w-md gap-2">
          <input
            type="text"
            value={newTaskTitle}
            placeholder="Enter a task"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={addTask}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <ul className="w-full max-w-md space-y-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <span className="text-slate-900 dark:text-white">{t.title}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setPhase("dashboard")}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          {tasks.length > 0 ? "Done" : "Go to dashboard"}
        </button>
      </div>
    );
  }

  // ----- Step D: Dashboard (after No, or after city + optional tasks and Done) -----
  return <Dashboard />;
}
