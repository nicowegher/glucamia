"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Measurement } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MeasurementCard from "@/components/dashboard/MeasurementCard";
import GlucoseChart from "@/components/dashboard/GlucoseChart";
import ShareWhatsAppButton from "@/components/dashboard/ShareWhatsAppButton";
import { getDateRange } from "@/lib/utils/date";
import { UserPreferences } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings, LogOut } from "lucide-react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import TopBrand from "@/components/navigation/TopBrand";

type FilterType = "today" | "week" | "month" | "all";
type TabType = "records" | "reports";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState<TabType>("records");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push("/login");
      } else {
        // Fetch preferences
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setPreferences(data);
      }
    };
    getUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user, filter, activeTab]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      let url = "/api/measurements";
      
      // Only apply filter in reports tab
      // In records tab, always fetch all measurements
      if (activeTab === "reports" && filter !== "all") {
        const range = getDateRange(filter);
        url += `?start=${range.start.toISOString()}&end=${range.end.toISOString()}`;
      }
      // If records tab, fetch all (no filter)

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al cargar mediciones");
      
      const data = await response.json();
      setMeasurements(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // Get recent measurements for records tab (last 10)
  const recentMeasurements = activeTab === "records" 
    ? measurements.slice(0, 10)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 pt-1 md:pt-4 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <TopBrand />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                aria-label="Menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Hola, {(() => {
              const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
              const firstName = fullName.split(" ")[0] || "Usuario";
              return firstName;
            })()}
          </h1>
          <p className="text-lg text-muted-foreground mt-1">Tu seguimiento de salud</p>
        </div>

        {/* Desktop Tabs Navigation (md and up) */}
        <div className="hidden md:flex items-center gap-3 mb-8" role="tablist" aria-label="Secciones">
          <button
            role="tab"
            aria-selected={activeTab === "records"}
            aria-controls="tab-panel-records"
            className={`px-5 py-3 rounded-lg text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
              activeTab === "records"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground hover:bg-muted border border-border"
            }`}
            onClick={() => setActiveTab("records")}
          >
            Registros
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "reports"}
            aria-controls="tab-panel-reports"
            className={`px-5 py-3 rounded-lg text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${
              activeTab === "reports"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground hover:bg-muted border border-border"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            Reportes
          </button>
        </div>

        {/* Records Tab */}
        {activeTab === "records" && (
          <div id="tab-panel-records" role="tabpanel" aria-labelledby="Registros">
            {/* Main Action Button */}
            <Button
              onClick={() => router.push("/record")}
              className="w-full mb-6 md:mb-8"
            >
              + Registrar
            </Button>

            {/* Recent Measurements List */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                Registros recientes
              </h2>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Cargando...</p>
              ) : recentMeasurements.length === 0 ? (
                <Card>
                  <p className="text-center py-8 text-muted-foreground text-xl">
                    No hay registros aún. ¡Comienza registrando tu primera medición!
                  </p>
                </Card>
              ) : (
                <div>
                  {recentMeasurements.map((measurement) => (
                    <MeasurementCard
                      key={measurement.id}
                      measurement={measurement}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div id="tab-panel-reports" role="tabpanel" aria-labelledby="Reportes">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {(["today", "week", "month", "all"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    {f === "today"
                      ? "Hoy"
                      : f === "week"
                      ? "Esta semana"
                      : f === "month"
                      ? "Este mes"
                      : "Todos"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            {measurements.filter((m) => m.type === "glucose").length > 0 && (
              <Card className="mb-8">
                <h2 className="text-2xl font-bold text-card-foreground mb-4">
                  Gráfico de Glucemia
                </h2>
                <GlucoseChart measurements={measurements} />
              </Card>
            )}

            {/* Share Button */}
            {preferences && measurements.length > 0 && (
              <div className="flex justify-center">
                <ShareWhatsAppButton
                  measurements={measurements}
                  user={user}
                  preferences={preferences}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
