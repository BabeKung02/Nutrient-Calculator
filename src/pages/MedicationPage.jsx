import { useState, useEffect } from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import Footer from "../components/Footer";
import { useNotification } from "../hooks/useNotification";
import Swal from "sweetalert2";

// ─── Permission Banner ────────────────────────────────────────

const PermissionBanner = ({ permission, onRequest }) => {
  if (permission === "granted") return null;
  if (permission === "denied") return (
    <div style={{ ...b.wrap, background: "#fff1f2", border: "1.5px solid #fecdd3" }}>
      <span>🚫</span>
      <div>
        <div style={b.title}>การแจ้งเตือนถูกบล็อก</div>
        <div style={b.sub}>กรุณาเปิดใน Settings ของ Browser</div>
      </div>
    </div>
  );
  return (
    <div style={{ ...b.wrap, background: "#f5f3ff", border: "1.5px solid #c4b5fd" }}>
      <span>🔔</span>
      <div style={{ flex: 1 }}>
        <div style={b.title}>เปิดการแจ้งเตือน</div>
        <div style={b.sub}>รับแจ้งเตือนเวลารับประทานยาทุกวัน</div>
      </div>
      <button style={b.btn} onClick={onRequest}>เปิด</button>
    </div>
  );
};

const b = {
  wrap:  { display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "16px", marginBottom: "16px" },
  title: { fontWeight: 700, fontSize: "14px", color: "#2d2050" },
  sub:   { fontSize: "12px", color: "#9ca3af", marginTop: "2px" },
  btn:   { padding: "8px 16px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" },
};

// ─── Pill Selector ────────────────────────────────────────────

const PillSelector = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
    {options.map((opt) => (
      <button key={opt.value} onClick={() => onChange(opt.value)}
        style={{ padding: "8px 16px", borderRadius: "30px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all .2s",
          ...(value === opt.value
            ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", border: "2px solid #7c3aed", boxShadow: "0 4px 12px rgba(124,58,237,.35)" }
            : { background: "white", color: "#7c3aed", border: "2px solid #ddd6fe" })
        }}>
        {opt.label}
      </button>
    ))}
  </div>
);

// ─── Tag Checkbox ─────────────────────────────────────────────

const TagCheckbox = ({ label, checked, onChange, color, disabled }) => (
  <button onClick={() => !disabled && onChange(!checked)}
    style={{ padding: "9px 18px", borderRadius: "14px", fontSize: "14px", fontWeight: 600, transition: "all .2s",
      border: `2px solid ${checked ? color.border : "#e2d9f3"}`,
      background: checked ? color.bg : (disabled ? "#f3f4f6" : "white"),
      color: checked ? color.text : (disabled ? "#d1d5db" : "#9ca3af"),
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: checked ? `0 3px 10px ${color.shadow}` : "none",
      opacity: disabled ? 0.5 : 1,
    }}>
    {checked && "✓ "}{label}
  </button>
);

// ─── Notification Badge ───────────────────────────────────────

const NotifBadge = ({ scheduled }) => {
  if (!scheduled) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px",
      background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px",
      padding: "5px 10px", width: "fit-content" }}>
      <span style={{ fontSize: "12px" }}>🔔</span>
      <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
        แจ้งเตือน {scheduled.fireAt}
      </span>
    </div>
  );
};

// ─── Meal Card ────────────────────────────────────────────────

const TIMING_COLORS = {
  หลังอาหาร: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  ก่อนอาหาร: { bg: "#fef9c3", text: "#a16207", border: "#fde047" },
  ก่อนนอน:  { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe" },
};
const MEAL_ICONS = { เช้า: "🌅", เที่ยง: "☀️", เย็น: "🌆", ก่อนนอน: "🌙" };

const MealCard = ({ entry, onDelete, onTest, scheduled }) => {
  const c = TIMING_COLORS[entry.timing] || TIMING_COLORS["หลังอาหาร"];
  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "14px 16px",
      boxShadow: "0 2px 12px rgba(124,58,237,.1)", border: "1.5px solid #ede9fe", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "24px" }}>{MEAL_ICONS[entry.meal] || "🍽️"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#2d2050", fontSize: "15px" }}>{entry.name}</div>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
            {entry.freq} • {entry.meal}
            {entry.amount && (
              <span style={{ marginLeft: "6px", background: "#f5f3ff", color: "#7c3aed",
                borderRadius: "6px", padding: "1px 7px", fontWeight: 700, fontSize: "11px" }}>
                💊 {entry.amount} เม็ด
              </span>
            )}
          </div>
          <NotifBadge scheduled={scheduled} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
            whiteSpace: "nowrap", background: c.bg, color: c.text, border: `1.5px solid ${c.border}` }}>
            {entry.timing}
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => onTest(entry)}
              style={{ background: "#fef9c3", border: "none", borderRadius: "10px", width: 28, height: 28,
                cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🔔
            </button>
            <button onClick={onDelete}
              style={{ background: "#fef2f2", border: "none", borderRadius: "10px", width: 28, height: 28,
                cursor: "pointer", color: "#ef4444", fontSize: "13px", fontWeight: 700 }}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────

const Toast = ({ msg, visible }) => (
  <div style={{ position: "fixed", bottom: 90, left: "50%",
    transform: `translateX(-50%) translateY(${visible ? 0 : "20px"})`,
    opacity: visible ? 1 : 0, transition: "all .3s ease",
    background: "#2d2050", color: "white", padding: "12px 20px",
    borderRadius: "14px", fontSize: "14px", fontWeight: 600,
    boxShadow: "0 6px 20px rgba(0,0,0,.2)", zIndex: 200,
    whiteSpace: "nowrap", pointerEvents: "none" }}>
    {msg}
  </div>
);

// ─── Add Modal ────────────────────────────────────────────────

const MEDICINE_OPTIONS = ["Glipizide","Metformin","Pioglitazone","Empagliflozin","Sitagliptin","Semaglutide"];
const MEAL_OPTIONS = [
  { label: "เช้า",     color: { bg: "#fff7ed", text: "#ea580c", border: "#fdba74", shadow: "rgba(234,88,12,.2)" } },
  { label: "เที่ยง",   color: { bg: "#fefce8", text: "#ca8a04", border: "#fde047", shadow: "rgba(202,138,4,.2)" } },
  { label: "เย็น",     color: { bg: "#eff6ff", text: "#2563eb", border: "#93c5fd", shadow: "rgba(37,99,235,.2)" } },
  { label: "ก่อนนอน", color: { bg: "#f5f3ff", text: "#7c3aed", border: "#c4b5fd", shadow: "rgba(124,58,237,.2)" } },
];

const AddModal = ({ onClose, onAdd }) => {
  const [name,   setName]   = useState("");
  const [freq,   setFreq]   = useState(1);
  const [amount, setAmount] = useState(1);
  const [meals,  setMeals]  = useState({ เช้า: false, เที่ยง: false, เย็น: false, ก่อนนอน: false });
  const [timing, setTiming] = useState("หลังอาหาร");

  useEffect(() => {
    setMeals({ เช้า: false, เที่ยง: false, เย็น: false, ก่อนนอน: false });
  }, [freq]);

  useEffect(() => {
    const hasNonBedtime = meals.เช้า || meals.เที่ยง || meals.เย็น;
    const onlyBedtime   = meals.ก่อนนอน && !hasNonBedtime;
    if (onlyBedtime) setTiming("ก่อนนอน");
    else if (timing === "ก่อนนอน" && hasNonBedtime) setTiming("หลังอาหาร");
  }, [meals, timing]);

  const selectedCount = Object.values(meals).filter(Boolean).length;

  const handleMealToggle = (label, current) => {
    if (current) {
      setMeals((p) => ({ ...p, [label]: false }));
    } else if (selectedCount < freq) {
      setMeals((p) => ({ ...p, [label]: true }));
    }
  };

  const handleAdd = () => {
    const selected = Object.entries(meals).filter(([, v]) => v).map(([k]) => k);
    if (!name) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกยา", confirmButtonColor: "#7c3aed" }); return;
    }
    if (selected.length === 0) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกมื้อ", confirmButtonColor: "#7c3aed" }); return;
    }
    if (selected.length !== freq) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกช่วงเวลาให้ครบ",
        text: `เลือก ${freq} มื้อ (ตอนนี้เลือก ${selected.length} มื้อ)`, confirmButtonColor: "#7c3aed" }); return;
    }
    onAdd(selected.map((m) => ({ name, freq: `${freq} เวลา`, meal: m, timing, amount })));
    onClose();
  };

  const lbl = { display: "block", fontSize: "13px", fontWeight: 600, color: "#7c3aed",
    marginBottom: "8px", textTransform: "uppercase", letterSpacing: ".05em" };
  const selectStyle = { width: "100%", padding: "12px 16px", borderRadius: "14px",
    border: "2px solid #ede9fe", fontSize: "15px", outline: "none", marginBottom: "16px",
    boxSizing: "border-box", color: "#2d2050", background: "white", cursor: "pointer" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: "480px", background: "white",
        borderRadius: "28px 28px 0 0", padding: "20px 24px 36px",
        boxShadow: "0 -8px 40px rgba(0,0,0,.2)", animation: "slideUp .3s ease" }}>

        <div style={{ width: 48, height: 5, borderRadius: 99, background: "#e2d9f3", margin: "0 auto 18px" }} />
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#2d2050", marginBottom: "20px" }}>เพิ่มรายการใหม่</h3>

        <label style={lbl}>เลือกยา</label>
        <select style={selectStyle} value={name} onChange={(e) => setName(e.target.value)}>
          <option value="">-- เลือกยา --</option>
          {MEDICINE_OPTIONS.map((med) => <option key={med} value={med}>{med}</option>)}
        </select>

        <label style={lbl}>จำนวนเม็ด</label>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px",
          border: "2px solid #ede9fe", borderRadius: "12px", padding: "5px 10px",
          background: "white", marginBottom: "16px" }}>
          <button onClick={() => setAmount((v) => Math.max(1, v - 1))}
            style={{ width: 26, height: 26, borderRadius: "7px", border: "2px solid #ddd6fe",
              background: "white", color: "#7c3aed", fontSize: "1rem", fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
          <input type="number" min="1" value={amount}
            onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 1) setAmount(v); }}
            style={{ width: 36, border: "none", outline: "none", textAlign: "center",
              fontSize: "14px", fontWeight: 700, color: "#2d2050", background: "transparent" }} />
          <button onClick={() => setAmount((v) => v + 1)}
            style={{ width: 26, height: 26, borderRadius: "7px", border: "none",
              background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white",
              fontSize: "1rem", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
        </div>

        <label style={lbl}>วิธีรับประทาน</label>
        <PillSelector
          options={[{ label: "1 เวลา", value: 1 }, { label: "2 เวลา", value: 2 }, { label: "3 เวลา", value: 3 }]}
          value={freq} onChange={setFreq} />

        <label style={{ ...lbl, marginTop: "16px" }}>มื้ออาหาร (เลือก {freq} มื้อ)</label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {MEAL_OPTIONS.map(({ label, color }) => (
            <TagCheckbox key={label} label={label} checked={meals[label]}
              onChange={() => handleMealToggle(label, meals[label])}
              color={color} disabled={!meals[label] && selectedCount >= freq} />
          ))}
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#7c3aed", fontWeight: 600 }}>
          เลือกแล้ว {selectedCount}/{freq} มื้อ
        </div>

        {(meals.เช้า || meals.เที่ยง || meals.เย็น) && (
          <>
            <label style={{ ...lbl, marginTop: "16px" }}>เวลารับประทาน</label>
            <PillSelector
              options={[{ label: "หลังอาหาร", value: "หลังอาหาร" }, { label: "ก่อนอาหาร", value: "ก่อนอาหาร" }]}
              value={timing} onChange={setTiming} />
          </>
        )}

        <div style={{ background: "#f5f3ff", borderRadius: "12px", padding: "10px 14px", marginTop: "16px" }}>
          <span style={{ fontSize: "12px", color: "#7c3aed", fontWeight: 600 }}>
            🔔 ระบบจะแจ้งเตือนตามมื้อที่เลือกโดยอัตโนมัติ
          </span>
        </div>

        <button onClick={handleAdd}
          style={{ width: "100%", marginTop: "18px", padding: "16px", borderRadius: "16px",
            border: "none", fontSize: "16px", fontWeight: 700, color: "white",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(124,58,237,.4)" }}>
          บันทึกรายการยา
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────

const TIMING_ORDER = ["หลังอาหาร", "ก่อนอาหาร", "ก่อนนอน"];
const TIMING_EMOJI = { หลังอาหาร: "🍽️", ก่อนอาหาร: "⏰", ก่อนนอน: "🌙" };
const MEAL_ORDER   = ["เช้า", "เที่ยง", "เย็น", "ก่อนนอน"];

export default function MedicationPage() {
  const currentUser = localStorage.getItem("currentUser");
  const userData    = JSON.parse(localStorage.getItem("userData") || "null");

  const [entries,   setEntries]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast,     setToast]     = useState({ msg: "", visible: false });
  const [notifMap,  setNotifMap]  = useState({});

  const { permission, scheduleNotification, requestPermission, testNotification } = useNotification();

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(`medication_${currentUser}`) || "[]")); } catch {}
    try { setNotifMap(JSON.parse(localStorage.getItem(`medicationNotifs_${currentUser}`) || "{}")); } catch {}
  }, [currentUser]);

  const saveEntries  = (v) => localStorage.setItem(`medication_${currentUser}`,       JSON.stringify(v));
  const saveNotifMap = (v) => localStorage.setItem(`medicationNotifs_${currentUser}`, JSON.stringify(v));

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 2800);
  };

  const handleAdd = async (newEntries) => {
    const withIds = newEntries.map((e) => ({ ...e, id: Date.now() + Math.random() }));
    const updated = [...entries, ...withIds];
    setEntries(updated);
    saveEntries(updated);

    const newMap = { ...notifMap };
    const msgs   = [];
    for (const e of withIds) {
      const record = await scheduleNotification(e);
      if (record) { newMap[e.id] = record; msgs.push(`${e.meal} เวลา ${record.fireAt}`); }
    }
    setNotifMap(newMap);
    saveNotifMap(newMap);
    if (msgs.length > 0) showToast(msgs.length === 1 ? `✅ ตั้งแจ้งเตือน ${msgs[0]}` : `✅ ตั้งแจ้งเตือน ${msgs.length} มื้อสำเร็จ`);
  };

  const handleDelete = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
    const newMap = { ...notifMap };
    delete newMap[id];
    setNotifMap(newMap);
    saveNotifMap(newMap);
  };

  const handleTest = async (entry) => {
    await testNotification(entry);
    showToast("🔔 ส่งแจ้งเตือนทดสอบใน 2 วินาที...");
  };

  const grouped        = entries.reduce((acc, e) => { if (!acc[e.meal])   acc[e.meal]   = []; acc[e.meal].push(e);   return acc; }, {});
  const groupedByTiming = entries.reduce((acc, e) => { if (!acc[e.timing]) acc[e.timing] = []; acc[e.timing].push(e); return acc; }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <Background>
        <div style={{ maxWidth: "600px", width: "100%", paddingBottom: "80px" }}>
          <div style={{ background: "white", borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden" }}>
            <Header title="บันทึกยาที่ได้รับ" backTo="/menu" />

            <div style={{ padding: "15px" }}>
              <PermissionBanner permission={permission} onRequest={requestPermission} />

              <button onClick={() => setShowModal(true)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "8px", padding: "15px", borderRadius: "18px", border: "2.5px dashed #c4b5fd",
                  background: "white", color: "#7c3aed", fontSize: "16px", fontWeight: 700,
                  cursor: "pointer", marginBottom: "20px" }}>
                <span style={{ fontSize: "20px" }}>＋</span> เพิ่มรายการ
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {TIMING_ORDER.map((t) => (
                  <div key={t} style={{ background: "white", borderRadius: "16px", padding: "14px 10px",
                    textAlign: "center", boxShadow: "0 2px 10px rgba(124,58,237,.1)",
                    border: "1.5px solid #ede9fe", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "18px" }}>{TIMING_EMOJI[t]}</span>
                    <span style={{ fontSize: "22px", fontWeight: 700, color: "#7c3aed", lineHeight: 1 }}>
                      {(groupedByTiming[t] || []).length}
                    </span>
                    <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
              </div>

              {MEAL_ORDER.map((meal) => grouped[meal] ? (
                <div key={meal} style={{ animation: "fadeIn .4s ease" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#7c3aed",
                    marginBottom: "10px", marginTop: "6px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                    {MEAL_ICONS[meal]} {meal}
                  </div>
                  {grouped[meal].map((e) => (
                    <MealCard key={e.id} entry={e}
                      onDelete={() => handleDelete(e.id)}
                      onTest={handleTest}
                      scheduled={notifMap[e.id]} />
                  ))}
                </div>
              ) : null)}

              {entries.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: "60px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>💊</div>
                  <p style={{ color: "#a78bfa", fontWeight: 600 }}>ยังไม่มีรายการ<br />กด + เพื่อเพิ่มรายการ</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {!showModal && <Footer userData={userData} />}
      </Background>

      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}