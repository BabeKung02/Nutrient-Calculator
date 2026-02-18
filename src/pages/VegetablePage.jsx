import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

// ผักที่ไม่ได้ให้พลังงาน - พลังงานต่ำมาก คาร์โบไฮเดรตน้อย
const nonEnergyVegetables = [
  { id: 101, name: "ผักกาดขาว", emoji: "🥬" },
  { id: 102, name: "ผักกาดเขียว", emoji: "🥬" },
  { id: 103, name: "สายบัว", emoji: "🌿" },
  { id: 104, name: "ดอกกะหล่ำ", emoji: "🥦" },
  { id: 105, name: "แตงร้าน", emoji: "🥒" },
  { id: 106, name: "ฟักแฟง", emoji: "🥒" },
  { id: 107, name: "ตั้งโอ๋", emoji: "🥬" },
  { id: 108, name: "ผักกาดสลัด", emoji: "🥗" },
  { id: 109, name: "ผักปวยเล้ง", emoji: "🥬" },
  { id: 110, name: "คื่นช่าย", emoji: "🌿" },
  { id: 111, name: "แตงกวา", emoji: "🥒" },
  { id: 112, name: "บวบ", emoji: "🥒" },
  { id: 113, name: "หยวกกล้วยอ่อน", emoji: "🌿" },
  { id: 114, name: "ผักบุ้ง", emoji: "🥬" },
  { id: 115, name: "ยอดฟักทองอ่อน", emoji: "🌱" },
  { id: 116, name: "มะเขือเทศ", emoji: "🍅" },
  { id: 117, name: "แตงโมอ่อน", emoji: "🥒" },
  { id: 118, name: "พริกหนุ่ม", emoji: "🌶️" },
  { id: 119, name: "ผักแว่น", emoji: "🥬" },
  { id: 120, name: "โหระพา", emoji: "🌿" },
  { id: 121, name: "มะเขือ", emoji: "🍆" },
  { id: 122, name: "ฟักเขียว", emoji: "🥒" },
  { id: 123, name: "พริกหยวก", emoji: "🌶️" },
  { id: 124, name: "กะหล่ำปลี", emoji: "🥬" },
  { id: 125, name: "ขมิ้นขาว", emoji: "🌿" },
  { id: 126, name: "น้ำเต้า", emoji: "🥒" },
];

// ผักที่ให้พลังงาน - โปรตีน 2g, คาร์บ 5g, พลังงาน 25 kcal ต่อ 1 ส่วน
const energyVegetables = [
  { id: 1, name: "ฟักทอง", emoji: "🎃" },
  { id: 2, name: "มะละกอดิบ", emoji: "🥗" },
  { id: 3, name: "ผักคะน้า", emoji: "🥬" },
  { id: 4, name: "บรอกโคลี", emoji: "🥦" },
  { id: 5, name: "ผักหวาน", emoji: "🥬" },
  { id: 6, name: "ถั่วแขก", emoji: "🫘" },
  { id: 7, name: "ยอดแค", emoji: "🌼" },
  { id: 8, name: "ดอกโสน", emoji: "🌸" },
  { id: 9, name: "ผักติ้ว", emoji: "🥬" },
  { id: 10, name: "ใบทองหลาง", emoji: "🌿" },
  { id: 11, name: "ข้าวโพดอ่อน", emoji: "🌽" },
  { id: 12, name: "หน่อไม้ฝรั่ง", emoji: "🎋" },
  { id: 13, name: "มะระจีน", emoji: "🥒" },
  { id: 14, name: "เห็ดเป๋าฮื้อ", emoji: "🍄" },
  { id: 15, name: "หอมหัวใหญ่", emoji: "🧅" },
  { id: 16, name: "ถั่วงอกหัวโต", emoji: "🌱" },
  { id: 17, name: "ถั่วพู", emoji: "🫛" },
  { id: 18, name: "ยอดมะพร้าวอ่อน", emoji: "🌴" },
  { id: 19, name: "ดอกผักกวางตุ้ง", emoji: "🌼" },
  { id: 20, name: "ผักกะเฉด", emoji: "🥬" },
  { id: 21, name: "ใบยอ", emoji: "🌿" },
  { id: 22, name: "ตะเกียงกล้า", emoji: "🥬" },
  { id: 23, name: "มะเขือสวย", emoji: "🍆" },
  { id: 24, name: "เห็ดนางรม", emoji: "🍄" },
  { id: 25, name: "สะตอ", emoji: "🫘" },
  { id: 26, name: "ถั่วลันเตา", emoji: "🫛" },
  { id: 27, name: "หัวผักกาดแดง (บีทรูท)", emoji: "🥕" },
  { id: 28, name: "รากบัว", emoji: "🌿" },
  { id: 29, name: "ยอดกระถิน", emoji: "🌱" },
  { id: 30, name: "พริกหวาน", emoji: "🫑" },
  { id: 31, name: "มะเขือกรอบ", emoji: "🍆" },
  { id: 32, name: "หน่อไม้ปี๊บ", emoji: "🎋" },
  { id: 33, name: "ไผ่ตง", emoji: "🎋" },
  { id: 34, name: "หัวไชเท้า", emoji: "🥕" },
  { id: 35, name: "แครอท", emoji: "🥕" },
  { id: 36, name: "ถั่วฝักยาว", emoji: "🫛" },
];

function VegetablePage() {
  const currentUser = localStorage.getItem("currentUser");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMeal = searchParams.get("mealId") || "breakfast";
  const mealName = searchParams.get("mealName") || "มื้อเช้า";

  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions] = useState({});
  const [currentLogId, setCurrentLogId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const existingLogs = JSON.parse(
      localStorage.getItem(`vegetableLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => {
          const energyItem = energyVegetables.find((vi) => vi.id === item.id);
          if (energyItem) return { ...energyItem, isEnergy: true };

          const nonEnergyItem = nonEnergyVegetables.find(
            (vi) => vi.id === item.id,
          );
          if (nonEnergyItem) return { ...nonEnergyItem, isEnergy: false };

          return null;
        })
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal]);

  const filteredNonEnergy = nonEnergyVegetables.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredEnergy = energyVegetables.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalResults = filteredNonEnergy.length + filteredEnergy.length;

  const handleItemClick = (item, isEnergy) => {
    const itemWithType = { ...item, isEnergy };

    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
      const newPortions = { ...portions };
      delete newPortions[item.id];
      setPortions(newPortions);
    } else {
      setSelectedItems([...selectedItems, itemWithType]);
      setPortions({ ...portions, [item.id]: 1 });
    }
  };

  const updatePortion = (itemId, change) => {
    const currentPortion = portions[itemId] || 1;
    const newPortion = Math.max(0.5, currentPortion + change);
    setPortions({ ...portions, [itemId]: newPortion });
  };

  const calculateTotalCarbs = () => {
    return selectedItems.reduce((total, item) => {
      if (!item.isEnergy) return total;
      const portion = portions[item.id] || 1;
      return total + portion * 5;
    }, 0);
  };

  const calculateTotalProtein = () => {
    return selectedItems.reduce((total, item) => {
      if (!item.isEnergy) return total;
      const portion = portions[item.id] || 1;
      return total + portion * 2;
    }, 0);
  };

  const calculateTotalCalories = () => {
    return selectedItems.reduce((total, item) => {
      if (!item.isEnergy) return total;
      const portion = portions[item.id] || 1;
      return total + portion * 25;
    }, 0);
  };

  const handleSave = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "ไม่ได้เลือกรายการ",
        text: "กรุณาเลือกผักอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const totalProtein = calculateTotalProtein();
    const totalCalories = calculateTotalCalories();
    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`vegetableLogs_${currentUser}`) || "[]",
    );

    let updatedLogs;
    let logId;

    if (currentLogId) {
      logId = currentLogId;
      updatedLogs = existingLogs.map((log) => {
        if (log.id === currentLogId) {
          return {
            ...log,
            time: `${now.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })} น.`,
            timestamp: now.toISOString(),
            totalCarb: totalCarbs,
            totalProtein: totalProtein,
            items: selectedItems.map((item) => ({
              id: item.id,
              name: item.name,
              portion: portions[item.id] || 1,
              isEnergy: item.isEnergy,
            })),
          };
        }
        return log;
      });
    } else {
      logId = Date.now();
      const newLog = {
        id: logId,
        mealId: selectedMeal,
        mealName: mealName,
        date: now.toLocaleDateString("th-TH"),
        time: `${now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        })} น.`,
        timestamp: now.toISOString(),
        totalCarb: totalCarbs,
        totalProtein: totalProtein,
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          portion: portions[item.id] || 1,
          isEnergy: item.isEnergy,
        })),
      };

      updatedLogs = [...existingLogs, newLog];
      setCurrentLogId(logId);
    }

    localStorage.setItem(
      `vegetableLogs_${currentUser}`,
      JSON.stringify(updatedLogs),
    );

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้อออาหาร: <b>${mealName}</b></p>
          <p style="font-size: 1.2rem; color: #667eea; font-weight: bold;">
            ${totalCarbs > 0 ? `คาร์โบไฮเดรตรวม: ${totalCarbs.toFixed(1)} กรัม<br>` : ""}
            ${totalProtein > 0 ? `โปรตีนรวม: ${totalProtein.toFixed(1)} กรัม<br>` : ""}
            ${totalCalories > 0 ? `พลังงานรวม: ${totalCalories.toFixed(0)} กิโลแคลอรี่` : ""}
            ${totalCarbs === 0 && totalProtein === 0 && totalCalories === 0 ? "ผักที่เลือกไม่ได้ให้พลังงาน" : ""}
          </p>
          ${currentLogId ? '<p style="font-size: 0.9rem; color: #718096;">ข้อมูลถูกอัพเดทแล้ว</p>' : ""}
        </div>
      `,
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#667eea",
      background: "#fff",
      borderRadius: "15px",
    });

    navigate(
      `/meal?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`,
    );
  };

  const renderVegetableItem = (item, isEnergy) => {
    const isSelected = selectedItems.find((i) => i.id === item.id);
    const portion = portions[item.id] || 1;

    return (
      <div
        key={item.id}
        style={{
          background: isSelected ? "#f0f4ff" : "white",
          border: isSelected ? "2px solid #667eea" : "2px solid #e2e8f0",
          borderRadius: "12px",
          padding: "12px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Item Header */}
        <div
          onClick={() => handleItemClick(item, isEnergy)}
          style={{
            cursor: "pointer",
            marginBottom: isSelected ? "10px" : "0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                flex: 1,
              }}
            >
              {/* Emoji */}
              {/* <span
                style={{
                  fontSize: "1.6rem",
                  lineHeight: 1,
                  marginTop: "2px",
                }}
              >
                {item.emoji}
              </span> */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    marginBottom: "4px",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#718096",
                    marginBottom: "6px",
                  }}
                >
                  {/* ผักสุก 1 ทัพพี หรือ ผักดิบ 2 ทัพพี (1 ส่วน) */}
                  สุก 1 ทัพพี หรือ ดิบ 2 ทัพพี เท่ากับ 1 ส่วน
                </div>
                {/* Nutrition chips */}
                {isEnergy && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    <span style={chipStyle("#DBEAFE", "#1E40AF")}>
                      โปรตีน 2 g
                    </span>
                    <span style={chipStyle("#FEF3C7", "#92400E")}>
                      คาร์บ 5 g
                    </span>
                    <span style={chipStyle("#FCE7F3", "#9F1239")}>
                      พลังงาน 25 kcal
                    </span>
                  </div>
                )}
                {!isEnergy && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#f59e0b",
                      marginTop: "2px",
                      fontWeight: "500",
                    }}
                  >
                    ไม่ให้พลังงาน
                  </div>
                )}
              </div>
            </div>

            {/* Checkbox */}
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: isSelected ? "2px solid #667eea" : "2px solid #cbd5e0",
                background: isSelected ? "#667eea" : "white",
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

        {/* Portion Control */}
        {isSelected && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
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
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#4a5568",
                }}
              >
                จำนวนส่วน
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => updatePortion(item.id, -0.5)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "2px solid #667eea",
                    background: "white",
                    color: "#667eea",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#667eea",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {portion}
                </span>
                <button
                  onClick={() => updatePortion(item.id, 0.5)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "2px solid #667eea",
                    background: "#667eea",
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Mini summary per item - only for energy vegetables */}
            {isEnergy && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2px 10px",
                  marginTop: "8px",
                  color: "#3b82f6",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                <div style={{ textAlign: "left", fontSize: "inherit" }}>
                  คาร์บ • {(portion * 5).toFixed(1)} g
                </div>
                <div style={{ textAlign: "left", fontSize: "inherit" }}>
                  โปรตีน • {(portion * 2).toFixed(1)} g
                </div>
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "inherit",
                    gridColumn: "1 / -1",
                  }}
                >
                  พลังงาน • {(portion * 25).toFixed(0)} kcal
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
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
            // overflow: "hidden",
          }}
        >
          <Header
            title={`ผัก (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Vegetable Items List */}
          <div style={{ padding: "15px" }}>
            <h3
              style={{
                margin: "0 0 15px 0",
                fontSize: "1rem",
                fontWeight: "600",
                color: "orange",
                textAlign: "center",
              }}
            >
              <u>เลือกรายการผัก</u>
            </h3>

            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ค้นหารายการ..."
            />

            {searchQuery && totalResults === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#9ca3af",
                  fontSize: "0.95rem",
                }}
              >
                ไม่พบผัก "{searchQuery}"
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {filteredNonEnergy.map((item) =>
                renderVegetableItem(item, false),
              )}
              {filteredEnergy.map((item) => renderVegetableItem(item, true))}
            </div>
          </div>

          {/* Save Button */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              padding: "12px 15px 20px 15px",
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))",
              zIndex: 10,
            }}
          >
            <button
              onClick={handleSave}
              disabled={selectedItems.length === 0}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                fontSize: "1.05rem",
                fontWeight: "600",
                color: "white",
                background:
                  selectedItems.length === 0
                    ? "linear-gradient(135deg, #cbd5e0, #a0aec0)"
                    : "linear-gradient(135deg, #667eea, #764ba2)",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  selectedItems.length === 0
                    ? "none"
                    : "0 4px 15px rgba(102,126,234,0.4)",
                transition: "all 0.3s ease",
                opacity: selectedItems.length === 0 ? 0.6 : 1,
              }}
            >
              {selectedItems.length === 0
                ? "กรุณาเลือกรายการ"
                : currentLogId
                  ? `อัพเดทข้อมูล`
                  : `บันทึกข้อมูล`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: chip style
function chipStyle(bg, color) {
  return {
    background: bg,
    color: color,
    borderRadius: "6px",
    padding: "2px 7px",
    fontSize: "0.72rem",
    fontWeight: 600,
  };
}

export default VegetablePage;
