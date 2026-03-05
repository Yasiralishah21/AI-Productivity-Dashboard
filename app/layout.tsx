import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { TasksProvider } from "@/context/TasksContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Productivity Dashboard",
    template: "%s | AI Productivity Dashboard",
  },
  description: "Modern productivity dashboard with AI task suggestions, weather, news, and analytics.",
  openGraph: {
    title: "AI Productivity Dashboard",
    description: "Modern productivity dashboard with AI task suggestions, weather, news, and analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var d=document.documentElement;var m=window.matchMedia('(prefers-color-scheme:dark)');if(t==='dark'||(t!='light'&&m.matches)){d.classList.add('dark');d.setAttribute('data-theme','dark');}else{d.classList.add('light');d.setAttribute('data-theme','light');}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <SidebarProvider>
            <TasksProvider>
              <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                <Sidebar />
                <main className="min-w-0 flex-1 lg:ml-64">
                  <Header title="AI Productivity Dashboard" subtitle="Your overview" />
                  {children}
                </main>
              </div>
            </TasksProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
