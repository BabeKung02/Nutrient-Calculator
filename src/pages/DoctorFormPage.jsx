import { useState } from "react";

// ─── Helper ───────────────────────────────────

function toThaiDate(dateStr) {
  const MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${parseInt(y) + 543}`;
}

// ─── Field Wrapper ────────────────────────────

function Field({ label, icon, children }) {
  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────

export default function DoctorFormPage({ onSubmit, onCancel }) {
  const [date,         setDate]         = useState("");
  const [time,         setTime]         = useState("09:00");
  const [location,     setLocation]     = useState("");
  const [checkupName,  setCheckupName]  = useState("");
  const [touched,      setTouched]      = useState(false);

  const isValid = date.trim() && time.trim() && location.trim() && checkupName.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) return;
    const [h, m] = time.split(":");
    onSubmit({
      date:        toThaiDate(date),
      time:        `${h}:${m} น.`,
      location:    location.trim(),
      checkupName: checkupName.trim(),
    });
  };

  const inputStyle = (val) => ({
    ...s.input,
    borderColor: touched && !val.trim() ? "#e05a5a" : "#e0f5f5",
  });

  return (
    <div style={s.formWrap}>
      <div style={s.handle} />
      <h2 style={s.title}>เพิ่มนัดหมายใหม่</h2>

      {touched && !isValid && (
        <div style={s.errorBanner}>⚠️ กรุณากรอกข้อมูลให้ครบถ้วน</div>
      )}

      <div style={s.fields}>
        <Field label="วันที่นัด" icon="📅">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            style={inputStyle(date)} />
        </Field>

        <Field label="เวลา" icon="🕐">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            style={inputStyle(time)} />
        </Field>

        <div style={s.divider} />

        <Field label="สถานที่" icon="📍">
          <input type="text" placeholder="เช่น โรงพยาบาลศิริราช อาคารผู้ป่วยนอก"
            value={location} onChange={(e) => setLocation(e.target.value)}
            style={inputStyle(location)} />
        </Field>

        <Field label="ชื่อการตรวจ" icon="📋">
          <input type="text" placeholder="ระบุชื่อการตรวจที่นี่..."
            value={checkupName} onChange={(e) => setCheckupName(e.target.value)}
            style={inputStyle(checkupName)} />
        </Field>
      </div>

      <div style={s.actions}>
        <button onClick={onCancel}    style={s.btnCancel}>ยกเลิก</button>
        <button onClick={handleSubmit} style={s.btnConfirm}>ยืนยันการกรอกข้อมูล</button>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────

const s = {
  formWrap: { padding: "12px 20px 28px", display: "flex", flexDirection: "column", gap: "0", fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif", overflowY: "auto" },
  handle:   { width: "40px", height: "4px", background: "#e0e0e0", borderRadius: "99px", margin: "0 auto 16px" },
  title:    { fontSize: "1.15rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 14px 0" },
  errorBanner: { background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: "12px", padding: "10px 14px", fontSize: "0.85rem", color: "#c0392b", fontWeight: "600", marginBottom: "12px" },
  fields:   { display: "flex", flexDirection: "column", gap: "14px" },
  field:    { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#555", fontWeight: "600" },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e0f5f5",
    borderRadius: "12px", fontSize: "0.95rem", color: "#333",
    background: "#f8fffe", outline: "none", boxSizing: "border-box",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif", transition: "border-color 0.2s",
  },
  divider:    { height: "1px", background: "#f0f0f0", margin: "2px 0" },
  actions:    { display: "flex", gap: "10px", marginTop: "20px" },
  btnCancel:  { flex: 1, padding: "13px", borderRadius: "99px", border: "1.5px solid #ddd", background: "white", color: "#888", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer" },
  btnConfirm: { flex: 2, padding: "13px", borderRadius: "99px", border: "none", background: "linear-gradient(135deg, #64C5D7, #17BCBC)", color: "white", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer" },
};