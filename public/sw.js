// ── Service Worker: sw.js ──────────────────────────────────────
// วางไฟล์นี้ไว้ที่ /public/sw.js

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

// รับ Push Event จาก Server (หรือ Scheduled Notification)
self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "แจ้งเตือนยา 💊", {
      body: data.body || "ถึงเวลารับประทานยาแล้ว",
      icon: data.icon || "/icon-192.png",
      badge: data.badge || "/icon-192.png",
      tag: data.tag || "medicine-reminder",
      renotify: true,
      requireInteraction: false,
      data: { url: data.url || "/" },
    })
  );
});

// คลิก Notification → เปิดแอป
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow(e.notification.data?.url || "/");
    })
  );
});

// ── Scheduled Local Notification (ไม่ต้องใช้ Server) ──────────
// รับ message จาก React เพื่อ schedule notification
self.addEventListener("message", (e) => {
  if (e.data?.type === "SCHEDULE_NOTIFICATION") {
    const { delayMs, title, body, tag } = e.data.payload;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: tag || "medicine-reminder",
        renotify: true,
      });
    }, delayMs);
  }
});