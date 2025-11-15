"use client";

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  // Check if push notifications are supported
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push notifications not supported");
    return null;
  }

  // Check if VAPID key is configured
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    console.log("VAPID public key not configured, skipping push notifications");
    return null;
  }

  try {
    // Register service worker
    let registration;
    try {
      registration = await navigator.serviceWorker.register("/sw.js");
    } catch (swError) {
      console.log("Service Worker registration failed:", swError);
      return null;
    }

    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Check if push manager is available
    if (!registration.pushManager) {
      console.log("PushManager not available");
      return null;
    }

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      ) as BufferSource,
    });

    // Save subscription to server (don't fail if this fails)
    try {
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
    } catch (fetchError) {
      console.log("Failed to save subscription to server:", fetchError);
      // Don't return null, subscription was successful
    }

    return subscription;
  } catch (error) {
    // Silently fail - push notifications are optional
    console.log("Push notification subscription failed (optional feature):", error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

