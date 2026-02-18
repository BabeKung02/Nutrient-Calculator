import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const FAT_ITEMS = [
  // ไขมันไม่อิ่มตัว (แนะนำ)
  { id: 1,  name: "น้ำมันรำข้าว",      emoji: "🌾", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 2,  name: "น้ำมันมะกอก",       emoji: "🫒", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 3,  name: "น้ำมันถั่วลิสง",    emoji: "🥜", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 4,  name: "อัลมอนด์",          emoji: "🌰", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 5,  name: "งาขาว",             emoji: "⚪", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 6,  name: "น้ำมันถั่วเหลือง",  emoji: "🫘", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 7,  name: "น้ำมันข้าวโพด",     emoji: "🌽", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 8,  name: "น้ำมันดอกทานตะวัน", emoji: "🌻", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  { id: 14, name: "งาดำ",              emoji: "⚫", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: true },
  // ไขมันอิ่มตัว (ควรหลีกเลี่ยง)
  { id: 9,  name: "น้ำมันปาล์ม", emoji: "🌴", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",    fat: 5, calories: 45, recommended: false },
  { id: 10, name: "กะทิ",         emoji: "🥥", portion: "1 ช้อนโต๊ะ เท่ากับ 1 ส่วน", fat: 5, calories: 45, recommended: false },
  { id: 11, name: "เนยสด",        emoji: "🧈", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: false },
  { id: 12, name: "น้ำมันหมู",    emoji: "🥓", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: false },
  { id: 13, name: "น้ำมันไก่",    emoji: "🍗", portion: "1 ช้อนชา เท่ากับ 1 ส่วน",   fat: 5, calories: 45, recommended: false },
];

const PORTION_STEP = 0.5;
const MIN_PORTION = 0.5;

// ─────────────────────────────────────────────
// Helper styles
// ─────────────────────────────────────────────

const chipStyle = (bg, color) => ({
  background: bg,
  color,
  borderRadius: "6px",
  padding: "2px 7px",
  fontSize: "0.72rem",
  fontWeight: 600,
});

const portionBtnStyle = (color, filled = false) => ({
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  border: `2px solid ${color}`,
  background: filled ? color : "white",
  color: filled ? "white" : color,
  fontSize: "1.2rem",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function PortionControl({ portion, onDecrease, onIncrease, color, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#4a5568" }}>
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onDecrease} style={portionBtnStyle(color)}>−</button>
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color, minWidth: "50px", textAlign: "center" }}>
            {portion}
          </span>
          <button onClick={onIncrease} style={portionBtnStyle(color, true)}>+</button>
        </div>
      </div>
    </div>
  );
}

function FatItem({ item, isSelected, portion, onToggle, onDecrease, onIncrease }) {

  const selectedBg  = item.recommended ? "#f0fdf4" : "#fef2f2";
  const selectedBorder = item.recommended ? "#16a34a" : "#dc2626";
  const portionLabel = item.id === 10 ? "จำนวนช้อนโต๊ะ" : "จำนวนช้อนชา";

  return (
    <div
      style={{
        background: isSelected ? selectedBg : "white",
        border: `2px solid ${isSelected ? selectedBorder : "#e2e8f0"}`,
        borderRadius: "12px",
        padding: "12px",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header row */}
      <div onClick={onToggle} style={{ cursor: "pointer", marginBottom: isSelected ? "10px" : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#2d3748", marginBottom: "4px" }}>
              {item.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "6px" }}>
              {item.portion}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              <span style={chipStyle("#FEF9C3", "#92400E")}>ไขมัน {item.fat} g</span>
              <span style={chipStyle("#FCE7F3", "#9F1239")}>พลังงาน {item.calories} kcal</span>
            </div>
          </div>

          {/* Checkbox circle */}
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: `2px solid ${isSelected ? selectedBorder : "#cbd5e0"}`,
              background: isSelected ? selectedBorder : "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "white",
              flexShrink: 0,
            }}
          >
            {isSelected && "✓"}
          </div>
        </div>
      </div>

      {/* Portion control */}
      {isSelected && (
        <>
          <PortionControl
            portion={portion}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            color={selectedBorder}
            label={portionLabel}
          />
          <div style={{ fontSize: "0.75rem", color: selectedBorder, textAlign: "right", fontWeight: "600", marginTop: "6px" }}>
            รวม {(portion * item.fat).toFixed(1)} g ไขมัน • {(portion * item.calories).toFixed(0)} kcal
          </div>
        </>
      )}
    </div>
  );
}

function FatItemGroup({ title, titleColor, items, selectedItems, portions, onToggle, onDecrease, onIncrease }) {
  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      {title && (
        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: titleColor, marginBottom: "10px" }}>
          <u>{title}</u>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item) => {
          const isSelected = !!selectedItems.find((i) => i.id === item.id);
          const portion = portions[item.id] ?? 1;
          return (
            <FatItem
              key={item.id}
              item={item}
              isSelected={isSelected}
              portion={portion}
              onToggle={() => onToggle(item)}
              onDecrease={() => onDecrease(item.id)}
              onIncrease={() => onIncrease(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────

function useFatLog(currentUser, selectedMeal) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions] = useState({});
  const [currentLogId, setCurrentLogId] = useState(null);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem(`fatLogs_${currentUser}`) || "[]");
    const today = new Date().toLocaleDateString("th-TH");
    const todayLog = logs.find((log) => log.mealId === selectedMeal && log.date === today);

    if (!todayLog) return;

    setCurrentLogId(todayLog.id);
    setSelectedItems(todayLog.items.map((i) => FAT_ITEMS.find((fi) => fi.id === i.id)).filter(Boolean));
    setPortions(Object.fromEntries(todayLog.items.map((i) => [i.id, i.portion])));
  }, [currentUser, selectedMeal]);

  const toggleItem = (item) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      setPortions((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    } else {
      setSelectedItems((prev) => [...prev, item]);
      setPortions((prev) => ({ ...prev, [item.id]: 1 }));
    }
  };

  const updatePortion = (itemId, delta) => {
    setPortions((prev) => ({
      ...prev,
      [itemId]: Math.max(MIN_PORTION, (prev[itemId] ?? 1) + delta),
    }));
  };

  const totalFat = selectedItems.reduce((sum, item) => sum + (portions[item.id] ?? 1) * item.fat, 0);
  const totalCalories = selectedItems.reduce((sum, item) => sum + (portions[item.id] ?? 1) * item.calories, 0);

  return { selectedItems, portions, currentLogId, setCurrentLogId, toggleItem, updatePortion, totalFat, totalCalories };
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

function FatPage() {
  const currentUser = localStorage.getItem("currentUser");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMeal = searchParams.get("mealId") || "breakfast";
  const mealName = searchParams.get("mealName") || "มื้อเช้า";

  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedItems, portions, currentLogId, setCurrentLogId,
    toggleItem, updatePortion, totalFat, totalCalories,
  } = useFatLog(currentUser, selectedMeal);

  // Filter by search
  const matchesSearch = (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredItems = FAT_ITEMS.filter(matchesSearch);
  const recommendedItems = filteredItems.filter((i) => i.recommended);
  const saturatedItems   = filteredItems.filter((i) => !i.recommended);

  // Save
  const handleSave = () => {
    if (selectedItems.length === 0) {
      Swal.fire({ icon: "warning", title: "ไม่ได้เลือกรายการ", text: "กรุณาเลือกน้ำมันอย่างน้อย 1 รายการ", confirmButtonColor: "#f6ad55" });
      return;
    }

    const now = new Date();
    const timeStr = `${now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`;
    const dateStr = now.toLocaleDateString("th-TH");
    const itemsPayload = selectedItems.map((item) => ({ id: item.id, name: item.name, portion: portions[item.id] ?? 1 }));

    const existingLogs = JSON.parse(localStorage.getItem(`fatLogs_${currentUser}`) || "[]");
    let updatedLogs;
    let logId;

    if (currentLogId) {
      logId = currentLogId;
      updatedLogs = existingLogs.map((log) =>
        log.id === currentLogId
          ? { ...log, time: timeStr, timestamp: now.toISOString(), totalFat, totalCalories, items: itemsPayload }
          : log,
      );
    } else {
      logId = Date.now();
      updatedLogs = [...existingLogs, {
        id: logId, mealId: selectedMeal, mealName,
        date: dateStr, time: timeStr, timestamp: now.toISOString(),
        totalFat, totalCalories, items: itemsPayload,
      }];
      setCurrentLogId(logId);
    }

    localStorage.setItem(`fatLogs_${currentUser}`, JSON.stringify(updatedLogs));

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้ออาหาร: <b>${mealName}</b></p>
          <p style="font-size:1.2rem;color:#667eea;font-weight:bold;">
            ไขมันรวม: ${totalFat.toFixed(1)} กรัม &nbsp;|&nbsp; พลังงาน: ${totalCalories.toFixed(0)} kcal
          </p>
          ${currentLogId ? '<p style="font-size:0.9rem;color:#718096;">ข้อมูลถูกอัพเดทแล้ว</p>' : ""}
        </div>`,
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#667eea",
    });

    navigate(`/meal?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`);
  };

  const itemGroupProps = { selectedItems, portions, onToggle: toggleItem, onDecrease: (id) => updatePortion(id, -PORTION_STEP), onIncrease: (id) => updatePortion(id, PORTION_STEP) };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", padding: "40px 15px", background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}>
          <Header
            title={`ไขมัน หรือ น้ำมัน (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          <div style={{ padding: "15px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1rem", fontWeight: "600", color: "orange", textAlign: "center" }}>
              <u>เลือกรายการน้ำมัน</u>
            </h3>

            <SearchBox value={searchQuery} onChange={setSearchQuery} placeholder="ค้นหารายการ..." />

            {searchQuery && filteredItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: "0.95rem" }}>
                ไม่พบรายการ "{searchQuery}"
              </div>
            ) : (
              <>
                <FatItemGroup items={recommendedItems} titleColor="#16a34a" {...itemGroupProps} />
                <FatItemGroup title="ควรหลีกเลี่ยง" titleColor="#dc2626" items={saturatedItems} {...itemGroupProps} />
              </>
            )}
          </div>

          {/* Save button */}
          <div style={{ position: "sticky", bottom: 0, padding: "12px 15px 20px", background: "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))", zIndex: 10 }}>
            <button
              onClick={handleSave}
              disabled={selectedItems.length === 0}
              style={{
                width: "100%", padding: "16px", borderRadius: "12px", border: "none",
                fontSize: "1.05rem", fontWeight: "600", color: "white",
                background: selectedItems.length === 0 ? "linear-gradient(135deg, #cbd5e0, #a0aec0)" : "linear-gradient(135deg, #667eea, #764ba2)",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
                boxShadow: selectedItems.length === 0 ? "none" : "0 4px 15px rgba(102,126,234,0.4)",
                opacity: selectedItems.length === 0 ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            >
              {selectedItems.length === 0 ? "กรุณาเลือกรายการ" : currentLogId ? "อัพเดทข้อมูล" : "บันทึกข้อมูล"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FatPage;