import { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Background from "../components/Background";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ─── Google Calendar Helper ───────────────────

function toGCalDate(thaiDateStr, timeStr) {
  const thaiMonths = {
    มกราคม: "01", กุมภาพันธ์: "02", มีนาคม: "03",
    เมษายน: "04", พฤษภาคม: "05", มิถุนายน: "06",
    กรกฎาคม: "07", สิงหาคม: "08", กันยายน: "09",
    ตุลาคม: "10", พฤศจิกายน: "11", ธันวาคม: "12",
  };
  const [d, m, y] = thaiDateStr.trim().split(" ");
  const day   = d.padStart(2, "0");
  const month = thaiMonths[m] || "01";
  const year  = String(parseInt(y) - 543);
  const [h, min] = timeStr.replace(" น.", "").split(":");
  const hour   = (h || "09").padStart(2, "0");
  const minute = (min || "00").padStart(2, "0");
  const endHour = String(parseInt(hour) + 1).padStart(2, "0");
  return {
    startDT: `${year}${month}${day}T${hour}${minute}00`,
    endDT:   `${year}${month}${day}T${endHour}${minute}00`,
  };
}

function openGoogleCalendar({ date, time, location, checkupName }) {
  const { startDT, endDT } = toGCalDate(date, time);
  const params = new URLSearchParams({
    action:   "TEMPLATE",
    text:     `🏥 นัดพบแพทย์ - ${checkupName}`,
    dates:    `${startDT}/${endDT}`,
    details:  `การตรวจ: ${checkupName}\nสถานที่: ${location}\nแอป: Smart DM`,
    location,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
}

// ─── Icons ────────────────────────────────────

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

// ─── Sub-components ───────────────────────────

function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoIcon}>{icon}</span>
      <span style={styles.infoText}>
        {label}: <b>{value}</b>
      </span>
    </div>
  );
}

function Divider() {
  return <div style={styles.divider} />;
}

// ─── Fallback appointment (dev / direct URL access) ──

const FALLBACK = {
  date:        "25 กุมภาพันธ์ 2567",
  time:        "09:00 น.",
  location:    "โรงพยาบาลศิริราช อาคารผู้ป่วยนอก",
  checkupName: "ตรวจเบาหวานประจำปี",
  confirmed:   false,
};

// ─── Main Component ───────────────────────────

export default function DoctorDetailPage() {
  const { state }  = useLocation();
  const appointment = state?.appointment ?? FALLBACK;

  const [confirmed, setConfirmed] = useState(appointment.confirmed ?? false);

  // ── Confirm ──────────────────────────────────
  const handleConfirm = () => {
    Swal.fire({
      title: "ยืนยันการนัดหมาย",
      html: `
        <p style="color:#555;font-size:0.9rem;">คุณต้องการยืนยันนัดหมายนี้ใช่หรือไม่?</p>
        <p style="font-weight:700;color:#17BCBC;margin-top:6px;">
          ${appointment.date} เวลา ${appointment.time}
        </p>`,
      icon: "question",
      showCancelButton:  true,
      cancelButtonText:  "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#17BCBC",
      cancelButtonColor:  "#aaa",
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;
      setConfirmed(true);
      openGoogleCalendar(appointment);
    });
  };

  // ── Cancel confirm ────────────────────────────
  const handleCancelConfirm = () => {
    Swal.fire({
      title: "ยกเลิกการนัดหมาย",
      text:  "คุณต้องการยกเลิกการยืนยันนัดหมายนี้ใช่หรือไม่?",
      icon:  "warning",
      showCancelButton:  true,
      cancelButtonText:  "ไม่",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#17BCBC",
      cancelButtonColor:  "#aaa",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) setConfirmed(false);
    });
  };

  // ── Reschedule ────────────────────────────────
  const handleReschedule = () => {
    Swal.fire({
      title: "เลื่อนนัด",
      text:  "ฟีเจอร์นี้กำลังพัฒนาอยู่ กรุณาติดต่อโรงพยาบาลโดยตรง",
      icon:  "info",
      confirmButtonColor: "#17BCBC",
      confirmButtonText:  "ตกลง",
    });
  };

  return (
    <Background>
      <div style={styles.card}>
        {/* Header — ← กลับไปหน้า list */}
        <Header title="บันทึกนัดพบแพทย์" backTo="/doctor-record" />

        <div style={styles.inner}>

          {/* ── Info Card ─────────────────────── */}
          <div style={styles.infoCard}>

            {/* Title row */}
            <div style={styles.infoTitleRow}>
              <span style={styles.infoTitle}>ใบนัดพบแพทย์</span>
              {confirmed && (
                <span style={styles.confirmedBadge}>&#10003; ยืนยันแล้ว</span>
              )}
            </div>

            <Divider />

            <InfoRow icon={<CalendarIcon />} label="วันที่"        value={appointment.date} />
            <InfoRow icon={<ClockIcon />}    label="เวลา"          value={appointment.time} />

            <Divider />

            <InfoRow icon={<LocationIcon />} label="สถานที่"       value={appointment.location} />
            <InfoRow icon={<ClipboardIcon />}label="ชื่อการตรวจ"   value={appointment.checkupName} />
          </div>

          {/* ── Action Buttons ─────────────────── */}
          {!confirmed ? (
            <button onClick={handleConfirm} style={styles.btnConfirm}>
              ยืนยันการนัดหมาย
            </button>
          ) : (
            <button onClick={handleCancelConfirm} style={styles.btnCancelConfirm}>
              ยกเลิกการนัดหมาย
            </button>
          )}

          {/* <button onClick={handleReschedule} style={styles.btnReschedule}>
            เลื่อนนัด
          </button> */}

        </div>
      </div>
      <Footer />
    </Background>
  );
}

// ─── Styles ───────────────────────────────────

const FONT = "'Sarabun', 'Noto Sans Thai', sans-serif";

const styles = {
  card: {
    background:    "white",
    borderRadius:  "24px",
    width:         "100%",
    maxWidth:      "420px",
    boxShadow:     "0 8px 32px rgba(0,0,0,0.12)",
    overflow:      "hidden",
    fontFamily:    FONT,
  },
  inner: {
    padding:       "16px 20px 28px",
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
  },

  // Info card
  infoCard: {
    background:    "#f8fffe",
    borderRadius:  "16px",
    padding:       "16px",
    border:        "1px solid #e0f5f5",
    display:       "flex",
    flexDirection: "column",
    gap:           "10px",
  },
  infoTitleRow: {
    display:    "flex",
    alignItems: "center",
    gap:        "10px",
    flexWrap:   "wrap",
  },
  infoTitle: {
    fontSize:   "1.05rem",
    fontWeight: "700",
    color:      "#2d2d2d",
  },
  confirmedBadge: {
    background:   "#dcfce7",
    color:        "#16a34a",
    borderRadius: "99px",
    padding:      "2px 10px",
    fontSize:     "0.78rem",
    fontWeight:   "600",
  },
  divider: {
    height:     "1px",
    background: "#e0f5f5",
    margin:     "2px 0",
  },
  infoRow: {
    display:    "flex",
    alignItems: "flex-start",
    gap:        "10px",
  },
  infoIcon: {
    flexShrink: 0,
    marginTop:  "1px",
    color:      "#17BCBC",
  },
  infoText: {
    fontSize:   "0.92rem",
    color:      "#444",
    lineHeight: 1.5,
  },

  // Buttons
  btnConfirm: {
    width:        "100%",
    padding:      "14px",
    borderRadius: "99px",
    border:       "none",
    background:   "linear-gradient(135deg, #64C5D7, #17BCBC)",
    color:        "white",
    fontSize:     "1rem",
    fontWeight:   "700",
    cursor:       "pointer",
    boxShadow:    "0 4px 14px rgba(23,188,188,0.35)",
    fontFamily:   FONT,
  },
  btnCancelConfirm: {
    width:        "100%",
    padding:      "14px",
    borderRadius: "99px",
    border:       "2px solid #ccc",
    background:   "white",
    color:        "#888",
    fontSize:     "1rem",
    fontWeight:   "600",
    cursor:       "pointer",
    fontFamily:   FONT,
  },
  btnReschedule: {
    width:        "100%",
    padding:      "13px",
    borderRadius: "99px",
    border:       "none",
    background:   "#efefef",
    color:        "#666",
    fontSize:     "1rem",
    fontWeight:   "600",
    cursor:       "pointer",
    fontFamily:   FONT,
  },
};