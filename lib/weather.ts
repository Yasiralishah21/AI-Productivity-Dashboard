import type { WeatherData } from "@/types";
import { mockWeather } from "./mockData";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const DEFAULT_CITY = process.env.NEXT_PUBLIC_DEFAULT_CITY || "London";

export async function getWeather(city?: string): Promise<WeatherData> {
  const q = city || DEFAULT_CITY;
  if (!API_KEY) return mockWeather;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${API_KEY}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return mockWeather;
    const data = await res.json();
    return {
      city: data.name,
      temp: Math.round(data.main?.temp ?? 0),
      condition: data.weather?.[0]?.description ?? "Unknown",
      icon: data.weather?.[0]?.icon ?? "01d",
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed,
    };
  } catch {
    return mockWeather;
  }
}
