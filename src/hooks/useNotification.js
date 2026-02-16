// // ── hooks/useNotification.js ───────────────────────────────────
// // Custom Hook จัดการ Permission + Schedule Notification

// import { useState, useEffect, useCallback } from "react";

// export const MEAL_TIMES = {
//   เช้า: { hour: 8,  minute: 0  },
//   เที่ยง: { hour: 12, minute: 0  },
//   เย็น:  { hour: 18, minute: 0  },
//   ก่อนนอน: { hour: 20, minute: 0  },
// };

// // คำนวณ ms จนถึงเวลาถัดไปของวันนี้ (หรือพรุ่งนี้ถ้าผ่านแล้ว)
// function getMsUntil(hour, minute) {
//   const now = new Date();
//   const target = new Date();
//   target.setHours(hour, minute, 0, 0);
//   if (target <= now) target.setDate(target.getDate() + 1); // ข้ามวัน
//   return target.getTime() - now.getTime();
// }

// export function useNotification() {
//   const [permission, setPermission] = useState(
//     typeof Notification !== "undefined" ? Notification.permission : "default"
//   );
//   const [swReady, setSwReady] = useState(false);
//   const [scheduledIds, setScheduledIds] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("scheduledNotifs") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   // Register Service Worker
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/sw.js")
//         .then((reg) => {
//           console.log("SW registered:", reg.scope);
//           setSwReady(true);
//         })
//         .catch((err) => console.error("SW error:", err));
//     }
//   }, []);

//   // ขอ Permission
//   const requestPermission = useCallback(async () => {
//     if (!("Notification" in window)) {
//       alert("Browser นี้ไม่รองรับ Notification");
//       return false;
//     }
//     const result = await Notification.requestPermission();
//     setPermission(result);
//     return result === "granted";
//   }, []);

//   // Schedule notification ผ่าน Service Worker
//   const scheduleNotification = useCallback(
//     async (entry) => {
//       if (permission !== "granted") {
//         const ok = await requestPermission();
//         if (!ok) return null;
//       }

//       const mealTime = MEAL_TIMES[entry.meal];
//       if (!mealTime) return null;

//       // ⭐ กรณีพิเศษ: มื้อก่อนนอน ให้ fix เวลาที่ 20:00 เสมอ (ไม่ + - เวลา)
//       let targetHour, targetMin;
      
//       if (entry.meal === "ก่อนนอน") {
//         targetHour = 20;
//         targetMin = 0;
//       } else {
//         // มื้ออื่นๆ ให้คำนวณตามปกติ
//         const timingOffset = {
//           ก่อนอาหาร: -30, // 15 นาทีก่อน
//           หลังอาหาร: 30,  // 15 นาทีหลัง
//         };

//         const offsetMin = timingOffset[entry.timing] ?? 0;
        
//         // คำนวณเวลาเป้าหมาย (รองรับนาทีติดลบ)
//         targetHour = mealTime.hour;
//         targetMin  = mealTime.minute + offsetMin;
        
//         // ถ้านาทีติดลบ → ลด hour ลง 1 และปรับนาที
//         if (targetMin < 0) {
//           targetHour -= 1;
//           targetMin += 60;
//         }
//         // ถ้านาที >= 60 → เพิ่ม hour ขึ้น 1 และปรับนาที
//         else if (targetMin >= 60) {
//           targetHour += 1;
//           targetMin -= 60;
//         }
//       }

//       const delayMs = getMsUntil(targetHour, targetMin);
//       const id = `${entry.meal}-${entry.timing}-${entry.name}-${Date.now()}`;

//       const sw = await navigator.serviceWorker.ready;
//       sw.active?.postMessage({
//         type: "SCHEDULE_NOTIFICATION",
//         payload: {
//           delayMs,
//           title: entry.meal === "ก่อนนอน" 
//             ? `ถึงเวลารับประทานยาก่อนนอนแล้ว! 💊`
//             : `ถึงเวลา${entry.timing}แล้ว! 💊`,
//           body: `${entry.name} • ${entry.freq} (มื้อ${entry.meal})`,
//           tag: id,
//         },
//       });

//       const fireAt = new Date(Date.now() + delayMs).toLocaleTimeString("th-TH", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });

//       const record = { id, name: entry.name, meal: entry.meal, timing: entry.timing, fireAt };
//       setScheduledIds((prev) => {
//         const next = [...prev, record];
//         localStorage.setItem("scheduledNotifs", JSON.stringify(next));
//         return next;
//       });

//       return record;
//     },
//     [permission, requestPermission]
//   );

//   // ยกเลิก (ตอนนี้แค่ลบออกจาก list — SW timeout ยังจะยิง แต่ tag ซ้ำกันจะ replace)
//   const cancelNotification = useCallback((id) => {
//     setScheduledIds((prev) => {
//       const next = prev.filter((n) => n.id !== id);
//       localStorage.setItem("scheduledNotifs", JSON.stringify(next));
//       return next;
//     });
//   }, []);

//   // ทดสอบแจ้งเตือนทันที
//   const testNotification = useCallback(async (entry) => {
//     if (permission !== "granted") {
//       const ok = await requestPermission();
//       if (!ok) return;
//     }
//     const sw = await navigator.serviceWorker.ready;
//     sw.active?.postMessage({
//       type: "SCHEDULE_NOTIFICATION",
//       payload: {
//         delayMs: 2000, // 2 วินาที
//         title: `[ทดสอบ] ถึงเวลา${entry.timing}! 💊`,
//         body: `${entry.name} • มื้อ${entry.meal}`,
//         tag: "test-" + Date.now(),
//       },
//     });
//   }, [permission, requestPermission]);

//   return {
//     permission,
//     swReady,
//     scheduledIds,
//     requestPermission,
//     scheduleNotification,
//     cancelNotification,
//     testNotification,
//   };
// }

// ═══════════════════════════════════════════════════════════
// FILE: hooks/useNotification.js (PRODUCTION VERSION)
// ใช้ Push Notification ผ่าน Backend Server
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// FILE: hooks/useNotification.js (PRODUCTION VERSION)
// ใช้ Push Notification ผ่าน Backend Server
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const MEAL_TIMES = {
  เช้า: { hour: 8, minute: 0 },
  เที่ยง: { hour: 12, minute: 0 },
  เย็น: { hour: 14, minute: 40 },
  ก่อนนอน: { hour: 20, minute: 0 },
};

export function useNotification() {
  const currentUser = localStorage.getItem("currentUser");
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [subscription, setSubscription] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(false);

  // ตรวจสอบว่า server พร้อมใช้งานหรือไม่
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        });
        setServerAvailable(response.ok);
      } catch (error) {
        console.warn("⚠️ Push server not available:", error.message);
        setServerAvailable(false);
      }
    };
    checkServer();
  }, []);

  // Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("✅ SW registered:", reg.scope))
        .catch((err) => console.error("❌ SW error:", err));
    }
  }, []);

  // ── 1. Fallback: Local notification ────────────────────────
  const scheduleLocalNotification = useCallback(
    async (entry) => {
      const mealTime = MEAL_TIMES[entry.meal];
      let targetHour = mealTime.hour;
      let targetMin = mealTime.minute;

      if (entry.meal !== "ก่อนนอน") {
        const offsetMin =
          entry.timing === "ก่อนอาหาร" ? -30 : entry.timing === "หลังอาหาร" ? 30 : 0;
        targetMin += offsetMin;
        if (targetMin < 0) { targetHour -= 1; targetMin += 60; }
        if (targetMin >= 60) { targetHour += 1; targetMin -= 60; }
      }

      const fireAt = `${String(targetHour).padStart(2, "0")}:${String(targetMin).padStart(2, "0")}`;

      const schedules = JSON.parse(
        localStorage.getItem(`notificationSchedules_${currentUser}`) || "[]"
      );
      const newSchedule = {
        id: `local-${entry.meal}-${entry.name}-${Date.now()}`,
        userId: currentUser,
        name: entry.name,
        meal: entry.meal,
        timing: entry.timing,
        freq: entry.freq,
        targetHour,
        targetMin,
        fireAt,
        enabled: true,
        lastFired: null,
      };
      schedules.push(newSchedule);
      localStorage.setItem(`notificationSchedules_${currentUser}`, JSON.stringify(schedules));

      console.log(`⚠️ Scheduled locally: ${entry.name} at ${fireAt}`);
      return { id: newSchedule.id, name: entry.name, meal: entry.meal, timing: entry.timing, fireAt, serverScheduled: false };
    },
    [currentUser]
  );

  // ── 2. Subscribe to Push ────────────────────────────────────
  const subscribeToPush = useCallback(async () => {
    if (!serverAvailable) {
      console.warn("⚠️ Server not available, skipping push subscription");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("❌ Push notifications not supported");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      let existingSub = await registration.pushManager.getSubscription();

      if (existingSub) {
        console.log("✅ Using existing subscription");
        setSubscription(existingSub);
        await fetch(`${API_URL}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser, subscription: existingSub }),
        });
        return;
      }

      const vapidResponse = await fetch(`${API_URL}/vapid-public-key`);
      const { publicKey } = await vapidResponse.json();
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });
      setSubscription(sub);

      const response = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser, subscription: sub }),
      });
      if (!response.ok) throw new Error("Failed to save subscription");
      console.log("✅ Subscribed to push notifications");
    } catch (error) {
      console.error("❌ Push subscription failed:", error);
    }
  }, [currentUser, serverAvailable]);

  // ── 3. Request Permission ───────────────────────────────────
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("Browser นี้ไม่รองรับ Notification");
      return false;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted" && serverAvailable) {
      await subscribeToPush();
    }
    return result === "granted";
  }, [serverAvailable, subscribeToPush]);

  // Auto subscribe on permission granted
  useEffect(() => {
    if (permission === "granted" && serverAvailable && !subscription) {
      subscribeToPush();
    }
  }, [permission, serverAvailable, subscription, subscribeToPush]);

  // ── 4. Schedule Notification ────────────────────────────────
  const scheduleNotification = useCallback(
    async (entry) => {
      if (permission !== "granted") {
        const ok = await requestPermission();
        if (!ok) return null;
      }

      if (!serverAvailable) {
        console.warn("⚠️ Using local notification fallback");
        return scheduleLocalNotification(entry);
      }

      try {
        const mealTime = MEAL_TIMES[entry.meal];
        let targetHour = mealTime.hour;
        let targetMin = mealTime.minute;

        if (entry.meal !== "ก่อนนอน") {
          const offsetMin =
            entry.timing === "ก่อนอาหาร" ? -30 : entry.timing === "หลังอาหาร" ? 30 : 0;
          targetMin += offsetMin;
          if (targetMin < 0) { targetHour -= 1; targetMin += 60; }
          if (targetMin >= 60) { targetHour += 1; targetMin -= 60; }
        }

        const fireAt = `${String(targetHour).padStart(2, "0")}:${String(targetMin).padStart(2, "0")}`;

        const response = await fetch(`${API_URL}/schedule`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser,
            medication: { name: entry.name, meal: entry.meal, timing: entry.timing, freq: entry.freq, targetHour, targetMin },
          }),
        });

        if (!response.ok) throw new Error("Failed to schedule");
        const data = await response.json();
        console.log(`✅ Scheduled on server: ${entry.name} at ${fireAt}`);

        return {
          id: data.scheduleId || `${entry.meal}-${entry.name}-${Date.now()}`,
          name: entry.name, meal: entry.meal, timing: entry.timing, fireAt,
          serverScheduled: true,
        };
      } catch (error) {
        console.error("❌ Schedule error:", error);
        return scheduleLocalNotification(entry);
      }
    },
    [permission, requestPermission, currentUser, serverAvailable, scheduleLocalNotification]
  );

  // ── 5. Test Notification ────────────────────────────────────
  const showLocalTestNotification = async (entry) => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(`[ทดสอบ] ${entry.timing}! 💊`, {
        body: `${entry.name} • มื้อ${entry.meal}`,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        tag: "test-" + Date.now(),
        requireInteraction: true,
        vibrate: [200, 100, 200],
      });
    }
  };

  const testNotification = useCallback(
    async (entry) => {
      if (permission !== "granted") {
        const ok = await requestPermission();
        if (!ok) return;
      }
      if (serverAvailable) {
        try {
          await fetch(`${API_URL}/notify/test`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUser, medication: entry }),
          });
        } catch (error) {
          console.error("Test notification error:", error);
          showLocalTestNotification(entry);
        }
      } else {
        showLocalTestNotification(entry);
      }
    },
    [permission, requestPermission, currentUser, serverAvailable]
  );

  return {
    permission,
    serverAvailable,
    requestPermission,
    scheduleNotification,
    testNotification,
  };
}