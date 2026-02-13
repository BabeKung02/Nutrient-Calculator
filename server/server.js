// ═══════════════════════════════════════════════════════════
// FILE: server/server.js
// npm install express web-push cors node-cron dotenv
// ═══════════════════════════════════════════════════════════

require("dotenv").config(); // ✅ ต้องอยู่บนสุดเสมอ

const express = require("express");
const webpush = require("web-push");
const cors    = require("cors");
const cron    = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

// ── VAPID ────────────────────────────────────────────────────
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE;

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error("❌ ไม่พบ VAPID Keys ใน .env กรุณาตรวจสอบไฟล์ .env");
  process.exit(1);
}

webpush.setVapidDetails(
  "mailto:your@email.com", // เปลี่ยนเป็น email จริง
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

// ── Subscriptions Store ───────────────────────────────────────
const subscriptions = {};

// ── API: Subscribe ────────────────────────────────────────────
app.post("/api/subscribe", (req, res) => {
  const { userId, subscription, schedules } = req.body;
  if (!userId || !subscription)
    return res.status(400).json({ error: "userId and subscription required" });

  subscriptions[userId] = {
    subscription,
    schedules:  schedules || [],
    updatedAt:  new Date().toISOString(),
  };

  console.log(`✅ Subscribed: ${userId} (${schedules?.length || 0} schedules)`);
  res.json({ success: true });
});

// ── API: Unsubscribe ──────────────────────────────────────────
app.delete("/api/subscribe/:userId", (req, res) => {
  delete subscriptions[req.params.userId];
  res.json({ success: true });
});

// ── API: Test Notification ────────────────────────────────────
app.post("/api/notify/test", async (req, res) => {
  const { userId } = req.body;
  const data = subscriptions[userId];
  if (!data) return res.status(404).json({ error: "User not found" });

  try {
    await webpush.sendNotification(
      data.subscription,
      JSON.stringify({
        title: "🔔 ทดสอบการแจ้งเตือน",
        body:  "ระบบแจ้งเตือนยาทำงานปกติ!",
        tag:   "test",
      })
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Cron: แจ้งเตือนทุก 1 นาที ────────────────────────────────
const MEAL_TIMES = {
  เช้า:     { hour: 8,  minute: 0 },
  เที่ยง:   { hour: 12, minute: 0 },
  เย็น:     { hour: 18, minute: 0 },
  ก่อนนอน: { hour: 21, minute: 0 },
};

const TIMING_OFFSET = {
  ก่อนอาหาร: -15,
  หลังอาหาร:   5,
  ก่อนนอน:     0,
};

cron.schedule("* * * * *", async () => {
  const now  = new Date();
  const nowH = now.getHours();
  const nowM = now.getMinutes();

  for (const [userId, data] of Object.entries(subscriptions)) {
    if (!data.schedules?.length) continue;

    for (const schedule of data.schedules) {
      const base = MEAL_TIMES[schedule.meal];
      if (!base) continue;

      let targetH = base.hour;
      let targetM = base.minute + (TIMING_OFFSET[schedule.timing] ?? 0);

      if (targetM < 0)   { targetH -= 1; targetM += 60; }
      if (targetM >= 60) { targetH += 1; targetM -= 60; }

      if (nowH !== targetH || nowM !== targetM) continue;

      try {
        await webpush.sendNotification(
          data.subscription,
          JSON.stringify({
            title: `ถึงเวลา${schedule.timing}แล้ว! 💊`,
            body:  `${schedule.name} • ${schedule.freq} (มื้อ${schedule.meal})`,
            tag:   `${userId}-${schedule.meal}-${schedule.timing}`,
            url:   "/medication",
          })
        );
        console.log(`📬 Sent → ${userId}: ${schedule.name} (${schedule.meal})`);
      } catch (err) {
        if (err.statusCode === 410) {
          console.log(`🗑️ Expired subscription removed: ${userId}`);
          delete subscriptions[userId];
          break;
        }
        console.error(`Push error [${userId}]:`, err.message);
      }
    }
  }
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Push Server running → http://localhost:${PORT}`);
  console.log(`🔑 VAPID Public: ${VAPID_PUBLIC.slice(0, 20)}...`);
});