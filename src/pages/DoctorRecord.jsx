import { useState } from "react";
import Swal from "sweetalert2";

// ─────────────────────────────────────────────
// Google Calendar Helper
// ─────────────────────────────────────────────

function toGCalDate(thaiDateStr, timeStr) {
  const thaiMonths = {
    มกราคม: "01",
    กุมภาพันธ์: "02",
    มีนาคม: "03",
    เมษายน: "04",
    พฤษภาคม: "05",
    มิถุนายน: "06",
    กรกฎาคม: "07",
    สิงหาคม: "08",
    กันยายน: "09",
    ตุลาคม: "10",
    พฤศจิกายน: "11",
    ธันวาคม: "12",
  };

  const parts = thaiDateStr.trim().split(" ");
  const day = parts[0].padStart(2, "0");
  const month = thaiMonths[parts[1]] || "01";
  const year = String(parseInt(parts[2]) - 543);

  const [h, m] = timeStr.replace(" น.", "").split(":");
  const hour = (h || "09").padStart(2, "0");
  const min = (m || "00").padStart(2, "0");

  const startDT = `${year}${month}${day}T${hour}${min}00`;
  const endHour = String(parseInt(hour) + 1).padStart(2, "0");
  const endDT = `${year}${month}${day}T${endHour}${min}00`;

  return { startDT, endDT };
}

function openGoogleCalendar({ date, time, location, checkupName }) {
  const { startDT, endDT } = toGCalDate(date, time);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `🏥 นัดพบแพทย์ - ${checkupName}`,
    dates: `${startDT}/${endDT}`,
    details: `การตรวจ: ${checkupName}\nสถานที่: ${location}\nแอป: Smart DM`,
    location: location,
  });

  window.open(
    `https://calendar.google.com/calendar/render?${params}`,
    "_blank",
  );
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const APPOINTMENT = {
  date: "25 กุมภาพันธ์ 2567",
  time: "09:00 น.",
  location: "โรงพยาบาลศิริราช อาคารผู้ป่วยนอก",
  checkupName: "ตรวจเบาหวานประจำปี",
};

export default function DoctorRecord({ appointment = APPOINTMENT }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    Swal.fire({
      title: "ยืนยันการนัดหมาย",
      html: `

        <p style="font-weight:600;color:#e05a7a;">${appointment.date} เวลา ${appointment.time}</p>
      `,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#e05a7a",
      cancelButtonColor: "#aaa",
      reverseButtons: true,
    }).then((result) => {
      if (!result.isConfirmed) return;
      setConfirmed(true);
      openGoogleCalendar(appointment);
    });
  };

  const handleCancelConfirm = () => {
    Swal.fire({
      title: "ยกเลิกการยืนยัน",
      text: "คุณต้องการยกเลิกการยืนยันนัดหมายนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#aaa",
      cancelButtonColor: "#e05a7a",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) setConfirmed(false);
    });
  };

  const handleReschedule = () => {
    Swal.fire({
      title: "เลื่อนนัด",
      text: "ฟีเจอร์นี้กำลังพัฒนาอยู่ กรุณาติดต่อโรงพยาบาลโดยตรง",
      icon: "info",
      confirmButtonColor: "#e05a7a",
      confirmButtonText: "ตกลง",
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.logoText}>Smart DM</span>
        </div>

        {/* Info Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>ใบนัดพบแพทย์</div>

          {confirmed && <div style={styles.confirmedBadge}>✓ ยืนยันแล้ว</div>}

          <div style={styles.divider} />

          <div style={styles.infoRow}>
            <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
              <CalendarIcon />
            </span>
            <span style={styles.infoText}>
              วันที่: <b>{appointment.date}</b>
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
              <ClockIcon />
            </span>
            <span style={styles.infoText}>
              เวลา: <b>{appointment.time}</b>
            </span>
          </div>

          <div style={styles.divider} />

          <div style={styles.infoRow}>
            <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
              <LocationIcon />
            </span>
            <span style={styles.infoText}>
              สถานที่: <b>{appointment.location}</b>
            </span>
          </div>

          <div style={styles.infoRow}>
            <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
              <ClipboardIcon />
            </span>
            <span style={styles.infoText}>
              ชื่อการตรวจ: <b>{appointment.checkupName}</b>
            </span>
          </div>
        </div>

        {/* Buttons */}
        {!confirmed ? (
          <button onClick={handleConfirm} style={styles.btnConfirm}>
            ยืนยันการนัดหมาย
          </button>
        ) : (
          <button onClick={handleCancelConfirm} style={styles.btnCancelConfirm}>
            ยกเลิกการยืนยัน
          </button>
        )}

        <button onClick={handleReschedule} style={styles.btnReschedule}>
          เลื่อนนัด
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
    padding: "20px",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
  card: {
    background: "#fce4ec",
    borderRadius: "24px",
    padding: "24px 20px",
    width: "100%",
    maxWidth: "340px",
    boxShadow: "0 8px 32px rgba(224,90,122,0.18)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  logoText: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#e05a7a",
    fontFamily: "Georgia, serif",
    lineHeight: 1,
  },
  infoCard: {
    background: "white",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 2px 12px rgba(224,90,122,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  infoTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#2d2d2d",
  },
  confirmedBadge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#16a34a",
    borderRadius: "99px",
    padding: "2px 12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    width: "fit-content",
  },
  divider: {
    height: "1px",
    background: "#f3e0e5",
    margin: "2px 0",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  infoIcon: {
    flexShrink: 0,
    marginTop: "1px",
  },
  infoText: {
    fontSize: "0.92rem",
    color: "#444",
    lineHeight: 1.5,
  },
  btnConfirm: {
    width: "100%",
    padding: "14px",
    borderRadius: "99px",
    border: "none",
    background: "linear-gradient(135deg, #e05a7a, #c2185b)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(224,90,122,0.35)",
    transition: "all 0.2s",
  },
  btnConfirmed: {
    background: "linear-gradient(135deg, #a8d5a2, #66bb6a)",
    boxShadow: "0 4px 14px rgba(102,187,106,0.3)",
    cursor: "default",
  },
  btnCancelConfirm: {
    width: "100%",
    padding: "14px",
    borderRadius: "99px",
    border: "2px solid #aaa",
    background: "white",
    color: "#888",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnReschedule: {
    width: "100%",
    padding: "13px",
    borderRadius: "99px",
    border: "none",
    background: "#e0e0e0",
    color: "#666",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
