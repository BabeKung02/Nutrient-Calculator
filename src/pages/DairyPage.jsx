import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

const dairyItems = [
  {
    id: 1,
    name: "นมสดจืดพร่องมันเนย",
    portion: "1 แก้ว/กล่อง 240 มล.",
    carbs: 12,
    protein: 8,
    fat: 8,
    calories: 150,
    emoji: "🥛",
  },
  {
    id: 2,
    name: "นมพร่องมันเนย",
    portion: "1 แก้ว/กล่อง 240 มล.",
    carbs: 12,
    protein: 8,
    fat: 5,
    calories: 120,
    emoji: "🥛",
  },
];

function DairyPage() {
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
      localStorage.getItem(`dairyLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => dairyItems.find((di) => di.id === item.id))
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal, dairyItems]);

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
      return total + portion * item.carbs;
    }, 0);
  };

  const calculateTotalCalories = () => {
    return selectedItems.reduce((total, item) => {
      const portion = portions[item.id] || 1;
      return total + portion * item.calories;
    }, 0);
  };

  const handleSave = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "ไม่ได้เลือกรายการ",
        text: "กรุณาเลือกนมอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`dairyLogs_${currentUser}`) || "[]",
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
      `dairyLogs_${currentUser}`,
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
            title={`นม (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Dairy Items List */}
          <div style={{ padding: "15px" }}>
            <h3
              style={{
                margin: "0 0 15px 0",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#3b82f6",
                textAlign: "center",
              }}
            >
              <u>เลือกรายการนม</u>
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {dairyItems.map((item) => {
                const isSelected = selectedItems.find((i) => i.id === item.id);
                const portion = portions[item.id] || 1;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: isSelected ? "#eff6ff" : "white",
                      border: isSelected
                        ? "2px solid #3b82f6"
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
                          <span style={{ fontSize: "2rem", lineHeight: 1 }}>
                            {item.emoji}
                          </span>
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
                                fontSize: "0.78rem",
                                color: "#718096",
                                marginBottom: "6px",
                              }}
                            >
                              {item.portion}
                            </div>

                            {/* Nutrition chips */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)", // แบ่งเป็น 2 คอลัมน์ ขนาดเท่ากัน
                                gap: "8px", // ระยะห่างระหว่าง Chip
                                marginTop: "8px",
                              }}
                            >
                              <span style={chipStyle("#dbeafe", "#1d4ed8")}>
                                คาร์บ {item.carbs} ก.
                              </span>
                              <span style={chipStyle("#dcfce7", "#15803d")}>
                                โปรตีน {item.protein} ก.
                              </span>
                              <span style={chipStyle("#fef9c3", "#92400e")}>
                                ไขมัน {item.fat} ก.
                              </span>
                              <span style={chipStyle("#fce7f3", "#9d174d")}>
                                {item.calories} kcal
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            border: isSelected
                              ? "2px solid #3b82f6"
                              : "2px solid #cbd5e0",
                            background: isSelected ? "#3b82f6" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            color: "white",
                            flexShrink: 0,
                            marginLeft: "8px",
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
                        <div>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              color: "#4a5568",
                            }}
                          >
                            จำนวนแก้ว/กล่อง
                          </span>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#3b82f6",
                              fontWeight: 600,
                            }}
                          >
                            รวม {(portion * item.carbs).toFixed(1)} ก. คาร์บ •{" "}
                            {(portion * item.calories).toFixed(0)} kcal
                          </div>
                        </div>
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
                              border: "2px solid #3b82f6",
                              background: "white",
                              color: "#3b82f6",
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
                              color: "#3b82f6",
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
                              border: "2px solid #3b82f6",
                              background: "#3b82f6",
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

          {/* Summary strip (แสดงเมื่อเลือกแล้ว) */}
          {selectedItems.length > 0 && (
            <div style={{ padding: "0 15px 12px 15px" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  border: "1.5px solid #93c5fd",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-around",
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                    คาร์โบไฮเดรต
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#1d4ed8",
                      fontSize: "1rem",
                    }}
                  >
                    {calculateTotalCarbs().toFixed(1)} ก.
                  </div>
                </div>
                <div style={{ width: "1px", background: "#bfdbfe" }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                    แคลอรี่รวม
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#dc2626",
                      fontSize: "1rem",
                    }}
                  >
                    {calculateTotalCalories().toFixed(0)} kcal
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  selectedItems.length === 0
                    ? "none"
                    : "0 4px 15px rgba(59,130,246,0.4)",
                transition: "all 0.3s ease",
                opacity: selectedItems.length === 0 ? 0.6 : 1,
              }}
            >
              {selectedItems.length === 0
                ? "กรุณาเลือกรายการนม"
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

export default DairyPage;
