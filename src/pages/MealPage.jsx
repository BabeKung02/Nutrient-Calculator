import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";

function MealPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    kcal: 0,
    protein: 0,
    carb: 0,
    fat: 0,
  });
  const [userTarget, setUserTarget] = useState({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 67,
  });
  const [mealBreakdown, setMealBreakdown] = useState({
    breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    lunch: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    dinner: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    snack: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser") || "default";

    // 1. ดึงเป้าหมายผู้ใช้
    const userDataStr = localStorage.getItem(`userData_${currentUser}`);
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setUserTarget({
        calories: Number(userData.calories) || 2000,
        protein: Number(userData.protein) || 100,
        carbs: Number(userData.carbs) || 250,
        fat: Number(userData.fat) || 67,
      });
    }

    // 2. ฟังก์ชันช่วยดึงข้อมูล
    const getLogs = (key) =>
      JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");

    const rawRice = getLogs("riceLogs");
    const rawFruit = getLogs("fruitLogs");
    const rawDairy = getLogs("dairyLogs");
    const rawMeat = getLogs("meatLogs");
    const rawVegetable = getLogs("vegetableLogs");
    const rawFat = getLogs("fatLogs");
    const rawDessert = getLogs("dessertLogs");
    const rawSingleDish = getLogs("singleDishLogs");
    const rawDaily = getLogs("dailyLogs");

    // ... (โค้ดก่อนหน้า)

    // 🌟 3. สร้างวันที่วันนี้
    const now = new Date();
    const todayStr = now.toLocaleDateString("th-TH"); // "13/2/2569"

    // 4. กรองเฉพาะของวันนี้ และ Normalization (ปรับปรุงใหม่ตาม JSON จริงของคุณ)
    const todayLogs = [
      ...rawRice.filter((l) => l.date === todayStr),
      ...rawFruit.filter((l) => l.date === todayStr),
      ...rawDairy.filter((l) => l.date === todayStr),
      ...rawMeat.filter((l) => l.date === todayStr),
      ...rawVegetable.filter((l) => l.date === todayStr),
      ...rawFat.filter((l) => l.date === todayStr),
      ...rawDessert.filter((l) => l.date === todayStr),
      ...rawSingleDish.filter((l) => l.date === todayStr),
      ...rawDaily.filter((l) => l.date === todayStr),
    ].map((log) => {
      // 🔍 เจาะจงดึง totalCarbs ที่คุณใช้ใน JSON
      const carbValue = Number(log.totalCarb || log.carb || log.carbs || 0);

      const proteinValue = Number(
        log.totalProtein || log.protein || log.proteins || 0,
      );
      const FatValue = Number(log.totalFat || log.fat || 0);

      const kcalValue = Number(
        log.totalCalories || log.calories || carbValue * 4,
      );

      return {
        ...log,
        kcal: kcalValue,
        carb: carbValue,
        protein: proteinValue,
        fat: FatValue,
      };
    });

    // --- หลังจากนั้นคำนวณ totals และ breakdown ตามเดิม ---
    // ...

    // 🌟 5. คำนวณ Totals (จะกลายเป็น 0 ทันทีถ้าวันนี้ยังไม่มี log ใหม่)
    const totals = todayLogs.reduce(
      (acc, curr) => ({
        kcal: acc.kcal + (Number(curr.kcal) || 0),
        protein: acc.protein + (Number(curr.protein) || 0),
        carb: acc.carb + (Number(curr.carb) || 0),
        fat: acc.fat + (Number(curr.fat) || 0),
      }),
      { kcal: 0, protein: 0, carb: 0, fat: 0 },
    );

    setSummary(totals);

    // 6. แยกรายละเอียดตามมื้อ (Breakdown)
    const breakdown = {
      breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      lunch: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      dinner: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      snack: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    };

    todayLogs.forEach((log) => {
      const mealId = log.mealId || "snack";
      if (breakdown[mealId]) {
        breakdown[mealId].kcal += Number(log.kcal) || 0;
        breakdown[mealId].protein += Number(log.protein) || 0;
        breakdown[mealId].carb += Number(log.carb) || 0;
        breakdown[mealId].fat += Number(log.fat) || 0;
        breakdown[mealId].items.push(log);
      }
    });

    setMealBreakdown(breakdown);
  }, []);

  const meals = [
    {
      id: "breakfast",
      name: "มื้อเช้า",
      icon: "🌅",
      gradient: "linear-gradient(135deg, #FFE59D 0%, #FFB84D 100%)",
      shadowColor: "rgba(255, 184, 77, 0.3)",
      route: "/food-log",
    },
    {
      id: "lunch",
      name: "มื้อเที่ยง",
      icon: "☀️",
      gradient: "linear-gradient(135deg, #A8E6FF 0%, #4EBAFF 100%)",
      shadowColor: "rgba(78, 186, 255, 0.3)",
      route: "/food-log",
    },
    {
      id: "dinner",
      name: "มื้อเย็น",
      icon: "🌙",
      gradient: "linear-gradient(135deg, #D4C5F9 0%, #9B7EDE 100%)",
      shadowColor: "rgba(155, 126, 222, 0.3)",
      route: "/food-log",
    },
    {
      id: "snack",
      name: "มื้อว่าง",
      icon: "🍪",
      gradient: "linear-gradient(135deg, #FFB3D9 0%, #FF6BB5 100%)",
      shadowColor: "rgba(255, 107, 181, 0.3)",
      route: "/food-log",
    },
  ];

  const handleMealClick = (meal) => {
    navigate(
      `${meal.route}?mealId=${meal.id}&mealName=${encodeURIComponent(meal.name)}`,
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
        {/* --- SECTION: SUMMARY CARD --- */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <Header title="สรุปโภชนาการวันนี้" backTo="/menu" />

          <div style={{ padding: "20px 15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                padding: "20px",
                background: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)",
                borderRadius: "16px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#718096",
                    marginBottom: "4px",
                    fontWeight: "600",
                  }}
                >
                  พลังงานรวม
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "800",
                      color: "#2d3748",
                      letterSpacing: "-1px",
                    }}
                  >
                    {Math.round(summary.kcal)}
                  </span>
                  <span
                    style={{
                      marginLeft: "6px",
                      color: "#A0AEC0",
                      fontSize: "1.4rem",
                      fontWeight: "600",
                    }}
                  >
                    / {userTarget.calories}
                  </span>
                  <span
                    style={{
                      marginLeft: "6px",
                      color: "#718096",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    kcal
                  </span>
                </div>
                {/* Progress bar สำหรับแคลอรี่ */}
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#E2E8F0",
                    borderRadius: "10px",
                    marginTop: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min((summary.kcal / userTarget.calories) * 100, 100)}%`,
                      height: "100%",
                      background:
                        summary.kcal > userTarget.calories
                          ? "linear-gradient(90deg, #FC8181, #F56565)"
                          : "linear-gradient(90deg, #48BB78, #38A169)",
                      borderRadius: "10px",
                      transition: "width 0.5s ease",
                      boxShadow: "0 0 10px rgba(72, 187, 120, 0.4)",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color:
                      summary.kcal > userTarget.calories
                        ? "#E53E3E"
                        : "#38A169",
                    marginTop: "6px",
                    fontWeight: "600",
                  }}
                >
                  {summary.kcal > userTarget.calories
                    ? `เกินเป้าหมาย +${Math.round(summary.kcal - userTarget.calories)} kcal`
                    : ``}
                </div>
              </div>
            </div>

            {/* Macro Nutrients */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <MacroItem
                label="โปรตีน"
                value={Math.round(summary.protein)}
                target={userTarget.protein}
                unit="g"
                color="#FF6B9D"
              />
              <MacroItem
                label="คาร์บ"
                value={Math.round(summary.carb)}
                target={userTarget.carbs}
                unit="g"
                color="#FFB84D"
              />
              <MacroItem
                label="ไขมัน"
                value={Math.round(summary.fat)}
                target={userTarget.fat}
                unit="g"
                color="#4EBAFF"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION: MEAL SELECTION --- */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* แสดงข้อความเริ่มบันทึกมื้ออาหาร */}
          <div
            style={{
              textAlign: "center",
              paddingTop: "20px",
              color: "#2D3748",
              fontWeight: "700",
              fontSize: "1.1rem",
            }}
          >
            เริ่มบันทึกมื้ออาหาร
          </div>

          {/* Food Categories Grid */}
          <div style={{ padding: "20px 15px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
              }}
            >
              {meals.map((meal) => {
                const mealData = mealBreakdown[meal.id];
                const hasData = mealData && mealData.kcal > 0;

                return (
                  <div
                    key={meal.id}
                    onClick={() => handleMealClick(meal)}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "30px 20px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      border: "3px solid transparent",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Gradient Background */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "8px",
                        background: meal.gradient,
                      }}
                    />

                    {/* Icon */}
                    <div
                      style={{
                        fontSize: "3.5rem",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}
                    >
                      {meal.icon}
                    </div>

                    {/* Category Name */}
                    <h3
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        textAlign: "center",
                      }}
                    >
                      {meal.name}
                    </h3>

                    {hasData && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#718096",
                          marginTop: "8px",
                          padding: "6px 10px",
                          background: "#F7FAFC",
                          borderRadius: "8px",
                          display: "inline-block",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#2D3748",
                            fontSize: "0.85rem",
                          }}
                        >
                          {Math.round(mealData.kcal)} kcal
                        </div>
                        <div style={{ fontSize: "0.65rem", marginTop: "2px" }}>
                          {mealData.items.length} รายการ
                        </div>
                      </div>
                    )}

                    {!hasData && (
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "#CBD5E0",
                          marginTop: "8px",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        ยังไม่มีรายการ
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Text */}
          <div
            style={{
              padding: "0 15px 20px 15px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#718096",
              }}
            >
              💡 คลิกที่มื้ออาหารเพื่อเพิ่มหรือดูรายการ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component ย่อยสำหรับแสดงสารอาหารหลัก
function MacroItem({ label, value, target, unit, color }) {
  const percentage = Math.min((value / target) * 100, 100);
  const isOver = value > target;

  return (
    <div
      style={{
        textAlign: "center",
        background: "white",
        padding: "14px 10px",
        borderRadius: "14px",
        border: "2px solid #F7FAFC",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          color: "#A0AEC0",
          marginBottom: "6px",
          textTransform: "uppercase",
          fontWeight: "700",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.1rem",
          fontWeight: "800",
          color: "#2D3748",
          marginBottom: "2px",
        }}
      >
        {value}
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "#A0AEC0",
            marginLeft: "3px",
          }}
        >
          / {target}
        </span>
      </div>
      <div
        style={{
          fontSize: "0.65rem",
          color: "#718096",
          marginBottom: "8px",
          fontWeight: "500",
        }}
      >
        {unit}
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "#EDF2F7",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: isOver
              ? "linear-gradient(90deg, #FC8181, #F56565)"
              : color,
            borderRadius: "10px",
            transition: "width 0.5s ease",
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
      <div
        style={{
          fontSize: "0.6rem",
          color: isOver ? "#E53E3E" : "#48BB78",
          marginTop: "4px",
          fontWeight: "600",
        }}
      >
        {isOver ? `+${value - target}${unit}` : ``}
      </div>
    </div>
  );
}

export default MealPage;
