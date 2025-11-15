import { createClient } from "@/lib/supabase/server";
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
    const { track_glucose, track_bp, track_medications, track_weight } = body;

    // Update preferences
    const { error: prefError } = await (supabase as any)
      .from("user_preferences")
      .update({
        track_glucose: track_glucose ?? false,
        track_bp: track_bp ?? false,
        track_medications: track_medications ?? false,
        track_weight: track_weight ?? false,
      })
      .eq("user_id", user.id);

    if (prefError) {
      throw prefError;
    }

    // Mark onboarding as completed
    const { error: userError } = await (supabase as any)
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (userError) {
      throw userError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Error al actualizar preferencias" },
      { status: 500 }
    );
  }
}

