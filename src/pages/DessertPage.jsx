import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

const dessertItems = [
  {
    id: 1,
    name: "กล้วยแขก",
    portion: "1 ชิ้น (20 กรัม) เท่ากับ 1 ส่วน",
    carbs: 15,
    calories: 60,
  },
  {
    id: 2,
    name: "ขนมกล้วย",
    portion: "1 ชิ้น (50 กรัม) เท่ากับ 1 ส่วน",
    carbs: 21,
    calories: 84,
  },
  {
    id: 3,
    name: "ขนมครก",
    portion: "3 คู่ (90 กรัม) เท่ากับ 1 ส่วน",
    carbs: 45,
    calories: 180,
  },
  {
    id: 4,
    name: "ขนมชั้น",
    portion: "1 ชิ้น เท่ากับ 1 ส่วน",
    carbs: 26,
    calories: 104,
  },
  {
    id: 5,
    name: "ขนมตาล",
    portion: "1 ชิ้น (30 กรัม) เท่ากับ 1 ส่วน",
    carbs: 15,
    calories: 60,
  },
  {
    id: 6,
    name: "ขนมถังแตก",
    portion: "1 ชิ้น เท่ากับ 1 ส่วน",
    carbs: 57,
    calories: 228,
  },
  {
    id: 7,
    name: "ขนมบัวลอยเผือก",
    portion: "1/2 ถ้วยตวง (100 กรัม) เท่ากับ 1 ส่วน",
    carbs: 30,
    calories: 120,
  },
  {
    id: 8,
    name: "ขนมบ้าบิ่น",
    portion: "5 ชิ้น (100 กรัม) เท่ากับ 1 ส่วน",
    carbs: 62,
    calories: 248,
  },
  {
    id: 9,
    name: "ขนมเบื้องครีมไส้เค็ม",
    portion: "6 ชิ้น (30 กรัม) เท่ากับ 1 ส่วน",
    carbs: 21,
    calories: 84,
  },
  {
    id: 10,
    name: "ขนมปากหม้อ",
    portion: "4 ชิ้น (48 กรัม) เท่ากับ 1 ส่วน",
    carbs: 16,
    calories: 64,
  },
  {
    id: 11,
    name: "ขนมลอดช่องน้ำกะทิ",
    portion: "1/2 ถ้วยตวง (100 กรัม) เท่ากับ 1 ส่วน",
    carbs: 24,
    calories: 96,
  },
  {
    id: 12,
    name: "ขนมลูกชุบ",
    portion: "4 ชิ้น (35 กรัม) เท่ากับ 1 ส่วน",
    carbs: 16,
    calories: 64,
  },
  {
    id: 13,
    name: "ขนมสาคูไส้หมู",
    portion: "4 ลูก (48 กรัม) เท่ากับ 1 ส่วน",
    carbs: 16,
    calories: 64,
  },
  {
    id: 14,
    name: "ขนมใส่ไส้",
    portion: "1 ชิ้น (55 กรัม) เท่ากับ 1 ส่วน",
    carbs: 14,
    calories: 56,
  },
  {
    id: 15,
    name: "ข้าวต้มมัดไส้กล้วย",
    portion: "1 กลีบ (70 กรัม) เท่ากับ 1 ส่วน",
    carbs: 31,
    calories: 124,
  },
  {
    id: 16,
    name: "ข้าวเหนียวปิ้งไส้กล้วย",
    portion: "1 ชิ้น (85 กรัม) เท่ากับ 1 ส่วน",
    carbs: 36,
    calories: 144,
  },
  {
    id: 17,
    name: "ข้าวเหนียวมูล",
    portion: "1 ช้อนโต๊ะ (15 กรัม) เท่ากับ 1 ส่วน",
    carbs: 8,
    calories: 32,
  },
  {
    id: 18,
    name: "เฉาก๊วยในน้ำเชื่อม",
    portion: "1 ถุง (160 กรัม) เท่ากับ 1 ส่วน",
    carbs: 60,
    calories: 240,
  },
  {
    id: 19,
    name: "ซ่าหริ่ม",
    portion: "1/2 ถ้วย (100 กรัม) เท่ากับ 1 ส่วน",
    carbs: 29,
    calories: 116,
  },
  {
    id: 20,
    name: "เต้าทึง",
    portion: "1 ถ้วยตวง (200 กรัม) เท่ากับ 1 ส่วน",
    carbs: 45,
    calories: 180,
  },
  {
    id: 21,
    name: "ทองม้วน",
    portion: "4 ชิ้นกลม (14 กรัม) เท่ากับ 1 ส่วน",
    carbs: 12,
    calories: 48,
  },
  {
    id: 22,
    name: "ทุเรียนทอดอบกรอบ",
    portion: "1/2 ถ้วยตวง (30 กรัม) เท่ากับ 1 ส่วน",
    carbs: 18,
    calories: 72,
  },
  {
    id: 23,
    name: "บะจ่าง",
    portion: "1 ชิ้น (180 กรัม) เท่ากับ 1 ส่วน",
    carbs: 59,
    calories: 236,
  },
  {
    id: 24,
    name: "บัวลอยน้ำขิง",
    portion: "1 ถ้วยตวง (200 กรัม) เท่ากับ 1 ส่วน",
    carbs: 40,
    calories: 160,
  },
  {
    id: 25,
    name: "ปาท่องโก๋",
    portion: "1 คู่ (20 กรัม) เท่ากับ 1 ส่วน",
    carbs: 9,
    calories: 36,
  },
];

function DessertPage() {
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
      localStorage.getItem(`dessertLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => dessertItems.find((di) => di.id === item.id))
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal]);

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
        text: "กรุณาเลือกขนมอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const totalCalories = calculateTotalCalories();
    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`dessertLogs_${currentUser}`) || "[]",
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
            totalCalories: totalCalories,
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
        totalCarb: totalCarbs,
        totalCalories: totalCalories,
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
      `dessertLogs_${currentUser}`,
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
            พลังงานรวม: ${totalCalories.toFixed(0)} กิโลแคลอรี่
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
            // overflow: "hidden",
          }}
        >
          <Header
            title={`ขนม (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Dessert Items List */}
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
              <u>เลือกรายการขนม</u>
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {dessertItems.map((item) => {
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
                              {item.portion}
                            </div>
                            {/* Nutrition chips */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                              }}
                            >
                              <span style={chipStyle("#FEF3C7", "#92400E")}>
                                คาร์บ {item.carbs} g
                              </span>
                              <span style={chipStyle("#FCE7F3", "#9F1239")}>
                                พลังงาน {item.calories} kcal
                              </span>
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
                        {/* Mini summary per item */}
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
                          <div
                            style={{ textAlign: "left", fontSize: "inherit" }}
                          >
                            คาร์บ • {(portion * item.carbs).toFixed(1)} g
                          </div>
                          <div
                            style={{ textAlign: "left", fontSize: "inherit" }}
                          >
                            พลังงาน • {(portion * item.carbs * 4).toFixed(0)}{" "}
                            kcal
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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

export default DessertPage;
