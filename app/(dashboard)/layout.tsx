import TopBrand from "@/components/navigation/TopBrand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-2">
          <TopBrand />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-4">
        {children}
      </main>
    </div>
  );
}


