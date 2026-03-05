# AI Productivity Dashboard

A production-ready **Next.js 14+** application that combines a modern productivity dashboard with AI-powered task suggestions, weather, news, and analytics. Built with React, Next.js, and Tailwind CSS—fully responsive with dark/light mode and ready to deploy on Vercel.

## Screenshots

| Dashboard | Tasks | Stats |
|-----------|--------|--------|
| *Add a screenshot of `/` (dashboard with widgets)* | *Add a screenshot of `/tasks`* | *Add a screenshot of `/stats` with charts* |

*After deployment, replace the placeholders above with real screenshots (e.g. `docs/screenshot-dashboard.png`).*

## Live Demo

**[Deploy on Vercel](https://vercel.com/new)** and add your repo. Once deployed, add your live URL here, e.g.:

- **Live app:** `https://ai-productivity-dashboard.vercel.app` *(replace with your Vercel URL)*

## Features

- **Dashboard (Home)** – Overview with AI task suggestions, weather, quote of the day, and top headlines
- **Tasks** – Full CRUD task list with add, complete, edit, delete; dynamic route for task detail (`/tasks/[id]`)
- **Stats** – Charts (Chart.js / react-chartjs-2): completed vs pending tasks, tasks by priority
- **AI Task Suggestions** – OpenAI API or mock JSON for offline; 3–5 suggested tasks in a card layout
- **Weather Widget** – OpenWeatherMap API; city, temperature, condition, optional humidity/wind
- **News Feed** – Top 5 headlines from NewsAPI (or mock) with title, source, link
- **Quote of the Day** – Random motivational quote from Quotable API
- **Dark/Light Mode** – Toggle with persisted preference (no flash on load)
- **Responsive** – Desktop and mobile with collapsible sidebar; modular, reusable components

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Charts:** Chart.js, react-chartjs-2
- **APIs:** OpenAI (optional), OpenWeatherMap, NewsAPI, Quotable

## APIs Used

| Service        | Purpose              | Env variable              | Fallback   |
|----------------|----------------------|---------------------------|------------|
| OpenAI         | AI task suggestions  | `OPENAI_API_KEY`          | Mock JSON  |
| OpenWeatherMap | Current weather      | `OPENWEATHERMAP_API_KEY`  | Mock data  |
| NewsAPI        | Top headlines        | `NEWS_API_KEY`            | Mock data  |
| Quotable       | Quote of the day     | (no key)                  | Mock quote |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Environment

Copy the example env and add your keys (optional for local mock data):

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- `OPENAI_API_KEY` – [OpenAI](https://platform.openai.com/) (optional; uses mock if missing)
- `OPENWEATHERMAP_API_KEY` – [OpenWeatherMap](https://openweathermap.org/api)
- `NEWS_API_KEY` – [NewsAPI](https://newsapi.org/)
- `NEXT_PUBLIC_DEFAULT_CITY` – e.g. `London` (optional)

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx             # Root layout (sidebar, theme script)
  page.tsx               # Dashboard (SSR data for widgets)
  tasks/
    page.tsx             # Task list (client)
    [id]/
      layout.tsx         # generateMetadata for task title/SEO
      page.tsx           # Task detail (dynamic route)
  stats/page.tsx         # Statistics + charts (lazy-loaded)
  api/
    tasks/route.ts       # GET, POST tasks
    tasks/[id]/          # GET, PATCH, DELETE single task
    ai-tasks/route.ts    # AI suggestions (OpenAI or mock)
    stats/route.ts       # Task stats (for metrics)
components/
  layout/                # Sidebar, Header, DashboardLayout
  widgets/               # Weather, News, Quote, AITaskSuggestions
  stats/                 # TasksChart (Chart.js)
  DashboardMetricsCapture.tsx  # Client-side load metrics
context/                 # ThemeContext, SidebarContext
lib/                     # weather, news, quotes, aiTasks, mockData, tasksStore, metrics
types/                   # Shared TypeScript types
```

## Next.js Features Demonstrated

- **App Router** – `app/` with layouts and route groups
- **API Routes** – `app/api/tasks`, `app/api/ai-tasks`, `app/api/tasks/[id]`, `app/api/stats`
- **SSR/ISR** – Dashboard fetches weather, news, quote, and AI tasks on the server; revalidate: 600s (weather), 3600s (news), 86400s (quote), 300s (AI tasks)
- **Dynamic routes** – `/tasks/[id]` with `generateMetadata` for SEO
- **Client components** – Tasks list/detail, Stats charts (lazy-loaded with `dynamic(..., { ssr: false })`), theme toggle, AI widget (with optional server initial data)
- **SEO** – Root metadata, per-task metadata, theme script to avoid flash

## Deployment (Vercel)

1. **Push** your repo to GitHub, GitLab, or Bitbucket.
2. **Import** the project at [vercel.com/new](https://vercel.com/new).
3. **Configure**:
   - Framework preset: Next.js (auto-detected)
   - Root directory: `./` (or your app folder if monorepo)
4. **Environment variables:** In Project → Settings → Environment Variables, add:
   - `OPENAI_API_KEY` (optional)
   - `OPENWEATHERMAP_API_KEY`
   - `NEWS_API_KEY`
   - `NEXT_PUBLIC_DEFAULT_CITY` (optional)
5. **Deploy** – Vercel builds and deploys. No extra config required.

After deployment, set your **Live Demo** URL in this README and add screenshots.

## Measurable Metrics (Resume-Ready)

The app supports measurable metrics you can use for resume bullets:

### How to capture

- **Load time:** Dashboard records load time in the browser via `lib/metrics.ts` and `DashboardMetricsCapture`. Stored in `localStorage` under `ai-dashboard-metrics`. Use Chrome DevTools → Performance or Lighthouse for official numbers.
- **AI tasks:** Each dashboard load records `aiTasksCount` (3–5). Use `getResumeMetrics()` from `lib/metrics` in dev tools or expose via a simple admin UI.
- **Task stats:** `GET /api/stats` returns `tasksTotal`, `tasksCompleted`, `tasksPending`, `completionRate` for server-side metrics.
- **SEO:** Run Lighthouse (e.g. “SEO” and “Performance” audits) on the deployed URL and note scores.

### Example metrics (replace with your own after measuring)

| Metric | Example value | How to measure |
|--------|----------------|----------------|
| **Load time improvement** | ~1.2s faster with SSR + ISR | Lighthouse “First Contentful Paint” before/after |
| **AI task suggestions** | 5 per dashboard load | `aiTasksCount` in stored metrics or API |
| **SEO score** | 90+ (Lighthouse) | Run Lighthouse on production URL |
| **Dashboard performance** | 85+ Performance score | Lighthouse Performance on `/` |
| **Tasks API** | CRUD + stats endpoint | `GET /api/tasks`, `GET /api/stats` |

Example resume bullets:

- *“Improved dashboard load time by ~1.2s using server-side data and ISR (revalidate 10min–24h).”*
- *“Built AI task suggestion feature serving 3–5 suggestions per load with optional OpenAI integration and mock fallback.”*
- *“Achieved Lighthouse SEO score 90+ with metadata and SSR for key routes.”*
- *“Dashboard performance score 85+ via lazy-loaded charts and optimized API caching.”*

## License

MIT
# AI-Productivity-Dashboard
