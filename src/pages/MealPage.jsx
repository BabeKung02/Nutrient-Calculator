import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";

// ─── สัดส่วนอาหารตาม calorie tier (5 ระดับ) ──────────────────────
// 1000-1300 | 1301-1500 | 1501-1700 | 1701-1900 | 1901-2200
function getPortionsByCalories(cal) {
  if (cal <= 1300) {
    return { rice: 6,  vegetable: 6, fruit: 3, meat: 5,  milk: 1, sugar: 3, fat: 3, salt: 1 };
  } else if (cal <= 1500) {
    return { rice: 7,  vegetable: 6, fruit: 3, meat: 5,  milk: 1, sugar: 3, fat: 3, salt: 1 };
  } else if (cal <= 1700) {
    return { rice: 8,  vegetable: 6, fruit: 3, meat: 6,  milk: 1, sugar: 3, fat: 5, salt: 1 };
  } else if (cal <= 1900) {
    return { rice: 9,  vegetable: 6, fruit: 4, meat: 7,  milk: 1, sugar: 3, fat: 6, salt: 1 };
  } else {
    return { rice: 10, vegetable: 6, fruit: 4, meat: 8,  milk: 1, sugar: 3, fat: 6, salt: 1 };
  }
}

// ─── คำนวณ portions ที่กินแล้วจาก nutritional data ─────────────────────────
// ข้าว-แป้ง: 1 ทัพพี = 18g carb
const calcRicePortions = (logs) => logs.reduce((s, l) => {
  const carb = Number(l.totalCarb || l.carb || l.carbs || l.carbGrams || 0);
  if (carb > 0) return s + carb / 18;
  
  const sv = Number(l.servings || l.serving || l.amount || l.quantity || l.portionSize || l.portions || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// ผัก: 1 ทัพพี = 5g carb
const calcVegetablePortions = (logs) => logs.reduce((s, l) => {
  const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
  if (carb > 0) return s + carb / 5;
  
  const sv = Number(l.servings || l.serving || l.amount || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// ผลไม้: 1 ส่วน = 15g carb
const calcFruitPortions = (logs) => logs.reduce((s, l) => {
  const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
  if (carb > 0) return s + carb / 15;
  
  const sv = Number(l.servings || l.serving || l.amount || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// เนื้อสัตว์: 1 ช้อนกินข้าว = 7g protein
const calcMeatPortions = (logs) => logs.reduce((s, l) => {
  const pro = Number(l.totalProtein || l.protein || l.proteins || 0);
  if (pro > 0) return s + pro / 7;
  
  const sv = Number(l.servings || l.serving || l.amount || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// นม: 1 แก้ว = 8g protein
const calcDairyPortions = (logs) => logs.reduce((s, l) => {
  const pro = Number(l.totalProtein || l.protein || l.proteins || 0);
  if (pro > 0) return s + pro / 8;
  
  const sv = Number(l.servings || l.serving || l.amount || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// น้ำตาล: 1 ช้อนชา = 4g carb
// const calcSugarPortions = (logs) => logs.reduce((s, l) => {
//   const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
//   if (carb > 0) return s + carb / 4;
  
//   const sv = Number(l.servings || l.serving || l.amount || 0);
//   if (sv > 0) return s + sv;
  
//   return s;
// }, 0);

// น้ำมัน: 1 ช้อนชา = 5g fat
const calcFatPortions = (logs) => logs.reduce((s, l) => {
  const fat = Number(l.totalFat || l.fat || 0);
  if (fat > 0) return s + fat / 5;
  
  const sv = Number(l.servings || l.serving || l.amount || 0);
  if (sv > 0) return s + sv;
  
  return s;
}, 0);

// เกลือ: นับ servings ตรงๆ
const calcSaltPortions = (logs) => logs.reduce((s, l) =>
  s + Number(l.servings || l.serving || l.amount || 0), 0);

function MealPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ kcal: 0, protein: 0, carb: 0, fat: 0 });
  const [userTarget, setUserTarget] = useState({ calories: 2000, protein: 100, carbs: 250, fat: 67 });
  const [mealBreakdown, setMealBreakdown] = useState({
    breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    lunch:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    dinner:    { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    snack:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
  });
  const [consumed, setConsumed] = useState({
    rice: 0, vegetable: 0, fruit: 0, meat: 0, milk: 0, sugar: 0, fat: 0, salt: 0,
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser") || "default";

    const userDataStr = localStorage.getItem(`userData_${currentUser}`);
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setUserTarget({
        calories: Number(userData.calories) || 2000,
        protein:  Number(userData.protein)  || 100,
        carbs:    Number(userData.carbs)    || 250,
        fat:      Number(userData.fat)      || 67,
      });
    }

    const getLogs = (key) =>
      JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");

    const rawRice      = getLogs("riceLogs");
    const rawFruit     = getLogs("fruitLogs");
    const rawDairy     = getLogs("dairyLogs");
    const rawMeat      = getLogs("meatLogs");
    const rawVegetable = getLogs("vegetableLogs");
    const rawFat       = getLogs("fatLogs");
    const rawDish      = getLogs("dishLogs");
    const rawCondiment = getLogs("condimentLogs");

    const now      = new Date();
    const todayStr = now.toLocaleDateString("th-TH");
    const f        = (arr) => arr.filter((l) => l.date === todayStr);

    const todayRice      = f(rawRice);
    const todayFruit     = f(rawFruit);
    const todayDairy     = f(rawDairy);
    const todayMeat      = f(rawMeat);
    const todayVegetable = f(rawVegetable);
    const todayFat       = f(rawFat);
    const todayDish      = f(rawDish);
    const todayCondiment = f(rawCondiment);

    setConsumed({
      rice:      Math.round(calcRicePortions(todayRice)      * 10) / 10,
      vegetable: Math.round(calcVegetablePortions(todayVegetable) * 10) / 10,
      fruit:     Math.round(calcFruitPortions(todayFruit)    * 10) / 10,
      meat:      Math.round(calcMeatPortions(todayMeat)      * 10) / 10,
      milk:      Math.round(calcDairyPortions(todayDairy)    * 10) / 10,
    //   sugar:     Math.round(calcSugarPortions(todayDish)     * 10) / 10,
      fat:       Math.round(calcFatPortions(todayFat)        * 10) / 10,
      salt:      Math.round(calcSaltPortions(todayCondiment) * 10) / 10,
    });

    const todayLogs = [
      ...todayRice, ...todayFruit, ...todayDairy, ...todayMeat,
      ...todayVegetable, ...todayFat, ...todayDish, ...todayCondiment,
    ].map((log) => {
      const carbValue    = Number(log.totalCarb    || log.carb    || log.carbs    || 0);
      const proteinValue = Number(log.totalProtein || log.protein || log.proteins || 0);
      const fatValue     = Number(log.totalFat     || log.fat     || 0);
      // คำนวณ calories จาก macro ถ้าไม่มี totalCalories
      const kcalValue    = Number(log.totalCalories || log.calories || 0) || 
                          (carbValue * 4 + proteinValue * 4 + fatValue * 9);
      return { ...log, kcal: kcalValue, carb: carbValue, protein: proteinValue, fat: fatValue };
    });

    const totals = todayLogs.reduce(
      (acc, curr) => ({
        kcal:    acc.kcal    + (Number(curr.kcal)    || 0),
        protein: acc.protein + (Number(curr.protein) || 0),
        carb:    acc.carb    + (Number(curr.carb)    || 0),
        fat:     acc.fat     + (Number(curr.fat)     || 0),
      }),
      { kcal: 0, protein: 0, carb: 0, fat: 0 },
    );
    setSummary(totals);

    const breakdown = {
      breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      lunch:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      dinner:    { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      snack:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    };
    todayLogs.forEach((log) => {
      const mealId = log.mealId || "snack";
      if (breakdown[mealId]) {
        breakdown[mealId].kcal    += Number(log.kcal)    || 0;
        breakdown[mealId].protein += Number(log.protein) || 0;
        breakdown[mealId].carb    += Number(log.carb)    || 0;
        breakdown[mealId].fat     += Number(log.fat)     || 0;
        breakdown[mealId].items.push(log);
      }
    });
    setMealBreakdown(breakdown);
  }, []);

  const portions = getPortionsByCalories(userTarget.calories);

  const foodCategories = [
    {
      id: "rice",      name: "ข้าว-แป้ง",    icon: "🍚", route: "/rice-flour",
      target: portions.rice,      consumed: consumed.rice,      unit: "ทัพพี",
      gradient: "linear-gradient(135deg,#FDE68A 0%,#FEF3C7 100%)",
      shadowColor: "rgba(245,158,11,0.15)",
    },
    {
      id: "vegetable",  name: "ผัก",          icon: "🥬", route: "/vegetable",
      target: portions.vegetable, consumed: consumed.vegetable,  unit: "ทัพพี",
      gradient: "linear-gradient(135deg,#A7F3D0 0%,#D1FAE5 100%)",
      shadowColor: "rgba(34,197,94,0.15)",
    },
    {
      id: "fruit",      name: "ผลไม้",        icon: "🍎", route: "/fruit",
      target: portions.fruit,     consumed: consumed.fruit,      unit: "ส่วน",
      gradient: "linear-gradient(135deg,#FCA5A5 0%,#FECDD3 100%)",
      shadowColor: "rgba(244,63,94,0.15)",
    },
    {
      id: "meat",       name: "เนื้อสัตว์",   icon: "🥩", route: "/meat",
      target: portions.meat,      consumed: consumed.meat,       unit: "ช้อนกินข้าว",
      gradient: "linear-gradient(135deg,#FDD19A 0%,#FEE9C8 100%)",
      shadowColor: "rgba(234,88,12,0.15)",
    },
    {
      id: "dairy",      name: "นม",           icon: "🥛", route: "/dairy",
      target: portions.milk,      consumed: consumed.milk,       unit: "แก้ว",
      gradient: "linear-gradient(135deg,#BAD8FD 0%,#DBEAFE 100%)",
      shadowColor: "rgba(59,130,246,0.15)",
    },
    {
      id: "sugar",      name: "น้ำตาล",       icon: "🍬", route: "/single-dish",
      target: portions.sugar,     consumed: consumed.sugar,      unit: "ช้อนชา", isLimit: true,
      gradient: "linear-gradient(135deg,#F0ABFC 0%,#FAD1FF 100%)",
      shadowColor: "rgba(217,70,239,0.15)",
    },
    {
      id: "fat",        name: "น้ำมัน",       icon: "🧈", route: "/fat",
      target: portions.fat,       consumed: consumed.fat,        unit: "ช้อนชา", isLimit: true,
      gradient: "linear-gradient(135deg,#FEF08A 0%,#FEF9C3 100%)",
      shadowColor: "rgba(234,179,8,0.15)",
    },
    {
      id: "salt",       name: "เกลือ", icon: "🧂", route: "/condiment",
      target: portions.salt,      consumed: consumed.salt,       unit: "ช้อนชา", isLimit: true,
      gradient: "linear-gradient(135deg,#CBD5E1 0%,#EEF2F6 100%)",
      shadowColor: "rgba(100,116,139,0.15)",
    },
  ];

  const meals = [
    { id: "breakfast", name: "มื้อเช้า",  icon: "🌅", gradient: "linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%)", borderColor: "#FCD9A0" },
    { id: "lunch",     name: "มื้อเที่ยง", icon: "☀️", gradient: "linear-gradient(135deg,#DBEAFE 0%,#BAD8FD 100%)", borderColor: "#93D8FF" },
    { id: "dinner",    name: "มื้อเย็น",  icon: "🌙", gradient: "linear-gradient(135deg,#EDE9FE 0%,#DDD6FE 100%)", borderColor: "#C4B5FD" },
    { id: "snack",     name: "มื้อว่าง",  icon: "🍪", gradient: "linear-gradient(135deg,#FCE7F3 0%,#FBCFE8 100%)", borderColor: "#F9A8D4" },
  ];

//   const handleFoodClick = (category) => {
//     navigate(`${category.route}?mealId=breakfast&mealName=${encodeURIComponent("มื้อเช้า")}`);
//   };
  const handleMealClick = (meal) => {
    navigate(`/food-log?mealId=${meal.id}&mealName=${encodeURIComponent(meal.name)}`);
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg,#B7C7FF 0%,#E5D4FB 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ maxWidth: "600px", width: "100%", minHeight: "100vh" }}>
        <div style={{ background: "white", minHeight: "100vh" }}>
          <Header title="สรุปโภชนาการวันนี้" backTo="/menu" />

          <div style={{ padding: "15px" }}>

            {/* ── Summary ─────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "linear-gradient(135deg,#A5B4FC 0%,#C4B5FD 100%)", borderRadius: "16px", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 4px 15px rgba(102,126,234,0.15)" }}>
                <div style={{ fontSize: "0.6rem", color: "rgba(60,40,120,0.75)", marginBottom: "4px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>พลังงานรวม</div>
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: "4px" }}>
                  <span style={{ fontSize: "1.7rem", fontWeight: "800", color: "rgba(40,20,100,0.85)", letterSpacing: "-1px", lineHeight: "1" }}>{Math.round(summary.kcal)}</span>
                  <span style={{ marginLeft: "4px", color: "rgba(60,40,120,0.5)", fontSize: "0.75rem", fontWeight: "600" }}>/ {userTarget.calories}</span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "rgba(60,40,120,0.65)", fontWeight: "700", marginBottom: "8px" }}>kcal</div>
                <div style={{ width: "100%", height: "6px", background: "rgba(80,40,160,0.12)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((summary.kcal / userTarget.calories) * 100, 100)}%`, height: "100%", background: summary.kcal > userTarget.calories ? "linear-gradient(90deg,#FF6B9D,#FF85A7)" : "linear-gradient(90deg,#48BB78,#68D391)", borderRadius: "10px", transition: "width 0.5s ease" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gap: "8px" }}>
                <MacroBox label="คาร์บ"   value={Math.round(summary.carb)}    target={userTarget.carbs}   unit="g" gradient="linear-gradient(135deg,#FCD9A0 0%,#FDE4BA 100%)" color="#FCD9A0" />
                <MacroBox label="โปรตีน" value={Math.round(summary.protein)} target={userTarget.protein} unit="g" gradient="linear-gradient(135deg,#FBACCA 0%,#FCC2D7 100%)" color="#FBACCA" />
                <MacroBox label="ไขมัน"  value={Math.round(summary.fat)}     target={userTarget.fat}     unit="g" gradient="linear-gradient(135deg,#93D8FF 0%,#BAE8FF 100%)" color="#93D8FF" />
              </div>
            </div>

            {/* ── Food Categories ──────────────────── */}
            <div style={{ marginTop: "28px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d3748", marginBottom: "12px" }}>
                สัดส่วนอาหารที่แนะนำต่อวัน
              </h3>

              {/* Top 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                {foodCategories.slice(0, 3).map((cat) => (
                  <FoodProgressCard key={cat.id} category={cat} />
                ))}
              </div>

              {/* Bottom 5 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {foodCategories.slice(3).map((cat) => (
                  <FoodProgressCard key={cat.id} category={cat} compact />
                ))}
              </div>
            </div>

            {/* ── Meals ───────────────────────────── */}
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px" }}>เริ่มบันทึกมื้ออาหาร</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {meals.map((meal) => {
                  const mealData = mealBreakdown[meal.id];
                  const hasData  = mealData && mealData.kcal > 0;
                  return (
                    <div key={meal.id} onClick={() => handleMealClick(meal)} style={{ background: "white", borderRadius: "16px", padding: "20px 15px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: `3px solid ${meal.borderColor}`, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: meal.gradient }} />
                      <div style={{ fontSize: "3rem", marginBottom: "8px", textAlign: "center" }}>{meal.icon}</div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: "700", color: "#2d3748", textAlign: "center" }}>{meal.name}</h3>
                      {hasData ? (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: "700", color: "#2D3748", fontSize: "0.9rem" }}>{Math.round(mealData.kcal)} kcal</div>
                          <div style={{ fontSize: "0.7rem", marginTop: "2px", color: "#A0AEC0" }}>{mealData.items.length} รายการ</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.7rem", color: "#CBD5E0", fontWeight: "600", textAlign: "center" }}>ยังไม่มีรายการ</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tip */}
            <div style={{ marginTop: "20px", padding: "12px", background: "#FEF9C3", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem" }}>💡</span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E", fontWeight: "600" }}>คลิกที่มื้ออาหารเพื่อเพิ่มหรือดูรายการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MacroBox ────────────────────────────────────────────────────────────────
function MacroBox({ label, value, target, unit, gradient, color }) {
  const percentage = Math.min((value / target) * 100, 100);
  const isOver     = value > target;
  return (
    <div style={{ background: gradient, borderRadius: "12px", padding: "12px", boxShadow: `0 3px 12px ${color}40`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: "0.65rem", color: "rgba(40,40,80,0.75)", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "rgba(30,30,70,0.85)", lineHeight: "1" }}>{value}</span>
        <span style={{ fontSize: "0.7rem", color: "rgba(40,40,80,0.5)", fontWeight: "600", marginLeft: "3px" }}>/{target}</span>
        <span style={{ fontSize: "0.65rem", color: "rgba(40,40,80,0.5)", marginLeft: "4px" }}>{unit}</span>
      </div>
      <div style={{ width: "100%", height: "4px", background: "rgba(40,40,80,0.12)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ width: `${percentage}%`, height: "100%", background: isOver ? "#EF4444" : "rgba(40,40,100,0.35)", borderRadius: "10px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ─── FoodProgressCard ────────────────────────────────────────────────────────
function FoodProgressCard({ category, compact }) {
  const { consumed: eaten = 0, target, unit, name, icon, gradient, shadowColor } = category;
  const pct    = target > 0 ? Math.min((eaten / target) * 100, 100) : 0;
  const isOver = eaten > target;

  return (
    <div
      style={{
        background: gradient,
        borderRadius: "14px",
        padding: compact ? "10px 6px" : "14px 12px",
        cursor: "default",
        boxShadow: `0 4px 14px ${shadowColor || "rgba(0,0,0,0.12)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: compact ? "118px" : "148px",
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: compact ? "1.6rem" : "2rem", marginBottom: compact ? "3px" : "5px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
        {icon}
      </div>

      {/* Category name */}
      <div style={{ fontSize: compact ? "0.58rem" : "0.72rem", fontWeight: "700", color: "rgba(50,50,80,0.9)", textAlign: "center", marginBottom: compact ? "4px" : "6px", lineHeight: "1.2" }}>
        {name}
      </div>

      {/* X/Y count */}
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: compact ? "4px" : "6px" }}>
        <span style={{ fontSize: compact ? "1.05rem" : "1.3rem", fontWeight: "800", color: isOver ? "#DC2626" : "rgba(30,30,60,0.85)", lineHeight: "1", transition: "color 0.3s" }}>
          {eaten}
        </span>
        <span style={{ fontSize: compact ? "0.55rem" : "0.65rem", color: "rgba(30,30,60,0.5)", fontWeight: "600", marginLeft: "2px" }}>
          /{target}
        </span>
      </div>

      {/* Unit badge */}
      <div style={{ fontSize: compact ? "0.42rem" : "0.52rem", color: "rgba(30,30,60,0.6)", fontWeight: "600", background: "rgba(30,30,60,0.08)", padding: "1px 7px", borderRadius: "20px", marginBottom: compact ? "5px" : "7px" }}>
        {unit}
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", height: "4px", background: "rgba(30,30,60,0.1)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: isOver ? "#EF4444" : "rgba(30,30,80,0.3)", borderRadius: "10px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default MealPage;