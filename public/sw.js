// // ── Service Worker: sw.js ──────────────────────────────────────
// // วางไฟล์นี้ไว้ที่ /public/sw.js

// self.addEventListener("install", (e) => {
//   self.skipWaiting();
// });

// self.addEventListener("activate", (e) => {
//   e.waitUntil(clients.claim());
// });

// // รับ Push Event จาก Server (หรือ Scheduled Notification)
// self.addEventListener("push", (e) => {
//   const data = e.data?.json() || {};
//   e.waitUntil(
//     self.registration.showNotification(data.title || "แจ้งเตือนยา 💊", {
//       body: data.body || "ถึงเวลารับประทานยาแล้ว",
//       icon: data.icon || "/icon-192.png",
//       badge: data.badge || "/icon-192.png",
//       tag: data.tag || "medicine-reminder",
//       renotify: true,
//       requireInteraction: false,
//       data: { url: data.url || "/" },
//     })
//   );
// });

// // คลิก Notification → เปิดแอป
// self.addEventListener("notificationclick", (e) => {
//   e.notification.close();
//   e.waitUntil(
//     clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
//       if (list.length > 0) return list[0].focus();
//       return clients.openWindow(e.notification.data?.url || "/");
//     })
//   );
// });

// // ── Scheduled Local Notification (ไม่ต้องใช้ Server) ──────────
// // รับ message จาก React เพื่อ schedule notification
// self.addEventListener("message", (e) => {
//   if (e.data?.type === "SCHEDULE_NOTIFICATION") {
//     const { delayMs, title, body, tag } = e.data.payload;
//     setTimeout(() => {
//       self.registration.showNotification(title, {
//         body,
//         icon: "/icon-192.png",
//         badge: "/icon-192.png",
//         tag: tag || "medicine-reminder",
//         renotify: true,
//       });
//     }, delayMs);
//   }
// });

// ═══════════════════════════════════════════════════════════
// FILE: public/sw.js
// Service Worker สำหรับรับ Push Notifications
// ทำงานแม้แอปปิด
// ═══════════════════════════════════════════════════════════

console.log('🔧 Service Worker loaded');

// ⭐ สำคัญ: เพิ่ม waitUntil เพื่อให้ SW ไม่ terminate
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  event.waitUntil(
    clients.claim().then(() => {
      console.log('✅ Service Worker activated and ready');
    })
  );
});

// ⭐ Listen for push events - ทำงานแม้แอปปิด
self.addEventListener('push', (event) => {
  console.log('📬 Push received at:', new Date().toLocaleTimeString());
  
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
      console.log('📦 Push data:', data);
    } catch (e) {
      console.error('❌ Failed to parse push data:', e);
      data = {
        title: 'การแจ้งเตือน',
        body: event.data.text() || 'คุณมีการแจ้งเตือนใหม่',
      };
    }
  }
  
  const options = {
    body: data.body || 'คุณมีการแจ้งเตือนใหม่',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    tag: data.tag || 'medication-notification',
    requireInteraction: true, // ⭐ แสดงจนกว่าจะกด
    vibrate: data.vibrate || [200, 100, 200, 100, 200],
    renotify: true, // ⭐ แจ้งซ้ำถ้า tag เดิม
    data: data.data || {},
    actions: data.actions || [
      { action: 'view', title: 'ดูรายการ', icon: '/icon-view.png' },
      { action: 'close', title: 'ปิด', icon: '/icon-close.png' },
    ],
  };
  
  // ⭐ สำคัญ: ใช้ waitUntil เพื่อให้ notification แสดงแน่นอน
  event.waitUntil(
    self.registration.showNotification(
      data.title || '💊 การแจ้งเตือนยา',
      options
    ).then(() => {
      console.log('✅ Notification shown successfully');
    }).catch((error) => {
      console.error('❌ Failed to show notification:', error);
    })
  );
});

// ⭐ Listen for notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  // จัดการ actions
  if (event.action === 'close') {
    return;
  }
  
  const url = event.notification.data?.url || '/medication';
  
  // ⭐ สำคัญ: ใช้ waitUntil
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // ถ้ามี tab เปิดอยู่แล้ว ให้ focus
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // ถ้าไม่มี ให้เปิด tab ใหม่
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }).catch((error) => {
      console.error('❌ Failed to handle click:', error);
    })
  );
});

// ⭐ Keep SW alive - รับ messages จาก client
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'KEEP_ALIVE') {
    event.waitUntil(Promise.resolve());
  }
});

// ⭐ Background Sync - ถ้า browser รองรับ
self.addEventListener('sync', (event) => {
  console.log('🔄 Sync event:', event.tag);
  
  if (event.tag === 'sync-medications') {
    event.waitUntil(
      // สามารถเพิ่ม logic sync ข้อมูลได้ที่นี่
      Promise.resolve()
    );
  }
});

console.log('✅ Service Worker fully loaded and ready');