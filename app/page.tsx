// import DashboardLayout from "@/components/layout/DashboardLayout";
// import WeatherWidget from "@/components/widgets/WeatherWidget";
// import NewsWidget from "@/components/widgets/NewsWidget";
// import QuoteWidget from "@/components/widgets/QuoteWidget";
// import AITaskSuggestions from "@/components/widgets/AITaskSuggestions";
// import DashboardMetricsCapture from "@/components/DashboardMetricsCapture";
// import { getWeather } from "@/lib/weather";
// import { getNews } from "@/lib/news";
// import { getQuote } from "@/lib/quotes";
// import { getAITasks } from "@/lib/aiTasks";

// export default async function DashboardPage() {
//   const [weather, news, quote, aiTasks] = await Promise.all([
//     getWeather(),
//     getNews(5),
//     getQuote(),
//     getAITasks(),
//   ]);

//   return (
//     <DashboardLayout title="Dashboard" subtitle="Your productivity overview">
//       <DashboardMetricsCapture aiTasksCount={aiTasks.length} />
//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2 space-y-6">
//           <section>
//             <AITaskSuggestions initialData={aiTasks.length ? aiTasks : null} />
//           </section>
//           <section className="grid gap-6 sm:grid-cols-2">
//             <WeatherWidget data={weather} />
//             <QuoteWidget quote={quote} />
//           </section>
//         </div>
//         <div>
//           <NewsWidget articles={news} />
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }




import Home from "../components/Home";

export default function Page() {
  return <Home />;
}