import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";

function RiceFlourPage() {
  const currentUser = localStorage.getItem("currentUser");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // รับค่า State จากหน้า MealPage (ถ้าไม่มีให้ Default เป็นมื้อเช้า)
  const selectedMeal = searchParams.get("mealId") || "breakfast";
  const mealName = searchParams.get("mealName") || "มื้อเช้า";

  const [selectedItems, setSelectedItems] = useState([]);
  const [portions, setPortions] = useState({});
  const [currentLogId, setCurrentLogId] = useState(null); // เก็บ ID ของ log ที่กำลังแก้ไข

  // ข้อมูลรายการอาหาร (แก้ cup เป็น format 1/2 เพื่อความสวยงามตามที่เคยคุยกัน)
  const riceFlourItems = [
    {
      id: 1,
      name: "ข้าวซ้อมมือ (สวย) / ข้าวขาว (สวย)",
      weight: 55,
      spoon: "1",
      cup: "1/3",
    },
    { id: 2, name: "ข้าวเหนียว", weight: 35, spoon: "1/2", cup: "1/4" },
    { id: 3, name: "ข้าวต้ม", weight: "150-170", spoon: "2", cup: "3/4" },
    { id: 4, name: "โจ๊ก", weight: 135, spoon: "2", cup: "1/2" },
    { id: 5, name: "ข้าวโอ๊ต", weight: 110, spoon: "1", cup: "1/2" },
    { id: 6, name: "ลูกเดือยสุก", weight: 65, spoon: "1", cup: "1/2" },
    {
      id: 7,
      name: "เส้นหมี่สุก / เส้นก๋วยเตี๋ยวสุก",
      weight: 70,
      spoon: "1",
      cup: "1/2",
    },
    { id: 8, name: "วุ้นเส้นลวก", weight: 80, spoon: "1", cup: "1/2" },
    { id: 9, name: "เส้นใหญ่ลวก", weight: "60-70", spoon: "1", cup: "1/2" },
    { id: 10, name: "เส้นขนมจีน", weight: 75, spoon: "1 จับ", cup: "1/2" },
  ];

  // โหลดข้อมูลที่บันทึกไว้ของมื้อนี้วันนี้ (ถ้ามี)
  useEffect(() => {
    const existingLogs = JSON.parse(
      localStorage.getItem(`riceLogs_${currentUser}`) || "[]",
    );

    // หาว่ามี log ของมื้อนี้วันนี้หรือไม่
    const today = new Date().toLocaleDateString("th-TH");
    const todayMealLog = existingLogs.find(
      (log) => log.mealId === selectedMeal && log.date === today
    );

    if (todayMealLog) {
      // ถ้ามี ให้โหลดข้อมูลที่เคยบันทึกไว้
      setCurrentLogId(todayMealLog.id);
      
      // แปลง items กลับเป็น selectedItems
      const items = todayMealLog.items.map((item) => {
        return riceFlourItems.find((rfi) => rfi.id === item.id);
      }).filter(Boolean); // กรองเอาเฉพาะที่หาเจอ

      setSelectedItems(items);

      // แปลง portions
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
      return total + portion * 18; // ข้าวและแป้งให้คาร์บประมาณ 18 กรัมต่อทัพพี
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
    const now = new Date();

    // ดึงข้อมูลเก่าจาก LocalStorage
    const existingLogs = JSON.parse(
      localStorage.getItem(`riceLogs_${currentUser}`) || "[]",
    );

    let updatedLogs;
    let logId;

    if (currentLogId) {
      // ถ้ามี log เดิมอยู่แล้ว ให้อัพเดท
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
      // ถ้ายังไม่มี ให้สร้างใหม่
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
      setCurrentLogId(logId); // เก็บ ID ไว้สำหรับครั้งต่อไป
    }

    // บันทึกกลับลง LocalStorage
    localStorage.setItem(
      `riceLogs_${currentUser}`,
      JSON.stringify(updatedLogs),
    );

    console.log("Saved to LocalStorage:", updatedLogs.find(log => log.id === logId));

    Swal.fire({
      title: currentLogId ? "อัพเดทสำเร็จ!" : "บันทึกสำเร็จ!",
      html: `
        <div style="text-align:center;">
          <p>มื้ออาหาร: <b>${mealName}</b></p>
          <p style="font-size: 1.2rem; color: #667eea; font-weight: bold;">
            คาร์โบไฮเดรตรวม: ${totalCarbs.toFixed(1)} กรัม
          </p>
          ${currentLogId ? '<p style="font-size: 0.9rem; color: #718096;">ข้อมูลถูกอัพเดทแล้ว</p>' : ''}
        </div>
      `,
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#667eea",
      background: "#fff",
      borderRadius: "15px",
    });
    navigate(`/meal?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`);
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
          {/* แสดงชื่อมื้ออาหารที่ Header ด้วย */}
          <Header
            title={`ข้าว - แป้ง (${mealName})`}
            backTo={`/food-log?mealId=${selectedMeal}&mealName=${encodeURIComponent(mealName)}`}
          />

          {/* Food Items List */}
          <div style={{ padding: "15px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <h3
                style={{
                  margin: "5px 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "orange",
                }}
              >
                <u>เลือกรายการอาหาร</u>
              </h3>
            </div>
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
                          marginBottom: "6px",
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
                            }}
                          >
                            {item.weight} กรัม • {item.spoon} ทัพพี •
                            <span
                              className="fraction"
                              style={{ margin: "0 5px" }}
                            >
                              {item.cup}
                            </span>
                            <span style={{ marginRight: "5px" }}>ถ้วย</span>
                          </div>
                        </div>
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
                          จำนวนทัพพี
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
                ? "กรุณาเลือกรายการอาหาร"
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

export default RiceFlourPage;