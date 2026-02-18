import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

const meatItems = [
  // ─── เนื้อสัตว์ไขมันต่ำมาก (โปรตีน 7g, ไขมัน 1g, พลังงาน 35 kcal) ───
  {
    id: 1,
    name: "หอยแครง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 5,
    name: "กุ้งตัวกลาง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 9,
    name: "สันในไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 13,
    name: "ปลาทู",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 17,
    name: "ไข่ขาว",
    portion: "2 ฟอง เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 21,
    name: "ปลาช่อน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 25,
    name: "ปลาอื่นๆ",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 26,
    name: "ทรีย์เป็ดย่าง ไม่มีหนัง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 28,
    name: "ปลาหมึก",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 30,
    name: "เนื้อปู",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 32,
    name: "ปลาอื่นๆ (2)",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 34,
    name: "หอยลาย",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 36,
    name: "ปลากะพงขาว",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 38,
    name: "ปลาดุก",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 40,
    name: "ลูกชิ้นปลา",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },
  {
    id: 42,
    name: "ลูกชิ้นเนื้อ",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 1,
    calories: 35,
    category: "veryLow",
  },

  // ─── เนื้อสัตว์ไขมันต่ำ (โปรตีน 7g, ไขมัน 3g, พลังงาน 55 kcal) ────────
  {
    id: 2,
    name: "ปีกไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 6,
    name: "เนื้ออกไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 10,
    name: "ลูกชิ้นไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 14,
    name: "ลูกชิ้นหมู",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 18,
    name: "ปลาซาดีนกระป๋อง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 22,
    name: "หมูเนื้อแดง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },
  {
    id: 43,
    name: "เป็ดย่าง ไม่มีหนัง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 3,
    calories: 55,
    category: "low",
  },

  // ─── เนื้อสัตว์ไขมันปานกลาง (โปรตีน 7g, ไขมัน 5g, พลังงาน 75 kcal) ────
  {
    id: 3,
    name: "ขาหมู ไม่ติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },
  {
    id: 7,
    name: "ไข่ไก่ ทั้งฟอง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },
  {
    id: 11,
    name: "ไข่เป็ด ทั้งฟอง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },
  {
    id: 15,
    name: "ซี่โครงหมู ไม่ติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },
  {
    id: 19,
    name: "เนื้อหมู ไม่ติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },
  {
    id: 23,
    name: "หมูย่าง ไม่มีหนัง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 5,
    calories: 75,
    category: "medium",
  },

  // ─── เนื้อสัตว์ไขมันสูง (โปรตีน 7g, ไขมัน 8g, พลังงาน 100 kcal) ────────
  {
    id: 4,
    name: "ไส้กรอกไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 8,
    name: "ปลาสวาย",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 12,
    name: "ไส้กรอกหมู",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 16,
    name: "หมูบด",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 20,
    name: "เนื้อหมูติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 24,
    name: "เนื้อเป็ดมีหนัง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 27,
    name: "กุนเชียง",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 29,
    name: "ซี่โครงหมู ติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 31,
    name: "เนื้อไก่ติดมัน/หนังไก่",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 33,
    name: "เนื้อวัว ติดมัน",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 35,
    name: "หนังหมู",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 37,
    name: "หมูยอ",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 39,
    name: "แหนม",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
  {
    id: 41,
    name: "แฮม",
    portion: "2 ช้อนกินข้าว เท่ากับ 1 ส่วน",
    protein: 7,
    fat: 8,
    calories: 100,
    category: "high",
  },
];

function MeatPage() {
  const currentUser = localStorage.getItem("currentUser");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedMeal = searchParams.get("mealId") || "breakfast";
  const mealName = searchParams.get("mealName") || "มื้อเช้า";

  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions] = useState({});
  const [currentLogId, setCurrentLogId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Show warning on mount
  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "คำแนะนำ",
      text: "งดเนื้อสัตว์ที่มีไขมันสูง และเนื้อสัตว์แปรรูปทุกชนิด",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "OK",
    });
  }, []);

  useEffect(() => {
    const existingLogs = JSON.parse(
      localStorage.getItem(`meatLogs_${currentUser}`) || "[]",
    );

    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today,
    );

    if (todayMealLog) {
      setCurrentLogId(todayMealLog.id);

      const items = todayMealLog.items
        .map((item) => meatItems.find((mi) => mi.id === item.id))
        .filter(Boolean);

      setSelectedItems(items);

      const loadedPortions = {};
      todayMealLog.items.forEach((item) => {
        loadedPortions[item.id] = item.portion;
      });
      setPortions(loadedPortions);
    }
  }, [currentUser, selectedMeal]);

  const filteredByCategory = {
    veryLow: meatItems.filter(
      (item) =>
        item.category === "veryLow" &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    low: meatItems.filter(
      (item) =>
        item.category === "low" &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    medium: meatItems.filter(
      (item) =>
        item.category === "medium" &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    high: meatItems.filter(
      (item) =>
        item.category === "high" &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  };

  const totalResults =
    filteredByCategory.veryLow.length +
    filteredByCategory.low.length +
    filteredByCategory.medium.length +
    filteredByCategory.high.length;

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
        text: "กรุณาเลือกเนื้อสัตว์อย่างน้อย 1 รายการ",
        confirmButtonColor: "#f6ad55",
      });
      return;
    }

    const totalProtein = calculateTotalProtein();
    const totalFat = calculateTotalFat();
    const totalCalories = calculateTotalCalories();

    const now = new Date();

    const existingLogs = JSON.parse(
      localStorage.getItem(`meatLogs_${currentUser}`) || "[]",
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
      `meatLogs_${currentUser}`,
      JSON.stringify(updatedLogs),
    );

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้ออาหาร: <b>${mealName}</b></p>
          <p style="font-size: 1.2rem; color: #667eea; font-weight: bold;">
            โปรตีนรวม: ${totalProtein.toFixed(1)} กรัม
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

  const groupedItems = {
    veryLow: meatItems.filter((item) => item.category === "veryLow"),
    low: meatItems.filter((item) => item.category === "low"),
    medium: meatItems.filter((item) => item.category === "medium"),
    high: meatItems.filter((item) => item.category === "high"),
  };

  const categoryConfig = {
    veryLow: {
      title: "เนื้อสัตว์ไขมันต่ำมาก",
      color: "#16a34a",
      bgColor: "#f0fdf4",
      borderColor: "#16a34a",
    },
    low: {
      title: "เนื้อสัตว์ไขมันต่ำ",
      color: "#ca8a04",
      bgColor: "#fef9c3",
      borderColor: "#facc15",
    },
    medium: {
      title: "เนื้อสัตว์ไขมันปานกลาง",
      color: "#ea580c",
      bgColor: "#fff7ed",
      borderColor: "#fb923c",
    },
    high: {
      title: "เนื้อสัตว์ไขมันสูง",
      color: "#dc2626",
      bgColor: "#fef2f2",
      borderColor: "#dc2626",
    },
  };
const renderCategory = (categoryKey, items) => {
    // ถ้าไม่มีผลลัพธ์ในหมวดนี้ → ไม่แสดงเลย
    if (items.length === 0) return null;

    const config = categoryConfig[categoryKey];
    
    return (
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "600",
            color: config.color,
            marginBottom: "8px",
          }}
        >
          <u>{config.title}</u>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {items.map((item) => {
            const isSelected = selectedItems.find((i) => i.id === item.id);
            const portion = portions[item.id] || 1;

            return (
              <div
                key={item.id}
                style={{
                  background: isSelected ? config.bgColor : "white",
                  border: isSelected
                    ? `2px solid ${config.borderColor}`
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
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px",
                          }}
                        >
                          <span style={chipStyle("#DBEAFE", "#1E40AF")}>
                            โปรตีน {item.protein} g
                          </span>
                          <span style={chipStyle("#FEF3C7", "#92400E")}>
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
                          ? `2px solid ${config.borderColor}`
                          : "2px solid #cbd5e0",
                        background: isSelected ? config.borderColor : "white",
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
                            border: `2px solid ${config.borderColor}`,
                            background: "white",
                            color: config.borderColor,
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
                            color: config.borderColor,
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
                            border: `2px solid ${config.borderColor}`,
                            background: config.borderColor,
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
                        color: config.color,
                        textAlign: "right",
                        fontWeight: "600",
                      }}
                    >
                      รวม {(portion * item.protein).toFixed(1)} g โปรตีน •{" "}
                      {(portion * item.fat).toFixed(1)} g ไขมัน •{" "}
                      {(portion * item.calories).toFixed(0)} kcal พลังงาน
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
            title={`เนื้อสัตว์ (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

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
              <u>เลือกรายการเนื้อสัตว์</u>
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

            {renderCategory("veryLow", filteredByCategory.veryLow)}
            {renderCategory("low", filteredByCategory.low)}
            {renderCategory("medium", filteredByCategory.medium)}
            {renderCategory("high", filteredByCategory.high)}
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

export default MeatPage;
