"use client";

import { FileText, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: "records" | "reports";
  onTabChange: (tab: "records" | "reports") => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex">
        <button
          onClick={() => onTabChange("records")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 px-4 transition-colors",
            activeTab === "records"
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ClipboardList className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Registros</span>
        </button>
        <button
          onClick={() => onTabChange("reports")}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-3 px-4 transition-colors",
            activeTab === "reports"
              ? "text-primary bg-accent"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Reportes</span>
        </button>
      </div>
    </nav>
  );
}

