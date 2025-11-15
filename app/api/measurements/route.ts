import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkGlucoseThresholds } from "@/lib/alerts/checkThresholds";
import { Measurement } from "@/types";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    let query = supabase
      .from("measurements")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(100);

    if (startDate) {
      query = query.gte("date", startDate);
    }
    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return NextResponse.json(
      { error: "Error al obtener mediciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { type, value, value2, date, comment, label } = body;

    // Validate glucose value
    if (type === "glucose" && (value < 20 || value > 600)) {
      return NextResponse.json(
        { error: "El valor de glucosa debe estar entre 20 y 600 mg/dL" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("measurements")
      .insert({
        user_id: user.id,
        type,
        value: Number(value),
        value2: value2 ? Number(value2) : null,
        date: date || new Date().toISOString(),
        comment: comment || null,
        label: label || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Check for alerts if glucose measurement
    if (type === "glucose" && data) {
      // Check thresholds and send alerts directly
      try {
        await checkGlucoseThresholds(
          data.id,
          Number(value),
          user.id
        );
      } catch (err) {
        console.error("Error checking alerts:", err);
        // Don't fail the measurement creation if alert check fails
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating measurement:", error);
    return NextResponse.json(
      { error: "Error al crear medición" },
      { status: 500 }
    );
  }
}

