import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

const riceFlourItems = [
  {
    id: 1,
    name: "เกาลัด",
    portion: "5 เมล็ดเล็ก เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 2,
    name: "ขนมจีน",
    portion: "1 จับ เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 3,
    name: "ขนมปังขาว",
    portion: "1 แผ่น เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 4,
    name: "ขนมปังแฮมเบอร์เกอร์ ฮอทดอก",
    portion: "½ คู่ เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 5,
    name: "ขนมปังโฮลวีท",
    portion: "1 แผ่น เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 6,
    name: "ข้าวต้ม หรือ โจ๊ก",
    portion: "2 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 7,
    name: "ข้าวโพด (สุก)",
    portion: "½ ฝักกลาง เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 8,
    name: "ข้าวสวย, ข้าวซ้อมมือ",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 9,
    name: "ข้าวเหนียว",
    portion: "½ ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 10,
    name: "ข้าวโอ๊ต",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 11,
    name: "แครกเกอร์สี่เหลี่ยม",
    portion: "3 แผ่น เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 12,
    name: "ถั่วแดงสุก",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 13,
    name: "ถั่วเมล็ดแห้ง",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 14,
    name: "บะหมี่กึ่งสำเร็จรูป",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 15,
    name: "บะหมี่ญี่ปุ่น (อุด้ง)",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 16,
    name: "แป้งเกี๊ยว",
    portion: "4 แผ่น เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 17,
    name: "เผือก ต้ม",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 18,
    name: "มันเทศ ต้ม",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 19,
    name: "พาสต้า",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 20,
    name: "ฟักทองสุก",
    portion: "2 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 21,
    name: "มักกะโรนี",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 22,
    name: "สปาเก็ตตี้ ลวก",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 23,
    name: "มันแกว",
    portion: "4 หัวเล็ก เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 24,
    name: "มันฝรั่งบด",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 25,
    name: "ลูกเดือยสุก",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 26,
    name: "วุ้นเส้นสุก",
    portion: "2 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 27,
    name: "เส้นก๋วยจั๊บญวณ",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 28,
    name: "เส้นก๋วยจั๊บสุก",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 29,
    name: "เส้นก๋วยเตี๋ยวสุก",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 30,
    name: "เส้นหมี่ขาว",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
  {
    id: 31,
    name: "เส้นใหญ่ (ลวก)",
    portion: "1 ทัพพี เท่ากับ 1 ส่วน",
    carbs: 18,
    protein: 2,
    fat: 0,
    calories: 80,
  },
];

function RiceFlourPage() {
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
      localStorage.getItem(`riceLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => riceFlourItems.find((rfi) => rfi.id === item.id))
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

  const calculateTotalProteins = () => {
    return selectedItems.reduce((total, item) => {
      const portion = portions[item.id] || 1;
      return total + portion * item.protein;
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
        text: "กรุณาเลือกอาหารอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const totalProteins = calculateTotalProteins();
    const totalCalories = calculateTotalCalories();

    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`riceLogs_${currentUser}`) || "[]",
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
            totalProtein: totalProteins,
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
        totalProtein: totalProteins,
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
      `riceLogs_${currentUser}`,
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
            คาร์โบไฮเดรตรวม: ${calculateTotalCarbs().toFixed(1)} กรัม
            <br>โปรตีนรวม: ${calculateTotalProteins().toFixed(1)} กรัม
            <br>พลังงานรวม: ${calculateTotalCalories().toFixed(0)} กิโลแคลอรี่
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
            title={`ข้าว - แป้ง (${mealName})`}
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
              <u>เลือกรายการข้าว - แป้ง</u>
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {riceFlourItems.map((item) => {
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
                          {/* Emoji */}
                          <span
                            style={{
                              fontSize: "1.6rem",
                              lineHeight: 1,
                              marginTop: "2px",
                            }}
                          >
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
                              <span style={chipStyle("#DBEAFE", "#1E40AF")}>
                                โปรตีน {item.protein} g
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
                            // ใส่หน่วย px ให้ชัดเจน และใช้ค่าที่ครอบคลุม
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
                            โปรตีน • {(portion * item.protein).toFixed(1)} g
                          </div>
                          <div
                            style={{ textAlign: "left", fontSize: "inherit" }}
                          >
                            พลังงาน • {(portion * item.calories).toFixed(0)}{" "}
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
                ? "กรุณาเลือกรายการอาหาร"
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

export default RiceFlourPage;
