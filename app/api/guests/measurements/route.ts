import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Guest, Measurement } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Find guest by token
    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .select("user_id, status")
      .eq("token", token)
      .single()
      .returns<Pick<Guest, "user_id" | "status">>();

    if (guestError || !guest || guest.status !== "active") {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    // Get measurements
    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", guest.user_id)
      .order("date", { ascending: false })
      .limit(100)
      .returns<Measurement[]>();

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching guest measurements:", error);
    return NextResponse.json(
      { error: "Error al obtener mediciones" },
      { status: 500 }
    );
  }
}

