import { createServiceRoleClient } from "@/lib/supabase/server";
import webpush from "web-push";

// Configure web-push (VAPID keys should be in env)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:noreply@glucamia.app",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string
) {
  const supabase = await createServiceRoleClient();

  // Get user's push subscription (would need to store this in DB)
  // For now, this is a placeholder - you'd need to add a push_subscriptions table
  // const { data: subscription } = await supabase
  //   .from("push_subscriptions")
  //   .select("subscription")
  //   .eq("user_id", userId)
  //   .single();

  // if (!subscription) return;

  // try {
  //   await webpush.sendNotification(
  //     JSON.parse(subscription.subscription),
  //     JSON.stringify({ title, body })
  //   );
  // } catch (error) {
  //   console.error("Error sending push notification:", error);
  // }

  // Note: Full implementation would require:
  // 1. Table to store push subscriptions
  // 2. API endpoint to save subscriptions
  // 3. VAPID keys configuration
  console.log("Push notification placeholder:", { userId, title, body });
}

