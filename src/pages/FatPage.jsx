import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

const fatItems = [
  // ไขมันไม่อิ่มตัวตำแหน่งเดียว (ดีต่อสุขภาพ)

  {
    id: 6,
    name: "น้ำมันถั่วเหลือง",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🫘",
    recommended: true,
  },

  {
    id: 1,
    name: "น้ำมันรำข้าว",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🌾",
    recommended: true,
  },
  {
    id: 2,
    name: "น้ำมันมะกอก",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🫒",
    recommended: true,
  },
  {
    id: 3,
    name: "น้ำมันถั่วลิสง",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🥜",
    recommended: true,
  },
  {
    id: 4,
    name: "อัลมอนด์",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🌰",
    recommended: true,
  },
  {
    id: 5,
    name: "งาขาว",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "⚪",
    recommended: true,
  },

  {
    id: 14,
    name: "งาดำ",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "⚫",
    recommended: true,
  },

  // ไขมันไม่อิ่มตัวหลายตำแหน่ง
  {
    id: 7,
    name: "น้ำมันข้าวโพด",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🌽",
    recommended: true,
  },
  {
    id: 8,
    name: "น้ำมันดอกทานตะวัน",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันไม่อิ่มตัวตำแหน่งเดียว",
    emoji: "🌻",
    recommended: true,
  },
  // ไขมันอิ่มตัว (ไม่แนะนำ)
  {
    id: 9,
    name: "น้ำมันปาล์ม",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันอิ่มตัว",
    emoji: "🌴",
    recommended: false,
    notRecommended: true,
  },
  {
    id: 10,
    name: "กะทิ",
    portion: "1 ช้อนโต๊ะ เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันอิ่มตัว",
    emoji: "🥥",
    recommended: false,
    notRecommended: true,
  },
  {
    id: 11,
    name: "เนยสด",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันอิ่มตัว",
    emoji: "🧈",
    recommended: false,
    notRecommended: true,
  },
  {
    id: 12,
    name: "น้ำมันหมู",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันอิ่มตัว",
    emoji: "🥓",
    recommended: false,
    notRecommended: true,
  },
  {
    id: 13,
    name: "น้ำมันไก่",
    portion: "1 ช้อนชา เท่ากับ 1 ส่วน",
    fat: 5,
    calories: 45,
    category: "ไขมันอิ่มตัว",
    emoji: "🍗",
    recommended: false,
    notRecommended: true,
  },
];

function FatPage() {
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
      localStorage.getItem(`fatLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => fatItems.find((fi) => fi.id === item.id))
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

  const calculateTotalFat = () => {
    return selectedItems.reduce((total, item) => {
      const portion = portions[item.id] || 1;
      return total + portion * item.fat;
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
        text: "กรุณาเลือกน้ำมันอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalFat = calculateTotalFat();
    const totalCalories = calculateTotalCalories();
    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`fatLogs_${currentUser}`) || "[]",
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
            totalFat: totalFat,
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
        totalFat: totalFat,
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

    localStorage.setItem(`fatLogs_${currentUser}`, JSON.stringify(updatedLogs));

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
            ไขมันรวม: ${totalFat.toFixed(1)} กรัม
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

  // Group items by category
  const groupedItems = {
    recommended: fatItems.filter((item) => item.recommended),
    polyunsaturated: fatItems.filter(
      (item) => item.category === "ไขมันไม่อิ่มตัวหลายตำแหน่ง",
    ),
    saturated: fatItems.filter((item) => item.notRecommended),
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
            title={`ไขมัน หรือ น้ำมัน (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Fat Items List */}
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
              <u>เลือกรายการน้ำมัน</u>
            </h3>

            {/* Recommended (ไขมันไม่อิ่มตัวตำแหน่งเดียว) */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#16a34a",
                }}
              >
                {/* <span style={{ fontSize: "inherit", color: "inherit" }}>
                  ไขมันไม่อิ่มตัวตำแหน่งเดียว (แนะนำ)
                </span> */}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {groupedItems.recommended.map((item) => {
                  const isSelected = selectedItems.find(
                    (i) => i.id === item.id,
                  );
                  const portion = portions[item.id] || 1;

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isSelected ? "#f0fdf4" : "white",
                        border: isSelected
                          ? "2px solid #16a34a"
                          : "2px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "12px",
                        transition: "all 0.3s ease",
                      }}
                    >
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
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "4px",
                                }}
                              >
                                <span style={chipStyle("#FEF9C3", "#92400E")}>
                                  ไขมัน {item.fat} g
                                </span>
                                <span style={chipStyle("#FCE7F3", "#9F1239")}>
                                  พลังงาน {item.calories} kcal
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              border: isSelected
                                ? "2px solid #16a34a"
                                : "2px solid #cbd5e0",
                              background: isSelected ? "#16a34a" : "white",
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
                                  border: "2px solid #16a34a",
                                  background: "white",
                                  color: "#16a34a",
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
                                  color: "#16a34a",
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
                                  border: "2px solid #16a34a",
                                  background: "#16a34a",
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
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#16a34a",
                              textAlign: "right",
                              fontWeight: "600",
                            }}
                          >
                            รวม {(portion * item.fat).toFixed(1)} g ไขมัน •{" "}
                            {(portion * item.calories).toFixed(0)} kcal
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saturated (ไขมันอิ่มตัว - ไม่แนะนำ) */}
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#dc2626", // สีแดง
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "inherit",
                    color: "inherit",
                    marginBottom: "20px",
                  }}
                >
                  <u>ควรหลีกเลี่ยง</u>
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {groupedItems.saturated.map((item) => {
                  const isSelected = selectedItems.find(
                    (i) => i.id === item.id,
                  );
                  const portion = portions[item.id] || 1;

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isSelected ? "#fef2f2" : "white",
                        border: isSelected
                          ? "2px solid #dc2626"
                          : "2px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "12px",
                        transition: "all 0.3s ease",
                      }}
                    >
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
                                {item.portion}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "4px",
                                }}
                              >
                                <span style={chipStyle("#FEF9C3", "#92400E")}>
                                  ไขมัน {item.fat} g
                                </span>
                                <span style={chipStyle("#FCE7F3", "#9F1239")}>
                                  {item.calories} kcal
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              border: isSelected
                                ? "2px solid #dc2626"
                                : "2px solid #cbd5e0",
                              background: isSelected ? "#dc2626" : "white",
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
                              {item.id === 10 ? "จำนวนช้อนโต๊ะ" : "จำนวนช้อนชา"}
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
                                  border: "2px solid #dc2626",
                                  background: "white",
                                  color: "#dc2626",
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
                                  color: "#dc2626",
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
                                  border: "2px solid #dc2626",
                                  background: "#dc2626",
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
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#dc2626",
                              textAlign: "right",
                              fontWeight: "600",
                            }}
                          >
                            รวม {(portion * item.fat).toFixed(1)} g ไขมัน •{" "}
                            {(portion * item.calories).toFixed(0)} kcal
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

export default FatPage;
