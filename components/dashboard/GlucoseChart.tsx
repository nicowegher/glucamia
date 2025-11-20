"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Measurement } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useEffect, useState } from "react";

interface GlucoseChartProps {
  measurements: Measurement[];
}

export default function GlucoseChart({ measurements }: GlucoseChartProps) {
  const [colors, setColors] = useState({
    primary: "#f59e0b",
    border: "#e5e7eb",
    card: "#ffffff",
  });

  useEffect(() => {
    const root = document.documentElement;
    const getCSSVar = (varName: string) => {
      return getComputedStyle(root).getPropertyValue(varName).trim() || "";
    };

    const updateColors = () => {
      setColors({
        primary: getCSSVar("--primary") || "#f59e0b",
        border: getCSSVar("--border") || "#e5e7eb",
        card: getCSSVar("--card") || "#ffffff",
      });
    };

    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const glucoseData = useMemo(() => {
    return measurements
      .filter((m) => m.type === "glucose")
      .map((m) => ({
        date: format(new Date(m.date), "dd/MMM", { locale: es }),
        value: Number(m.value),
        fullDate: m.date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [measurements]);

  if (glucoseData.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-xl">No hay datos de glucemia para mostrar</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={glucoseData}
          margin={{ top: 15, right: 40, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#ccc"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={45}
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            tick={{ fontSize: 10, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            width={40}
            tick={{ fontSize: 10, fill: "#6b7280" }}
          />
          <ReferenceLine
            y={70}
            stroke="#93c5fd"
            strokeWidth={1}
            strokeDasharray="4 2"
            label={{
              value: "70",
              position: "right",
              fill: "#60a5fa",
              fontSize: 10,
            }}
          />
          <ReferenceLine
            y={180}
            stroke="#fecaca"
            strokeWidth={1}
            strokeDasharray="4 2"
            label={{
              value: "180",
              position: "right",
              fill: "#f87171",
              fontSize: 10,
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-md">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {payload[0].payload.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">
                          {payload[0].value} mg/dL
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{ stroke: colors.border }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors.primary}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ 
              r: 4, 
              fill: colors.primary,
              strokeWidth: 2,
              stroke: colors.card
            }}
            fill="url(#glucoseGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

