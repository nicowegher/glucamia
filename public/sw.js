self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Glucamia - Alerta";
  const options = {
    body: data.body || "Nueva alerta de salud",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [200, 100, 200],
    tag: "glucamia-alert",
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/")
  );
});

