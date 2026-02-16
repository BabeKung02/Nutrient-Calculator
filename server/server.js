// // ═══════════════════════════════════════════════════════════
// // FILE: server/server.js
// // npm install express web-push cors node-cron dotenv
// // ═══════════════════════════════════════════════════════════

// require("dotenv").config(); // ✅ ต้องอยู่บนสุดเสมอ

// const express = require("express");
// const webpush = require("web-push");
// const cors    = require("cors");
// const cron    = require("node-cron");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ── VAPID ────────────────────────────────────────────────────
// const VAPID_PUBLIC  = process.env.VAPID_PUBLIC;
// const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

// if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
//   console.error("❌ ไม่พบ VAPID Keys ใน .env กรุณาตรวจสอบไฟล์ .env");
//   process.exit(1);
// }

// webpush.setVapidDetails(
//   "mailto:your@email.com", // เปลี่ยนเป็น email จริง
//   VAPID_PUBLIC,
//   VAPID_PRIVATE
// );

// // ── Subscriptions Store ───────────────────────────────────────
// const subscriptions = {};

// // ── API: Subscribe ────────────────────────────────────────────
// app.post("/api/subscribe", (req, res) => {
//   const { userId, subscription, schedules } = req.body;
//   if (!userId || !subscription)
//     return res.status(400).json({ error: "userId and subscription required" });

//   subscriptions[userId] = {
//     subscription,
//     schedules:  schedules || [],
//     updatedAt:  new Date().toISOString(),
//   };

//   console.log(`✅ Subscribed: ${userId} (${schedules?.length || 0} schedules)`);
//   res.json({ success: true });
// });

// // ── API: Unsubscribe ──────────────────────────────────────────
// app.delete("/api/subscribe/:userId", (req, res) => {
//   delete subscriptions[req.params.userId];
//   res.json({ success: true });
// });

// // ── API: Test Notification ────────────────────────────────────
// app.post("/api/notify/test", async (req, res) => {
//   const { userId } = req.body;
//   const data = subscriptions[userId];
//   if (!data) return res.status(404).json({ error: "User not found" });

//   try {
//     await webpush.sendNotification(
//       data.subscription,
//       JSON.stringify({
//         title: "🔔 ทดสอบการแจ้งเตือน",
//         body:  "ระบบแจ้งเตือนยาทำงานปกติ!",
//         tag:   "test",
//       })
//     );
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Push error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ── Cron: แจ้งเตือนทุก 1 นาที ────────────────────────────────
// const MEAL_TIMES = {
//   เช้า:     { hour: 8,  minute: 0 },
//   เที่ยง:   { hour: 12, minute: 0 },
//   เย็น:     { hour: 18, minute: 0 },
//   ก่อนนอน: { hour: 21, minute: 0 },
// };

// const TIMING_OFFSET = {
//   ก่อนอาหาร: -15,
//   หลังอาหาร:   5,
//   ก่อนนอน:     0,
// };

// cron.schedule("* * * * *", async () => {
//   const now  = new Date();
//   const nowH = now.getHours();
//   const nowM = now.getMinutes();

//   for (const [userId, data] of Object.entries(subscriptions)) {
//     if (!data.schedules?.length) continue;

//     for (const schedule of data.schedules) {
//       const base = MEAL_TIMES[schedule.meal];
//       if (!base) continue;

//       let targetH = base.hour;
//       let targetM = base.minute + (TIMING_OFFSET[schedule.timing] ?? 0);

//       if (targetM < 0)   { targetH -= 1; targetM += 60; }
//       if (targetM >= 60) { targetH += 1; targetM -= 60; }

//       if (nowH !== targetH || nowM !== targetM) continue;

//       try {
//         await webpush.sendNotification(
//           data.subscription,
//           JSON.stringify({
//             title: `ถึงเวลา${schedule.timing}แล้ว! 💊`,
//             body:  `${schedule.name} • ${schedule.freq} (มื้อ${schedule.meal})`,
//             tag:   `${userId}-${schedule.meal}-${schedule.timing}`,
//             url:   "/medication",
//           })
//         );
//         console.log(`📬 Sent → ${userId}: ${schedule.name} (${schedule.meal})`);
//       } catch (err) {
//         if (err.statusCode === 410) {
//           console.log(`🗑️ Expired subscription removed: ${userId}`);
//           delete subscriptions[userId];
//           break;
//         }
//         console.error(`Push error [${userId}]:`, err.message);
//       }
//     }
//   }
// });

// // ── Start ─────────────────────────────────────────────────────
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Push Server running → http://localhost:${PORT}`);
//   console.log(`🔑 VAPID Public: ${VAPID_PUBLIC.slice(0, 20)}...`);
// });

// ═══════════════════════════════════════════════════════════
// FILE: server/index.js
// Simple Push Notification Server
// 
// Setup:
// 1. npm init -y
// 2. npm install express web-push cors node-cron dotenv
// 3. node generateVapidKeys.js (สร้าง keys)
// 4. สร้างไฟล์ .env และใส่ keys
// 5. node index.js
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// FILE: server/index.js
// Simple Push Notification Server
// 
// Setup:
// 1. npm init -y
// 2. npm install express web-push cors node-cron dotenv
// 3. node generateVapidKeys.js (สร้าง keys)
// 4. สร้างไฟล์ .env และใส่ keys
// 5. node index.js
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// FILE: server/index.js
// Simple Push Notification Server
// 
// Setup:
// 1. npm init -y
// 2. npm install express web-push cors node-cron dotenv
// 3. node generateVapidKeys.js (สร้าง keys)
// 4. สร้างไฟล์ .env และใส่ keys
// 5. node index.js
// ═══════════════════════════════════════════════════════════

require("dotenv").config();
const express = require("express");
const webpush = require("web-push");
const cors = require("cors");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ── Persistent Storage ────────────────────────────────────
const STORAGE_FILE = path.join(__dirname, "subscriptions.json");

// โหลด subscriptions จากไฟล์
function loadSubscriptions() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf8");
      const parsed = JSON.parse(data);
      console.log(`📂 Loaded ${Object.keys(parsed).length} subscriptions from file`);
      return new Map(Object.entries(parsed));
    }
  } catch (error) {
    console.error("❌ Error loading subscriptions:", error);
  }
  return new Map();
}

// บันทึก subscriptions ลงไฟล์
function saveSubscriptions() {
  try {
    const obj = Object.fromEntries(subscriptions);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(obj, null, 2), "utf8");
    console.log(`💾 Saved ${subscriptions.size} subscriptions to file`);
  } catch (error) {
    console.error("❌ Error saving subscriptions:", error);
  }
}

// ⭐ โหลด subscriptions จากไฟล์ตอน start
const subscriptions = loadSubscriptions();

// ── VAPID Setup ────────────────────────────────────────────
const VAPID_PUBLIC = process.env.VAPID_PUBLIC;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "your@email.com";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error("❌ Missing VAPID keys in .env file");
  console.log("Run: node generateVapidKeys.js to create keys");
  process.exit(1);
}

webpush.setVapidDetails(
  `mailto:${CONTACT_EMAIL}`,
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

console.log("✅ VAPID configured");

// ── Helper Functions ───────────────────────────────────────
const MEAL_TIMES = {
  เช้า: { hour: 8, minute: 0 },
  เที่ยง: { hour: 12, minute: 0 },
  เย็น: { hour: 18, minute: 0 },
  ก่อนนอน: { hour: 20, minute: 0 },
};

function shouldSendNotification(schedule) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  
  return (
    currentHour === schedule.targetHour &&
    currentMin === schedule.targetMin
  );
}

// ── API Routes ────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get VAPID public key
app.get("/api/vapid-public-key", (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC });
});

// Subscribe endpoint
app.post("/api/subscribe", (req, res) => {
  const { userId, subscription } = req.body;
  
  if (!userId || !subscription) {
    return res.status(400).json({ error: "userId and subscription required" });
  }

  // เก็บหรืออัพเดท subscription
  const existing = subscriptions.get(userId) || { schedules: [] };
  existing.subscription = subscription;
  existing.updatedAt = new Date().toISOString();
  
  subscriptions.set(userId, existing);
  
  // ⭐ บันทึกลงไฟล์ทันที
  saveSubscriptions();
  
  console.log(`✅ Subscribed: ${userId} (Total: ${subscriptions.size})`);
  res.json({ success: true });
});

// Schedule notification
app.post("/api/schedule", (req, res) => {
  const { userId, medication } = req.body;
  
  if (!userId || !medication) {
    return res.status(400).json({ error: "userId and medication required" });
  }

  const userData = subscriptions.get(userId);
  if (!userData) {
    return res.status(404).json({ error: "User not subscribed" });
  }

  // เพิ่ม schedule
  const scheduleId = `${userId}-${medication.meal}-${medication.name}-${Date.now()}`;
  const newSchedule = {
    id: scheduleId,
    ...medication,
    createdAt: new Date().toISOString(),
  };

  userData.schedules = userData.schedules || [];
  userData.schedules.push(newSchedule);
  subscriptions.set(userId, userData);

  // ⭐ บันทึกลงไฟล์ทันที
  saveSubscriptions();

  console.log(`✅ Scheduled: ${userId} - ${medication.name} at ${medication.targetHour}:${String(medication.targetMin).padStart(2, '0')}`);
  
  res.json({ success: true, scheduleId });
});

// Test notification
app.post("/api/notify/test", async (req, res) => {
  const { userId, medication } = req.body;
  
  const userData = subscriptions.get(userId);
  if (!userData || !userData.subscription) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    await webpush.sendNotification(
      userData.subscription,
      JSON.stringify({
        title: `[ทดสอบ] ${medication.timing}! 💊`,
        body: `${medication.name} • มื้อ${medication.meal}`,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        tag: "test",
        data: {
          url: "/medication",
        },
      })
    );
    
    console.log(`✅ Test notification sent to ${userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Push error:", error);
    
    // ถ้า subscription หมดอายุ ให้ลบออก
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe
app.delete("/api/subscribe/:userId", (req, res) => {
  const { userId } = req.params;
  subscriptions.delete(userId);
  
  // ⭐ บันทึกลงไฟล์ทันที
  saveSubscriptions();
  
  console.log(`🗑️ Unsubscribed: ${userId}`);
  res.json({ success: true });
});

// ── Cron Job: ตรวจสอบและส่ง notification ทุกนาที ─────────
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  console.log(`⏰ Checking notifications at ${timeStr} (${subscriptions.size} users)`);
  
  for (const [userId, userData] of subscriptions.entries()) {
    if (!userData.schedules || userData.schedules.length === 0) continue;
    
    for (const schedule of userData.schedules) {
      if (shouldSendNotification(schedule)) {
        try {
          await webpush.sendNotification(
            userData.subscription,
            JSON.stringify({
              title: schedule.meal === "ก่อนนอน" 
                ? `ถึงเวลารับประทานยาก่อนนอนแล้ว! 💊`
                : `ถึงเวลา${schedule.timing}แล้ว! 💊`,
              body: `${schedule.name} • ${schedule.freq} (มื้อ${schedule.meal})`,
              icon: "/icon-192.png",
              badge: "/badge-72.png",
              tag: schedule.id,
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200],
              data: {
                url: "/medication",
                scheduleId: schedule.id,
              },
            })
          );
          
          console.log(`📬 Sent: ${userId} - ${schedule.name} (${schedule.meal})`);
        } catch (error) {
          console.error(`❌ Push error [${userId}]:`, error.message);
          
          // ลบ subscription ที่หมดอายุ
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`🗑️ Removing expired subscription: ${userId}`);
            subscriptions.delete(userId);
            saveSubscriptions();
            break;
          }
        }
      }
    }
  }
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("╔════════════════════════════════════════╗");
  console.log(`║  🚀 Push Server Running                ║`);
  console.log(`║  📡 Port: ${PORT}                          ║`);
  console.log(`║  🔑 VAPID: ${VAPID_PUBLIC.slice(0, 20)}...║`);
  console.log("╚════════════════════════════════════════╝");
  console.log("");
  console.log("📋 Active subscriptions:", subscriptions.size);
});

// ⭐ Graceful shutdown - บันทึกก่อนปิด
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  saveSubscriptions();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  saveSubscriptions();
  process.exit(0);
});