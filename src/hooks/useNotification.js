// ── hooks/useNotification.js ───────────────────────────────────
// Custom Hook จัดการ Permission + Schedule Notification

import { useState, useEffect, useCallback } from "react";

export const MEAL_TIMES = {
  เช้า: { hour: 8,  minute: 0  },
  เที่ยง: { hour: 12, minute: 0  },
  เย็น:  { hour: 18, minute: 0  },
  ก่อนนอน: { hour: 20, minute: 0  },
};

// คำนวณ ms จนถึงเวลาถัดไปของวันนี้ (หรือพรุ่งนี้ถ้าผ่านแล้ว)
function getMsUntil(hour, minute) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1); // ข้ามวัน
  return target.getTime() - now.getTime();
}

export function useNotification() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [swReady, setSwReady] = useState(false);
  const [scheduledIds, setScheduledIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("scheduledNotifs") || "[]");
    } catch {
      return [];
    }
  });

  // Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
          setSwReady(true);
        })
        .catch((err) => console.error("SW error:", err));
    }
  }, []);

  // ขอ Permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("Browser นี้ไม่รองรับ Notification");
      return false;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  // Schedule notification ผ่าน Service Worker
  const scheduleNotification = useCallback(
    async (entry) => {
      if (permission !== "granted") {
        const ok = await requestPermission();
        if (!ok) return null;
      }

      const mealTime = MEAL_TIMES[entry.meal];
      if (!mealTime) return null;

      // ⭐ กรณีพิเศษ: มื้อก่อนนอน ให้ fix เวลาที่ 20:00 เสมอ (ไม่ + - เวลา)
      let targetHour, targetMin;
      
      if (entry.meal === "ก่อนนอน") {
        targetHour = 20;
        targetMin = 0;
      } else {
        // มื้ออื่นๆ ให้คำนวณตามปกติ
        const timingOffset = {
          ก่อนอาหาร: -30, // 15 นาทีก่อน
          หลังอาหาร: 30,  // 15 นาทีหลัง
        };

        const offsetMin = timingOffset[entry.timing] ?? 0;
        
        // คำนวณเวลาเป้าหมาย (รองรับนาทีติดลบ)
        targetHour = mealTime.hour;
        targetMin  = mealTime.minute + offsetMin;
        
        // ถ้านาทีติดลบ → ลด hour ลง 1 และปรับนาที
        if (targetMin < 0) {
          targetHour -= 1;
          targetMin += 60;
        }
        // ถ้านาที >= 60 → เพิ่ม hour ขึ้น 1 และปรับนาที
        else if (targetMin >= 60) {
          targetHour += 1;
          targetMin -= 60;
        }
      }

      const delayMs = getMsUntil(targetHour, targetMin);
      const id = `${entry.meal}-${entry.timing}-${entry.name}-${Date.now()}`;

      const sw = await navigator.serviceWorker.ready;
      sw.active?.postMessage({
        type: "SCHEDULE_NOTIFICATION",
        payload: {
          delayMs,
          title: entry.meal === "ก่อนนอน" 
            ? `ถึงเวลารับประทานยาก่อนนอนแล้ว! 💊`
            : `ถึงเวลา${entry.timing}แล้ว! 💊`,
          body: `${entry.name} • ${entry.freq} (มื้อ${entry.meal})`,
          tag: id,
        },
      });

      const fireAt = new Date(Date.now() + delayMs).toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const record = { id, name: entry.name, meal: entry.meal, timing: entry.timing, fireAt };
      setScheduledIds((prev) => {
        const next = [...prev, record];
        localStorage.setItem("scheduledNotifs", JSON.stringify(next));
        return next;
      });

      return record;
    },
    [permission, requestPermission]
  );

  // ยกเลิก (ตอนนี้แค่ลบออกจาก list — SW timeout ยังจะยิง แต่ tag ซ้ำกันจะ replace)
  const cancelNotification = useCallback((id) => {
    setScheduledIds((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem("scheduledNotifs", JSON.stringify(next));
      return next;
    });
  }, []);

  // ทดสอบแจ้งเตือนทันที
  const testNotification = useCallback(async (entry) => {
    if (permission !== "granted") {
      const ok = await requestPermission();
      if (!ok) return;
    }
    const sw = await navigator.serviceWorker.ready;
    sw.active?.postMessage({
      type: "SCHEDULE_NOTIFICATION",
      payload: {
        delayMs: 2000, // 2 วินาที
        title: `[ทดสอบ] ถึงเวลา${entry.timing}! 💊`,
        body: `${entry.name} • มื้อ${entry.meal}`,
        tag: "test-" + Date.now(),
      },
    });
  }, [permission, requestPermission]);

  return {
    permission,
    swReady,
    scheduledIds,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    testNotification,
  };
}