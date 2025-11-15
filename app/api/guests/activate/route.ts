import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Guest } from "@/types";
import { Database } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token requerido" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Find guest by token
    const { data: guest, error: findError } = await supabase
      .from("guests")
      .select("*")
      .eq("token", token)
      .single()
      .returns<Guest>();

    if (findError || !guest) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 404 }
      );
    }

    // Activate guest
    const { error: updateError } = await supabase
      .from("guests")
      .update({ status: "active" } as Database["public"]["Tables"]["guests"]["Update"])
      .eq("id", guest.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error activating guest:", error);
    return NextResponse.json(
      { error: "Error al activar invitación" },
      { status: 500 }
    );
  }
}

