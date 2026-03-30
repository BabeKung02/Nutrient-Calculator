import { useState } from "react";

// ─── Thai month helper ─────────────────────────

function toThaiDate(dateStr) {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
}

// ─── Checkup Options ───────────────────────────

// const CHECKUP_OPTIONS = [
//   "ตรวจเบาหวานประจำปี",
//   "ตรวจระดับน้ำตาลในเลือด",
//   "ตรวจสุขภาพประจำปี",
//   "ตรวจไต",
//   "ตรวจตา",
//   "ตรวจเท้า",
//   "ติดตามผลการรักษา",
// ];

// ─── Main Component ───────────────────────────

export default function DoctorFormPage({ onSubmit, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [checkupSelect, setCheckupSelect] = useState("");
  const [checkupCustom] = useState("");
  const [touched, setTouched] = useState(false);

  const checkupName =
    checkupSelect === "__custom__" ? checkupCustom.trim() : checkupSelect;

  const isValid =
    date.trim() !== "" &&
    time.trim() !== "" &&
    location.trim() !== "" 
    && checkupName !== "";

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) return;

    const [h, m] = time.split(":");
    onSubmit({
      date: toThaiDate(date),
      time: `${h}:${m} น.`,
      location: location.trim(),
      checkupName,
    });
  };

  return (
    <div style={styles.formWrap}>
      {/* Handle bar */}
      <div style={styles.handle} />

      {/* Title */}
      <h2 style={styles.sheetTitle}>เพิ่มนัดหมายใหม่</h2>

      {/* Error banner */}
      {touched && !isValid && (
        <div style={styles.errorBanner}>
          ⚠️ กรุณากรอกข้อมูลให้ครบถ้วน
        </div>
      )}

      {/* Fields */}
      <div style={styles.fields}>
        <Field label="วันที่นัด" icon="📅">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              ...styles.input,
              borderColor: touched && !date ? "#e05a5a" : "#e0f5f5",
            }}
          />
        </Field>

        <Field label="เวลา" icon="🕐">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              ...styles.input,
              borderColor: touched && !time ? "#e05a5a" : "#e0f5f5",
            }}
          />
        </Field>

        <div style={styles.divider} />

        <Field label="สถานที่" icon="📍">
          <input
            type="text"
            placeholder="เช่น โรงพยาบาลศิริราช อาคารผู้ป่วยนอก"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              ...styles.input,
              borderColor: touched && !location.trim() ? "#e05a5a" : "#e0f5f5",
            }}
          />
        </Field>

<Field label="ชื่อการตรวจ" icon="📋">
  <input
    type="text"
    placeholder="ระบุชื่อการตรวจที่นี่..."
    value={checkupName} // ใช้ state ตัวเดียวเก็บค่าที่พิมพ์เลย
    onChange={(e) => setCheckupSelect(e.target.value)}
    style={{
      ...styles.input,
      borderColor: touched && !checkupName.trim() ? "#e05a5a" : "#e0f5f5",
      backgroundColor: "#ffffff",
    }}
  />
</Field>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button onClick={onCancel} style={styles.btnCancel}>
          ยกเลิก
        </button>
        <button onClick={handleSubmit} style={styles.btnConfirm}>
          ยืนยันการกรอกข้อมูล
        </button>
      </div>
    </div>
  );
}

// ─── Field Wrapper ────────────────────────────

function Field({ label, icon, error, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

// ─── Styles ───────────────────────────────────

const styles = {
  formWrap: {
    padding: "12px 20px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
    overflowY: "auto",
  },
  handle: {
    width: "40px",
    height: "4px",
    background: "#e0e0e0",
    borderRadius: "99px",
    margin: "0 auto 16px",
  },
  sheetTitle: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 14px 0",
  },
  errorBanner: {
    background: "#fff0f0",
    border: "1px solid #ffc0c0",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "0.85rem",
    color: "#c0392b",
    fontWeight: "600",
    marginBottom: "12px",
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    color: "#555",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e0f5f5",
    borderRadius: "12px",
    fontSize: "0.95rem",
    color: "#333",
    background: "#f8fffe",
    outline: "none",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  divider: {
    height: "1px",
    background: "#f0f0f0",
    margin: "2px 0",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  btnCancel: {
    flex: 1,
    padding: "13px",
    borderRadius: "99px",
    border: "1.5px solid #ddd",
    background: "white",
    color: "#888",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
  btnConfirm: {
    flex: 2,
    padding: "13px",
    borderRadius: "99px",
    border: "none",
    background: "linear-gradient(135deg, #64C5D7, #17BCBC)",
    color: "white",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
};