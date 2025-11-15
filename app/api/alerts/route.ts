import { createClient } from "@/lib/supabase/server";
import { checkGlucoseThresholds } from "@/lib/alerts/checkThresholds";
import { NextResponse } from "next/server";

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
    const { measurement_id, value } = body;

    if (!measurement_id || value === undefined) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const alert = await checkGlucoseThresholds(
      measurement_id,
      Number(value),
      user.id
    );

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Error checking alerts:", error);
    return NextResponse.json(
      { error: "Error al verificar alertas" },
      { status: 500 }
    );
  }
}

