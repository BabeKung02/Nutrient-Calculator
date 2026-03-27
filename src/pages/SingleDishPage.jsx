import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Background from "../components/Background";

const dishItems = [
  {
    id: 1,
    name: "ผัดมะระขึ้นกใส่ไข่",
    calories: 140,
    carbs: 3.9,
    protein: 7.8,
    fat: 10.3,
    sodium: 279,
  },
  {
    id: 2,
    name: "แกงจืดผักกาดขาว เต้าหู้หมูสับ",
    calories: 89,
    carbs: 3.9,
    protein: 7.3,
    fat: 4.9,
    sodium: 276.1,
  },
  {
    id: 3,
    name: "ราดหน้าไก่ผักสามสี",
    calories: 418,
    carbs: 64.4,
    protein: 17.6,
    fat: 10.1,
    sodium: 466.5,
  },
  {
    id: 4,
    name: "แกงใบย่านางสารพัดเห็ด",
    calories: 68,
    carbs: 12.7,
    protein: 3.5,
    fat: 0.4,
    sodium: 384.9,
  },
  {
    id: 5,
    name: "ปลานิลทอด",
    calories: 193,
    carbs: 0.2,
    protein: 16.7,
    fat: 13.1,
    sodium: 87.6,
  },
  {
    id: 6,
    name: "แกงจืดฟักเขียวหมูสับ",
    calories: 63,
    carbs: 8,
    protein: 6.1,
    fat: 0.8,
    sodium: 316.2,
  },
  {
    id: 7,
    name: "ผัดน้ำเต้ากับเห็ดหอม",
    calories: 77,
    carbs: 7.2,
    protein: 1.7,
    fat: 4.7,
    sodium: 194.6,
  },
  {
    id: 8,
    name: "สลัดผักรวมใส่ถั่วแดง",
    calories: 212,
    carbs: 31.3,
    protein: 7.8,
    fat: 6.9,
    sodium: 167.5,
  },
  {
    id: 9,
    name: "ข้าวกล้องราดกะเพราไก่สมุนไพร",
    calories: 415,
    carbs: 54,
    protein: 17.3,
    fat: 14.4,
    sodium: 468.7,
  },
  {
    id: 10,
    name: "แกงจืดสามสหาย",
    calories: 116,
    carbs: 7.2,
    protein: 13.6,
    fat: 3.5,
    sodium: 264.7,
  },
  {
    id: 11,
    name: "ยำปลาทู",
    calories: 102,
    carbs: 6.9,
    protein: 5.9,
    fat: 5.7,
    sodium: 175.3,
  },
  {
    id: 12,
    name: "ผัดผักเบญจรงค์",
    calories: 63,
    carbs: 5.5,
    protein: 1.7,
    fat: 3.8,
    sodium: 306.7,
  },
  {
    id: 13,
    name: "ไข่ตุ๋นสามสี",
    calories: 111,
    carbs: 8,
    protein: 10.8,
    fat: 3.9,
    sodium: 304.4,
  },
  {
    id: 14,
    name: "เซี่ยงไฮ้ผัดฮ่องเต้",
    calories: 426,
    carbs: 69.8,
    protein: 13.4,
    fat: 10.3,
    sodium: 592.1,
  },
  {
    id: 15,
    name: "แกงจืดเต้าหู้สอดไส้เห็ดหอม",
    calories: 61,
    carbs: 4.8,
    protein: 5.5,
    fat: 2.2,
    sodium: 344.2,
  },
  {
    id: 16,
    name: "น้ำพริกปลานิล",
    calories: 92,
    carbs: 8.2,
    protein: 9.8,
    fat: 2,
    sodium: 240.1,
  },
  {
    id: 17,
    name: "ผัดยอดตำลึง",
    calories: 105,
    carbs: 3.3,
    protein: 2.3,
    fat: 9.2,
    sodium: 199.7,
  },
  {
    id: 18,
    name: "ยำไข่ต้มใส่ถั่วแดง",
    calories: 115,
    carbs: 7.4,
    protein: 8.7,
    fat: 5.6,
    sodium: 282.9,
  },
  {
    id: 19,
    name: "แกงกุ้งใส่หัวปลี ชะอม และใบชะพลู",
    calories: 87,
    carbs: 8.9,
    protein: 10.3,
    fat: 0.9,
    sodium: 303.1,
  },
  {
    id: 20,
    name: "ย่ามะระจีนไก่ฉีก",
    calories: 66,
    carbs: 5.5,
    protein: 6.9,
    fat: 1.8,
    sodium: 211.2,
  },
  {
    id: 21,
    name: "แกงหมูเทโพ นมพร่องมันเนย",
    calories: 193,
    carbs: 20.8,
    protein: 11.1,
    fat: 7.3,
    sodium: 297.7,
  },
  {
    id: 22,
    name: "ลาบปลาทับทิม",
    calories: 91,
    carbs: 10.6,
    protein: 9.8,
    fat: 1.1,
    sodium: 213.9,
  },
  {
    id: 23,
    name: "ผัดบวบใส่ไก่",
    calories: 128,
    carbs: 5.3,
    protein: 7.9,
    fat: 7.9,
    sodium: 232.6,
  },
  {
    id: 24,
    name: "เกาเหลาหมู แกงเลียงสมุนไพร ก๋วยเตี๋ยวลุยสวน",
    calories: 114,
    carbs: 4.6,
    protein: 10.4,
    fat: 10.5,
    sodium: 350.3,
  },
  {
    id: 25,
    name: "ก๋วยเตี๋ยวลุยสวน",
    calories: 228,
    carbs: 36.9,
    protein: 9.7,
    fat: 4.7,
    sodium: 543,
  },
  {
    id: 26,
    name: "ยำมะเขือยาว",
    calories: 52,
    carbs: 6.1,
    protein: 5.5,
    fat: 0.8,
    sodium: 309.6,
  },
  {
    id: 27,
    name: "แกงเลียงสมุนไพร",
    calories: 73,
    carbs: 7.9,
    protein: 5.3,
    fat: 2.1,
    sodium: 50.2,
  },
];

function SingleDishPage() {
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
      localStorage.getItem(`dishLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => dishItems.find((di) => di.id === item.id))
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal]);

  const filteredItems = dishItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalResults = filteredItems.length;

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

  const calculateTotalProtein = () => {
    return selectedItems.reduce((total, item) => {
      const portion = portions[item.id] || 1;
      return total + portion * item.protein;
    }, 0);
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
        text: "กรุณาเลือกอาหารอย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalCarbs = calculateTotalCarbs();
    const totalProtein = calculateTotalProtein();
    const totalFat = calculateTotalFat();
    const totalCalories = calculateTotalCalories();

    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`dishLogs_${currentUser}`) || "[]",
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
        totalCarb: totalCarbs,
        totalProtein: totalProtein,
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

    localStorage.setItem(
      `dishLogs_${currentUser}`,
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
            <br>โปรตีนรวม: ${totalProtein.toFixed(1)} กรัม
            <br>ไขมันรวม: ${totalFat.toFixed(1)} กรัม
            <br>พลังงานรวม: ${totalCalories.toFixed(0)} กิโลแคลอรี่
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
    <Background>
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
            title={`อาหาร (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Dish Items List */}
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
              <u>เลือกรายการอาหาร</u>
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
                ไม่พบรายการ "{searchQuery}"
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {filteredItems.map((item) => {
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
                              {/* {item.portion} ({item.servingSize}) */}
                            </div>
                            {/* Nutrition chips */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "4px",
                              }}
                            >
                              <span style={chipStyle("#FEF3C7", "#92400E")}>
                                คาร์บ {item.carbs} g
                              </span>
                              <span style={chipStyle("#DBEAFE", "#1E40AF")}>
                                โปรตีน {item.protein} g
                              </span>
                              <span style={chipStyle("#FED7AA", "#9A3412")}>
                                ไขมัน {item.fat} g
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
                            โปรตีน • {(portion * item.protein).toFixed(1)} g
                          </div>
                          <div
                            style={{ textAlign: "left", fontSize: "inherit" }}
                          >
                            ไขมัน • {(portion * item.fat).toFixed(1)} g
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
    </Background>
  );
}

// Helper: chip style
function chipStyle(bg, color) {
  return {
    background: bg,
    color: color,
    borderRadius: "6px",
    padding: "2px 5px",
    fontSize: "0.7rem",
    fontWeight: 600,
  };
}

export default SingleDishPage;
