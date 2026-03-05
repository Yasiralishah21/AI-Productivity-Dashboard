import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <div className="p-4 sm:p-6">{children}</div>
    </>
  );
}
