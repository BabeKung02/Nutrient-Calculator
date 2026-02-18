import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const FRUIT_ITEMS = [
  // ─── ควรเลือกบริโภค ───────────────────────────────────────────────
  { id: 1,   name: "กล้วยน้ำว้าสุก",  portion: "1 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 2,   name: "กล้วยไข่สุก",     portion: "1 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 3,   name: "กล้วยหอมสุก",     portion: "½ ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 4,   name: "แก้วมังกร",       portion: "½ ผล หรือ 8 ชิ้นคำ เท่ากับ 1 ส่วน",       carbs: 15, calories: 60, category: "green" },
  { id: 5,   name: "ขนุน",            portion: "2 ชิ้น เท่ากับ 1 ส่วน",                    carbs: 15, calories: 60, category: "green" },
  { id: 6,   name: "ชมพู่",           portion: "4 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 7,   name: "เชอรรี่",         portion: "12 ผล เท่ากับ 1 ส่วน",                     carbs: 15, calories: 60, category: "green" },
  { id: 8,   name: "แตงไทย",          portion: "20 ชิ้นคำ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "green" },
  { id: 9,   name: "ฝรั่ง",           portion: "1 ผลเล็ก หรือ ½ ผลกลาง เท่ากับ 1 ส่วน",  carbs: 15, calories: 60, category: "green" },
  { id: 10,  name: "พรุน",            portion: "3 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 11,  name: "พุทรา",           portion: "4 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "green" },
  { id: 12,  name: "สตรอว์เบอรี",     portion: "8-10 ผลเล็ก เท่ากับ 1 ส่วน",              carbs: 15, calories: 60, category: "green" },
  { id: 13,  name: "ส้มเขียวหวาน",    portion: "1 ผลใหญ่ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "green" },
  { id: 14,  name: "ส้มเช้ง",         portion: "1 ผลใหญ่ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "green" },
  { id: 15,  name: "ส้มสายน้ำผึ้ง",   portion: "2 ผลเล็ก เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "green" },
  { id: 16,  name: "ส้มโอ",           portion: "2 ชิ้น เท่ากับ 1 ส่วน",                    carbs: 15, calories: 60, category: "green" },
  { id: 17,  name: "องุ่น",           portion: "20 ผล เท่ากับ 1 ส่วน",                     carbs: 15, calories: 60, category: "green" },
  { id: 18,  name: "แอปเปิ้ล",        portion: "1 ผลเล็ก เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "green" },
  // ─── เลือกบริโภคพอประมาณ ─────────────────────────────────────────
  { id: 101, name: "กีวี",            portion: "1 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 102, name: "แคนตาลูป",        portion: "6-8 ชิ้นคำ เท่ากับ 1 ส่วน",               carbs: 15, calories: 60, category: "orange" },
  { id: 103, name: "เงาะ",            portion: "4 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 104, name: "มะขามหวาน",       portion: "1-2 ฝักใหญ่ เท่ากับ 1 ส่วน",              carbs: 15, calories: 60, category: "orange" },
  { id: 105, name: "มะเดื่ออบแห้ง",   portion: "1 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 106, name: "มะปราง",          portion: "2 ผลกลาง เท่ากับ 1 ส่วน",                  carbs: 15, calories: 60, category: "orange" },
  { id: 107, name: "มะม่วงสุก",       portion: "½ ผลเล็ก เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "orange" },
  { id: 108, name: "มะละกอสุก",       portion: "8 ชิ้นคำ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "orange" },
  { id: 109, name: "มังคุด",          portion: "4 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 110, name: "ลองกอง",          portion: "6 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 111, name: "ลำไย",            portion: "5-6 ผล เท่ากับ 1 ส่วน",                    carbs: 15, calories: 60, category: "orange" },
  { id: 112, name: "ลิ้นจี่",         portion: "5-6 ผล เท่ากับ 1 ส่วน",                    carbs: 15, calories: 60, category: "orange" },
  { id: 113, name: "สละ",             portion: "6 ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "orange" },
  { id: 114, name: "สับปะรดสด",       portion: "8 ชิ้นคำ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "orange" },
  // ─── บริโภคแต่น้อย ────────────────────────────────────────────────
  { id: 201, name: "แตงโม",           portion: "8 ชิ้นคำ เท่ากับ 1 ส่วน",                 carbs: 15, calories: 60, category: "red" },
  { id: 202, name: "ทุเรียน",         portion: "1 เม็ดเล็ก เท่ากับ 1 ส่วน",               carbs: 15, calories: 60, category: "red" },
  { id: 203, name: "น้อยหน่า",        portion: "½ ผล เท่ากับ 1 ส่วน",                      carbs: 15, calories: 60, category: "red" },
];

const CATEGORY_CONFIG = {
  green:  { title: "ควรเลือกบริโภค",        color: "#16a34a", bgColor: "#f0fdf4", borderColor: "#16a34a" },
  orange: { title: "เลือกบริโภคพอประมาณ",   color: "#ea580c", bgColor: "#fff7ed", borderColor: "#fb923c" },
  red:    { title: "บริโภคแต่น้อย",          color: "#dc2626", bgColor: "#fef2f2", borderColor: "#dc2626" },
};

const PORTION_STEP = 0.5;
const MIN_PORTION  = 0.5;

// ─────────────────────────────────────────────
// Helper styles
// ─────────────────────────────────────────────

const chipStyle = (bg, color) => ({
  background: bg, color,
  borderRadius: "6px", padding: "2px 7px",
  fontSize: "0.72rem", fontWeight: 600,
});

const portionBtnStyle = (color, filled = false) => ({
  width: "32px", height: "32px", borderRadius: "8px",
  border: `2px solid ${color}`,
  background: filled ? color : "white",
  color: filled ? "white" : color,
  fontSize: "1.2rem", fontWeight: "700",
  cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center",
});

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function PortionControl({ portion, onDecrease, onIncrease, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#4a5568" }}>จำนวนส่วน</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onDecrease} style={portionBtnStyle(color)}>−</button>
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color, minWidth: "50px", textAlign: "center" }}>{portion}</span>
          <button onClick={onIncrease} style={portionBtnStyle(color, true)}>+</button>
        </div>
      </div>
    </div>
  );
}

function FruitItem({ item, isSelected, portion, onToggle, onDecrease, onIncrease }) {
  const config = CATEGORY_CONFIG[item.category];

  return (
    <div style={{ background: isSelected ? config.bgColor : "white", border: `2px solid ${isSelected ? config.borderColor : "#e2e8f0"}`, borderRadius: "12px", padding: "12px", transition: "all 0.3s ease" }}>
      {/* Header row */}
      <div onClick={onToggle} style={{ cursor: "pointer", marginBottom: isSelected ? "10px" : 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#2d3748", marginBottom: "4px" }}>{item.name}</div>
            <div style={{ fontSize: "0.8rem", color: "#718096", marginBottom: "6px" }}>{item.portion}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              <span style={chipStyle("#FEF3C7", "#92400E")}>คาร์บ {item.carbs} g</span>
              <span style={chipStyle("#FCE7F3", "#9F1239")}>พลังงาน {item.calories} kcal</span>
            </div>
          </div>
          {/* Checkbox circle */}
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${isSelected ? config.borderColor : "#cbd5e0"}`, background: isSelected ? config.borderColor : "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "white", flexShrink: 0 }}>
            {isSelected && "✓"}
          </div>
        </div>
      </div>

      {/* Portion control */}
      {isSelected && (
        <>
          <PortionControl portion={portion} onDecrease={onDecrease} onIncrease={onIncrease} color={config.borderColor} />
          <div style={{ fontSize: "0.75rem", color: config.color, textAlign: "right", fontWeight: "600", marginTop: "6px" }}>
            รวม {(portion * item.carbs).toFixed(1)} g คาร์บ • {(portion * item.calories).toFixed(0)} kcal
          </div>
        </>
      )}
    </div>
  );
}

function FruitItemGroup({ categoryKey, items, selectedItems, portions, onToggle, onDecrease, onIncrease }) {
  if (items.length === 0) return null;
  const config = CATEGORY_CONFIG[categoryKey];

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: "600", color: config.color, marginBottom: "8px" }}>
        <u>{config.title}</u>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item) => (
          <FruitItem
            key={item.id}
            item={item}
            isSelected={!!selectedItems.find((i) => i.id === item.id)}
            portion={portions[item.id] ?? 1}
            onToggle={() => onToggle(item)}
            onDecrease={() => onDecrease(item.id)}
            onIncrease={() => onIncrease(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Custom Hook
// ─────────────────────────────────────────────

function useFruitLog(currentUser, selectedMeal) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions]           = useState({});
  const [currentLogId, setCurrentLogId]   = useState(null);

  useEffect(() => {
    const logs  = JSON.parse(localStorage.getItem(`fruitLogs_${currentUser}`) || "[]");
    const today = new Date().toLocaleDateString("th-TH");
    const todayLog = logs.find((log) => log.mealId === selectedMeal && log.date === today);
    if (!todayLog) return;

    setCurrentLogId(todayLog.id);
    setSelectedItems(todayLog.items.map((i) => FRUIT_ITEMS.find((fi) => fi.id === i.id)).filter(Boolean));
    setPortions(Object.fromEntries(todayLog.items.map((i) => [i.id, i.portion])));
  }, [currentUser, selectedMeal]);

  const toggleItem = (item) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      setPortions((prev) => { const next = { ...prev }; delete next[item.id]; return next; });
    } else {
      setSelectedItems((prev) => [...prev, item]);
      setPortions((prev) => ({ ...prev, [item.id]: 1 }));
    }
  };

  const updatePortion = (itemId, delta) =>
    setPortions((prev) => ({ ...prev, [itemId]: Math.max(MIN_PORTION, (prev[itemId] ?? 1) + delta) }));

  const totalCarbs    = selectedItems.reduce((sum, i) => sum + (portions[i.id] ?? 1) * i.carbs,    0);
  const totalCalories = selectedItems.reduce((sum, i) => sum + (portions[i.id] ?? 1) * i.calories, 0);

  return { selectedItems, portions, currentLogId, setCurrentLogId, toggleItem, updatePortion, totalCarbs, totalCalories };
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

function FruitPage() {
  const currentUser = localStorage.getItem("currentUser");
  const navigate    = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMeal = searchParams.get("mealId")   || "breakfast";
  const mealName     = searchParams.get("mealName") || "มื้อเช้า";

  const [searchQuery, setSearchQuery] = useState("");

  const {
    selectedItems, portions, currentLogId, setCurrentLogId,
    toggleItem, updatePortion, totalCarbs, totalCalories,
  } = useFruitLog(currentUser, selectedMeal);

  // Filter by search then group by category
  const matchesSearch  = (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredItems  = FRUIT_ITEMS.filter(matchesSearch);
  const noResults      = searchQuery && filteredItems.length === 0;

  const groupByCategory = (cat) => filteredItems.filter((i) => i.category === cat);

  // Save
  const handleSave = () => {
    if (selectedItems.length === 0) {
      Swal.fire({ icon: "warning", title: "ไม่ได้เลือกรายการ", text: "กรุณาเลือกผลไม้อย่างน้อย 1 รายการ", confirmButtonColor: "#f6ad55" });
      return;
    }

    const now          = new Date();
    const timeStr      = `${now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`;
    const itemsPayload = selectedItems.map((item) => ({ id: item.id, name: item.name, portion: portions[item.id] ?? 1 }));
    const existingLogs = JSON.parse(localStorage.getItem(`fruitLogs_${currentUser}`) || "[]");

    let updatedLogs;
    let logId;

    if (currentLogId) {
      logId = currentLogId;
      updatedLogs = existingLogs.map((log) =>
        log.id === currentLogId
          ? { ...log, time: timeStr, timestamp: now.toISOString(), totalCarb: totalCarbs, totalCalories, items: itemsPayload }
          : log,
      );
    } else {
      logId = Date.now();
      updatedLogs = [...existingLogs, {
        id: logId, mealId: selectedMeal, mealName,
        date: now.toLocaleDateString("th-TH"), time: timeStr,
        timestamp: now.toISOString(), totalCarb: totalCarbs, totalCalories, items: itemsPayload,
      }];
      setCurrentLogId(logId);
    }

    localStorage.setItem(`fruitLogs_${currentUser}`, JSON.stringify(updatedLogs));

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้ออาหาร: <b>${mealName}</b></p>
          <p style="font-size:1.2rem;color:#667eea;font-weight:bold;">
            คาร์โบไฮเดรตรวม: ${totalCarbs.toFixed(1)} กรัม<br>
            พลังงานรวม: ${totalCalories.toFixed(0)} กิโลแคลอรี่
          </p>
          ${currentLogId ? '<p style="font-size:0.9rem;color:#718096;">ข้อมูลถูกอัพเดทแล้ว</p>' : ""}
        </div>`,
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#667eea",
    });

    navigate(`/meal?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`);
  };

  const groupProps = {
    selectedItems, portions,
    onToggle:    toggleItem,
    onDecrease:  (id) => updatePortion(id, -PORTION_STEP),
    onIncrease:  (id) => updatePortion(id,  PORTION_STEP),
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", padding: "40px 15px", background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}>
          <Header
            title={`ผลไม้ (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          <div style={{ padding: "15px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1rem", fontWeight: "600", color: "orange", textAlign: "center" }}>
              <u>เลือกรายการผลไม้</u>
            </h3>

            <SearchBox value={searchQuery} onChange={setSearchQuery} placeholder="ค้นหารายการ..." />

            {noResults ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: "0.95rem" }}>
                ไม่พบรายการ "{searchQuery}"
              </div>
            ) : (
              <>
                <FruitItemGroup categoryKey="green"  items={groupByCategory("green")}  {...groupProps} />
                <FruitItemGroup categoryKey="orange" items={groupByCategory("orange")} {...groupProps} />
                <FruitItemGroup categoryKey="red"    items={groupByCategory("red")}    {...groupProps} />
              </>
            )}
          </div>

          {/* Save Button */}
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

export default FruitPage;