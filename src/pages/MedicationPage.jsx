import { useState, useEffect } from "react";
import Header from "../components/Header";          // ✅ ใช้ Header จริงเหมือนทุกหน้า
import { useNotification } from "../hooks/useNotification";
import Swal from "sweetalert2";

// ── Permission Banner ──────────────────────────────────────────
const PermissionBanner = ({ permission, onRequest }) => {
  if (permission === "granted") return null;
  if (permission === "denied") return (
    <div style={{ ...banner.wrap, background:"#fff1f2", border:"1.5px solid #fecdd3" }}>
      <span>🚫</span>
      <div>
        <div style={banner.title}>การแจ้งเตือนถูกบล็อก</div>
        <div style={banner.sub}>กรุณาเปิดใน Settings ของ Browser</div>
      </div>
    </div>
  );
  return (
    <div style={{ ...banner.wrap, background:"#f5f3ff", border:"1.5px solid #c4b5fd" }}>
      <span>🔔</span>
      <div style={{ flex:1 }}>
        <div style={banner.title}>เปิดการแจ้งเตือน</div>
        <div style={banner.sub}>รับแจ้งเตือนเวลารับประทานยาทุกวัน</div>
      </div>
      <button style={banner.btn} onClick={onRequest}>เปิด</button>
    </div>
  );
};
const banner = {
  wrap: { display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px", borderRadius:"16px", marginBottom:"16px" },
  title: { fontWeight:700, fontSize:"14px", color:"#2d2050", fontFamily:"'Prompt',sans-serif" },
  sub: { fontSize:"12px", color:"#9ca3af", marginTop:"2px", fontFamily:"'Prompt',sans-serif" },
  btn: { padding:"8px 16px", borderRadius:"10px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"none", fontWeight:700, fontSize:"13px", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Prompt',sans-serif" },
};

// ── Pill Selector ──────────────────────────────────────────────
const PillSelector = ({ options, value, onChange }) => (
  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
    {options.map((opt) => (
      <button key={opt.value} onClick={() => onChange(opt.value)}
        style={{ padding:"8px 16px", borderRadius:"30px", border:"2px solid transparent", fontSize:"14px", fontWeight:600, cursor:"pointer", fontFamily:"'Prompt',sans-serif", transition:"all .2s",
          ...(value === opt.value
            ? { background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", border:"2px solid #7c3aed", boxShadow:"0 4px 12px rgba(124,58,237,.35)" }
            : { background:"white", color:"#7c3aed", border:"2px solid #ddd6fe" })
        }}>
        {opt.label}
      </button>
    ))}
  </div>
);

// ── Tag Checkbox ───────────────────────────────────────────────
const TagCheckbox = ({ label, checked, onChange, color, disabled }) => (
  <button onClick={() => !disabled && onChange(!checked)}
    style={{ padding:"9px 18px", borderRadius:"14px", border:`2px solid ${checked ? color.border : "#e2d9f3"}`,
      background:checked ? color.bg : (disabled ? "#f3f4f6" : "white"), 
      color:checked ? color.text : (disabled ? "#d1d5db" : "#9ca3af"),
      fontWeight:600, fontSize:"14px", cursor:disabled ? "not-allowed" : "pointer", fontFamily:"'Prompt',sans-serif",
      transition:"all .2s", boxShadow:checked ? `0 3px 10px ${color.shadow}` : "none",
      opacity: disabled ? 0.5 : 1 }}>
    {checked && "✓ "}{label}
  </button>
);

// ── Notification Badge ─────────────────────────────────────────
const NotifBadge = ({ scheduled }) => {
  if (!scheduled) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"6px",
      background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"8px",
      padding:"5px 10px", width:"fit-content" }}>
      <span style={{ fontSize:"12px" }}>🔔</span>
      <span style={{ fontSize:"11px", color:"#16a34a", fontWeight:600, fontFamily:"'Prompt',sans-serif" }}>
        แจ้งเตือน {scheduled.fireAt}
      </span>
    </div>
  );
};

// ── Meal Card ──────────────────────────────────────────────────
const MealCard = ({ entry, onDelete, onTest, scheduled }) => {
  const timingColors = {
    หลังอาหาร: { bg:"#f0fdf4", text:"#16a34a", border:"#bbf7d0" },
    ก่อนอาหาร: { bg:"#fef9c3", text:"#a16207", border:"#fde047" },
    ก่อนนอน:  { bg:"#f5f3ff", text:"#7c3aed", border:"#ddd6fe" },
  };
  const c = timingColors[entry.timing] || timingColors["หลังอาหาร"];
  const mealIcons = { เช้า:"🌅", เที่ยง:"☀️", เย็น:"🌆", ก่อนนอน:"🌙" };
  return (
    <div style={{ background:"white", borderRadius:"16px", padding:"14px 16px",
      boxShadow:"0 2px 12px rgba(124,58,237,.1)", border:"1.5px solid #ede9fe", marginBottom:"10px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ fontSize:"24px" }}>{mealIcons[entry.meal] || "🍽️"}</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:"#2d2050", fontSize:"15px", fontFamily:"'Prompt',sans-serif" }}>{entry.name}</div>
          <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"2px", fontFamily:"'Prompt',sans-serif" }}>{entry.freq} • {entry.meal}</div>
          <NotifBadge scheduled={scheduled} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"6px" }}>
          <span style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:600, whiteSpace:"nowrap",
            background:c.bg, color:c.text, border:`1.5px solid ${c.border}` }}>
            {entry.timing}
          </span>
          <div style={{ display:"flex", gap:"6px" }}>
            <button onClick={() => onTest(entry)} title="ทดสอบแจ้งเตือน"
              style={{ background:"#fef9c3", border:"none", borderRadius:"10px", width:28, height:28,
                cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>
              🔔
            </button>
            <button onClick={onDelete}
              style={{ background:"#fef2f2", border:"none", borderRadius:"10px", width:28, height:28,
                cursor:"pointer", color:"#ef4444", fontSize:"13px", fontWeight:700 }}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Toast ──────────────────────────────────────────────────────
const Toast = ({ msg, visible }) => (
  <div style={{ position:"fixed", bottom:90, left:"50%", transform:`translateX(-50%) translateY(${visible ? 0 : "20px"})`,
    opacity:visible ? 1 : 0, transition:"all .3s ease", background:"#2d2050", color:"white",
    padding:"12px 20px", borderRadius:"14px", fontSize:"14px", fontWeight:600,
    boxShadow:"0 6px 20px rgba(0,0,0,.2)", zIndex:200, whiteSpace:"nowrap",
    fontFamily:"'Prompt',sans-serif", pointerEvents:"none" }}>
    {msg}
  </div>
);

// ── Add Modal ──────────────────────────────────────────────────
const AddModal = ({ onClose, onAdd }) => {
  const [name, setName]   = useState("");
  const [freq, setFreq]   = useState(1);
  const [meals, setMeals] = useState({ เช้า:false, เที่ยง:false, เย็น:false, ก่อนนอน:false });
  const [timing, setTiming] = useState("หลังอาหาร");

  // Reset meals เมื่อเปลี่ยน freq
  useEffect(() => {
    setMeals({ เช้า:false, เที่ยง:false, เย็น:false, ก่อนนอน:false });
  }, [freq]);

  // ⭐ Set timing เป็น "ก่อนนอน" เฉพาะเมื่อเลือกเฉพาะมื้อก่อนนอนเท่านั้น
  useEffect(() => {
    const hasNonBedtimeMeal = meals.เช้า || meals.เที่ยง || meals.เย็น;
    const hasOnlyBedtime = meals.ก่อนนอน && !hasNonBedtimeMeal;
    
    if (hasOnlyBedtime) {
      setTiming("ก่อนนอน");
    } else if (timing === "ก่อนนอน" && hasNonBedtimeMeal) {
      // ถ้าเคย set เป็น "ก่อนนอน" แต่ตอนนี้มีมื้ออื่นด้วย ให้ reset
      setTiming("หลังอาหาร");
    }
  }, [meals,timing]);

  const medicineOptions = [
    "Glipizide",
    "Metformin",
    "Pioglitazone",
    "Empagliflozin",
    "Sitagliptin",
    "Semaglutide",
  ];

  const mealOptions = [
    { label:"เช้า",     color:{ bg:"#fff7ed", text:"#ea580c", border:"#fdba74", shadow:"rgba(234,88,12,.2)" } },
    { label:"เที่ยง",   color:{ bg:"#fefce8", text:"#ca8a04", border:"#fde047", shadow:"rgba(202,138,4,.2)" } },
    { label:"เย็น",     color:{ bg:"#eff6ff", text:"#2563eb", border:"#93c5fd", shadow:"rgba(37,99,235,.2)" } },
    { label:"ก่อนนอน", color:{ bg:"#f5f3ff", text:"#7c3aed", border:"#c4b5fd", shadow:"rgba(124,58,237,.2)" } },
  ];

  // นับจำนวนมื้อที่เลือกแล้ว
  const selectedMealsCount = Object.values(meals).filter(Boolean).length;

  // จัดการการเลือกมื้ออาหาร (จำกัดตามจำนวน freq)
  const handleMealToggle = (label, currentValue) => {
    if (currentValue) {
      // ถ้ากำลัง uncheck → อนุญาตเสมอ
      setMeals((p) => ({ ...p, [label]: false }));
    } else {
      // ถ้ากำลัง check → ตรวจสอบว่าเกิน freq หรือไม่
      if (selectedMealsCount < freq) {
        setMeals((p) => ({ ...p, [label]: true }));
      }
    }
  };

  const handleAdd = () => {
    const selected = Object.entries(meals).filter(([,v]) => v).map(([k]) => k);
    
    // Validation 1: ตรวจสอบว่ากรอกยาหรือยัง
    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกยา",
        text: "กรุณาเลือกยาที่ต้องการเพิ่ม",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    // Validation 2: ตรวจสอบว่าเลือกมื้ออาหารครบหรือยัง
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกมื้อ",
        text: "กรุณาเลือกมื้ออาหารอย่างน้อย 1 มื้อ",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    // Validation 3: ตรวจสอบว่าเลือกมื้อตรงกับจำนวน freq หรือไม่
    if (selected.length !== freq) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกช่วงเวลาให้ครบถ้วน",
        text: `คุณเลือกรับประทาน ${freq} เวลา กรุณาเลือกช่วงเวลา ${freq} มื้อ (ตอนนี้เลือกไว้ ${selected.length} มื้อ)`,
        confirmButtonColor: "#7c3aed",
      });
      return;
    }
    
    // สร้าง array ของ entries ทั้งหมด
    const entriesToAdd = selected.map((m) => ({
      name,
      freq: `${freq} เวลา`,
      meal: m,
      timing
    }));
    
    // ส่งกลับเป็น array เดียว
    onAdd(entriesToAdd);
    onClose();
  };

  const lbl = { display:"block", fontSize:"13px", fontWeight:600, color:"#7c3aed", marginBottom:"8px",
    fontFamily:"'Prompt',sans-serif", textTransform:"uppercase", letterSpacing:".05em" };
  const selectStyle = { 
    width:"100%", 
    padding:"12px 16px", 
    borderRadius:"14px", 
    border:"2px solid #ede9fe",
    fontSize:"15px", 
    fontFamily:"'Prompt',sans-serif", 
    outline:"none", 
    marginBottom:"16px",
    boxSizing:"border-box", 
    color:"#2d2050",
    background:"white",
    cursor:"pointer"
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
      alignItems:"flex-end", justifyContent:"center", zIndex:100 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width:"100%", maxWidth:"480px", background:"white", borderRadius:"28px 28px 0 0",
        padding:"20px 24px 36px", boxShadow:"0 -8px 40px rgba(0,0,0,.2)", animation:"slideUp .3s ease" }}>
        <div style={{ width:48, height:5, borderRadius:99, background:"#e2d9f3", margin:"0 auto 18px" }} />
        <h3 style={{ fontSize:"20px", fontWeight:700, color:"#2d2050", marginBottom:"20px", fontFamily:"'Prompt',sans-serif" }}>
          เพิ่มรายการใหม่
        </h3>

        <label style={lbl}>เลือกยา</label>
        <select 
          style={selectStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          <option value="">-- เลือกยา --</option>
          {medicineOptions.map((med) => (
            <option key={med} value={med}>{med}</option>
          ))}
        </select>

        <label style={lbl}>วิธีรับประทาน</label>
        <PillSelector options={[{label:"1 เวลา",value:1},{label:"2 เวลา",value:2},{label:"3 เวลา",value:3}]}
          value={freq} onChange={setFreq} />

        <label style={{ ...lbl, marginTop:"16px" }}>มื้อ อาหาร (เลือก {freq} มื้อ)</label>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {mealOptions.map(({ label, color }) => {
            const isChecked = meals[label];
            const isDisabled = !isChecked && selectedMealsCount >= freq;
            
            return (
              <TagCheckbox 
                key={label} 
                label={label} 
                checked={isChecked}
                onChange={() => handleMealToggle(label, isChecked)} 
                color={color}
                disabled={isDisabled}
              />
            );
          })}
        </div>
        
        {/* แสดงจำนวนที่เลือก */}
        <div style={{ marginTop:"8px", fontSize:"12px", color:"#7c3aed", fontWeight:600 }}>
          เลือกแล้ว {selectedMealsCount}/{freq} มื้อ
        </div>

        {/* ตรวจสอบว่ามีมื้ออื่นนอกจากก่อนนอนหรือไม่ */}
        {(() => {
          const hasNonBedtimeMeal = meals.เช้า || meals.เที่ยง || meals.เย็น;
          
          return (
            <>
              {/* แสดงเวลารับประทานเมื่อมีมื้ออื่นนอกจากก่อนนอน */}
              {hasNonBedtimeMeal && (
                <>
                  <label style={{ ...lbl, marginTop:"16px" }}>
                    เวลารับประทาน
                  </label>
                  <PillSelector
                    options={[{label:"หลังอาหาร",value:"หลังอาหาร"},{label:"ก่อนอาหาร",value:"ก่อนอาหาร"}]}
                    value={timing} onChange={setTiming} />
                </>
              )}
            </>
          );
        })()}

        <div style={{ background:"#f5f3ff", borderRadius:"12px", padding:"10px 14px", marginTop:"16px" }}>
          <span style={{ fontSize:"12px", color:"#7c3aed", fontWeight:600, fontFamily:"'Prompt',sans-serif" }}>
            🔔 ระบบจะแจ้งเตือนตามมื้อที่เลือกโดยอัตโนมัติ
          </span>
        </div>

        <button style={{ width:"100%", marginTop:"18px", padding:"16px", borderRadius:"16px", border:"none",
          fontSize:"16px", fontWeight:700, color:"white", background:"linear-gradient(135deg,#7c3aed,#a855f7)",
          cursor:"pointer", boxShadow:"0 6px 20px rgba(124,58,237,.4)", fontFamily:"'Prompt',sans-serif" }}
          onClick={handleAdd}>
          บันทึก + ตั้งการแจ้งเตือน
        </button>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────
export default function MedicationPage() {
  const currentUser = localStorage.getItem("currentUser");
  
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState({ msg:"", visible:false });
  const [notifMap, setNotifMap]   = useState({});

  const { permission, scheduleNotification, requestPermission, testNotification } = useNotification();

  // ⭐ Load entries AND notifMap from localStorage on mount
  useEffect(() => {
    // Load medication entries
    const savedEntries = localStorage.getItem(`medication_${currentUser}`);
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed);
      } catch (e) {
        console.error("Error loading medication data:", e);
      }
    }

    // Load notification map
    const savedNotifMap = localStorage.getItem(`medicationNotifs_${currentUser}`);
    if (savedNotifMap) {
      try {
        const parsed = JSON.parse(savedNotifMap);
        setNotifMap(parsed);
      } catch (e) {
        console.error("Error loading notification map:", e);
      }
    }
  }, [currentUser]);

  // ⭐ Save entries to localStorage whenever they change
  const saveToLocalStorage = (newEntries) => {
    localStorage.setItem(`medication_${currentUser}`, JSON.stringify(newEntries));
  };

  // ⭐ Save notifMap to localStorage whenever it changes
  const saveNotifMapToLocalStorage = (newNotifMap) => {
    localStorage.setItem(`medicationNotifs_${currentUser}`, JSON.stringify(newNotifMap));
  };

  const showToast = (msg) => {
    setToast({ msg, visible:true });
    setTimeout(() => setToast((p) => ({ ...p, visible:false })), 2800);
  };

  const handleAdd = async (entriesToAdd) => {
    // รองรับทั้ง single entry และ array of entries
    const newEntries = Array.isArray(entriesToAdd) ? entriesToAdd : [entriesToAdd];
    
    // สร้าง entries พร้อม id
    const entriesWithIds = newEntries.map(entry => ({
      ...entry,
      id: Date.now() + Math.random()
    }));
    
    // เพิ่ม entries ทั้งหมดพร้อมกัน
    const updatedEntries = [...entries, ...entriesWithIds];
    setEntries(updatedEntries);
    saveToLocalStorage(updatedEntries); // ⭐ Save entries
    
    // ตั้งการแจ้งเตือนสำหรับแต่ละ entry
    const newNotifMap = { ...notifMap };
    const successMessages = [];
    
    for (const newEntry of entriesWithIds) {
      const record = await scheduleNotification(newEntry);
      if (record) {
        newNotifMap[newEntry.id] = record;
        successMessages.push(`${newEntry.meal} เวลา ${record.fireAt}`);
      }
    }
    
    setNotifMap(newNotifMap);
    saveNotifMapToLocalStorage(newNotifMap); // ⭐ Save notifMap
    
    // แสดง toast สรุป
    if (successMessages.length > 0) {
      if (successMessages.length === 1) {
        showToast(`✅ ตั้งแจ้งเตือน ${successMessages[0]}`);
      } else {
        showToast(`✅ ตั้งแจ้งเตือน ${successMessages.length} มื้อสำเร็จ`);
      }
    }
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter((e) => e.id !== id);
    
    setEntries(updatedEntries);
    saveToLocalStorage(updatedEntries); // ⭐ Save entries
    
    const newNotifMap = { ...notifMap };
    delete newNotifMap[id];
    setNotifMap(newNotifMap);
    saveNotifMapToLocalStorage(newNotifMap); // ⭐ Save notifMap
  };

  const handleTest = async (entry) => {
    await testNotification(entry);
    showToast("🔔 ส่งแจ้งเตือนทดสอบใน 2 วินาที...");
  };

  const grouped = entries.reduce((acc, e) => {
    if (!acc[e.timing]) acc[e.timing] = [];
    acc[e.timing].push(e);
    return acc;
  }, {});

  const timingOrder = ["หลังอาหาร", "ก่อนอาหาร", "ก่อนนอน"];
  const timingEmoji = { หลังอาหาร:"🍽️", ก่อนอาหาร:"⏰", ก่อนนอน:"🌙" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap');
        @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#f0ebff; }
      `}</style>

      <div
        style={{
          width: "100vw",
          minHeight: "100vh",
          padding: "40px 15px",
          background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {/* ✅ Header จริง เหมือนทุกหน้า */}
            <Header title="บันทึกยาที่ได้รับ" backTo="/menu" />

            <div style={{ padding: "15px" }}>
              <PermissionBanner permission={permission} onRequest={requestPermission} />

              {/* Add Button */}
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "15px",
                  borderRadius: "18px",
                  border: "2.5px dashed #c4b5fd",
                  background: "white",
                  color: "#7c3aed",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: "20px",
                  fontFamily: "'Prompt',sans-serif",
                }}
                onClick={() => setShowModal(true)}
              >
                <span style={{ fontSize: "20px" }}>＋</span> เพิ่มรายการ
              </button>

              {/* Summary chips */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"20px" }}>
                {timingOrder.map((t) => (
                  <div key={t} style={{ background:"white", borderRadius:"16px", padding:"14px 10px",
                    textAlign:"center", boxShadow:"0 2px 10px rgba(124,58,237,.1)", border:"1.5px solid #ede9fe",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                    <span style={{ fontSize:"18px" }}>{timingEmoji[t]}</span>
                    <span style={{ fontSize:"22px", fontWeight:700, color:"#7c3aed", lineHeight:1 }}>
                      {(grouped[t] || []).length}
                    </span>
                    <span style={{ fontSize:"11px", color:"#9ca3af", fontWeight:600 }}>{t}</span>
                  </div>
                ))}
              </div>

              {/* Grouped list */}
              {timingOrder.map((timing) =>
                grouped[timing] ? (
                  <div key={timing} style={{ animation:"fadeIn .4s ease" }}>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#7c3aed", marginBottom:"10px",
                      marginTop:"6px", textTransform:"uppercase", letterSpacing:".06em" }}>
                      {timingEmoji[timing]} {timing}
                    </div>
                    {grouped[timing].map((e) => (
                      <MealCard key={e.id} entry={e}
                        onDelete={() => handleDelete(e.id)}
                        onTest={handleTest}
                        scheduled={notifMap[e.id]} />
                    ))}
                  </div>
                ) : null
              )}

              {entries.length === 0 && (
                <div style={{ textAlign:"center", paddingTop:"60px" }}>
                  <div style={{ fontSize:"48px", marginBottom:"12px" }}>💊</div>
                  <p style={{ color:"#a78bfa", fontWeight:600, fontFamily:"'Prompt',sans-serif" }}>
                    ยังไม่มีรายการ<br />กด + เพื่อเพิ่มรายการ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}