import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

const fruitItems = [
  { id: 1, name: "กล้วยน้ำว้า", portion: "1 ผล" },
  { id: 2, name: "กล้วยหอม", portion: "1/2 ผล" },
  { id: 3, name: "กีวี", portion: "1 ผล" },
  { id: 4, name: "แก้วมังกร", portion: "1/2 ผลกลาง หรือ 8 ชิ้นคำ" },
  { id: 5, name: "ขนุน", portion: "3 ยวง" },
  { id: 6, name: "แคนตาลูป", portion: "8 ชิ้นคำ" },
  { id: 7, name: "เงาะ", portion: "4 ผล" },
  { id: 8, name: "ชมพู่เมืองเพชร", portion: "3 ผลกลาง" },
  { id: 9, name: "แตงโม", portion: "8 ชิ้นคำ" },
  { id: 10, name: "แตงไทย", portion: "20 ชิ้นคำ" },
  { id: 11, name: "ฝรั่ง", portion: "1 ผลเล็ก หรือ 1/2 ผลกลาง" },
  { id: 12, name: "มะม่วงสุก", portion: "1/2 ผล" },
  { id: 13, name: "มะละกอสุก", portion: "8 ชิ้นคำ" },
  { id: 14, name: "มังคุด", portion: "4 ผล" },
  { id: 15, name: "ลำไย", portion: "5-6 ผล" },
  { id: 16, name: "ส้มเขียวหวาน", portion: "2 ผลกลาง" },
  { id: 17, name: "แอปเปิ้ล", portion: "1 ผลเล็ก" },
];

function FruitPage() {
  const currentUser = localStorage.getItem("currentUser");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMeal = searchParams.get("mealId") || "breakfast";
  const mealName = searchParams.get("mealName") || "มื้อเช้า";

  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions] = useState({});
  const [currentLogId, setCurrentLogId] = useState(null);

  useEffect(() => {
    const existingLogs = JSON.parse(
      localStorage.getItem(`fruitLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => fruitItems.find((fi) => fi.id === item.id))
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal, fruitItems]);

  const handleItemClick = (item) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
      const newPortions = { ...portions };
      delete newPortions[item.id];
      setPortions(newPortions);
    } else {
      setSelectedItems([...selectedItems, item]);
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
      const portion = portions[item.id] || 1;
      return total + portion * 15;
    }, 0);
  };

  const handleSave = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "ไม่ได้เลือกรายการ",
        text: "กรุณาเลือกผลไม้อย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`fruitLogs_${currentUser}`) || "[]",
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
            totalCarbs: totalCarbs,
            items: selectedItems.map((item) => ({
              id: item.id,
              name: item.name,
              portion: portions[item.id] || 1,
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
        totalCarbs: totalCarbs,
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          portion: portions[item.id] || 1,
        })),
      };

      updatedLogs = [...existingLogs, newLog];
      setCurrentLogId(logId);
    }

    localStorage.setItem(
      `fruitLogs_${currentUser}`,
      JSON.stringify(updatedLogs),
    );

    console.log(
      "Saved to LocalStorage:",
      updatedLogs.find((log) => log.id === logId),
    );

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้ออาหาร: <b>${mealName}</b></p>
          <p style="font-size: 1.2rem; color: #667eea; font-weight: bold;">
            คาร์โบไฮเดรตรวม: ${totalCarbs.toFixed(1)} กรัม
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

  const fruitEmoji = {
    1: "🍌",
    2: "🍌",
    3: "🥝",
    4: "🐉",
    5: "🍈",
    6: "🍈",
    7: "🍒",
    8: "🍑",
    9: "🍉",
    10: "🍈",
    11: "🍏",
    12: "🥭",
    13: "🍈",
    14: "🟤",
    15: "🍇",
    16: "🍊",
    17: "🍎",
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
            overflow: "hidden",
          }}
        >
          <Header
            title={`ผลไม้ (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Food Items List */}
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
              <u>เลือกรายการผลไม้</u>
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {fruitItems.map((item) => {
                const isSelected = selectedItems.find((i) => i.id === item.id);
                const portion = portions[item.id] || 1;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: isSelected ? "#f0f4ff" : "white",
                      border: isSelected
                        ? "2px solid #667eea"
                        : "2px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Item Header */}
                    <div
                      onClick={() => handleItemClick(item)}
                      style={{
                        cursor: "pointer",
                        marginBottom: isSelected ? "10px" : "0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                          }}
                        >
                          {/* Emoji */}
                          <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                            {fruitEmoji[item.id] || "🍑"}
                          </span>
                          <div>
                            <div
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginBottom: "3px",
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{ fontSize: "0.8rem", color: "#718096" }}
                            >
                              {item.portion} = 15 กรัม
                            </div>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: isSelected
                              ? "2px solid #667eea"
                              : "2px solid #cbd5e0",
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
                          จำนวนหน่วยบริโภค
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ padding: "0 15px 20px 15px" }}>
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
                ? "กรุณาเลือกผลไม้"
                : currentLogId
                  ? `อัพเดทข้อมูล (${calculateTotalCarbs().toFixed(1)} กรัม)`
                  : `บันทึกข้อมูล (${calculateTotalCarbs().toFixed(1)} กรัม)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FruitPage;
