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
    const { subscription } = body;

    // Note: This would require a push_subscriptions table
    // For now, just return success
    // In production, you'd save the subscription to the database:
    // await supabase.from("push_subscriptions").upsert({
    //   user_id: user.id,
    //   subscription: JSON.stringify(subscription),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error subscribing to push:", error);
    return NextResponse.json(
      { error: "Error al suscribirse" },
      { status: 500 }
    );
  }
}

