// // import { useNavigate } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import Header from "../components/Header";

// // // ─── สัดส่วนอาหารตาม calorie tier (5 ระดับ) ──────────────────────
// // // 1000-1300 | 1301-1500 | 1501-1700 | 1701-1900 | 1901-2200
// // function getPortionsByCalories(cal) {
// //   if (cal <= 1300) {
// //     return { rice: 6,  vegetable: 6, fruit: 3, meat: 5,  milk: 1, sugar: 3, fat: 3, salt: 1 };
// //   } else if (cal <= 1500) {
// //     return { rice: 7,  vegetable: 6, fruit: 3, meat: 5,  milk: 1, sugar: 3, fat: 3, salt: 1 };
// //   } else if (cal <= 1700) {
// //     return { rice: 8,  vegetable: 6, fruit: 3, meat: 6,  milk: 1, sugar: 3, fat: 5, salt: 1 };
// //   } else if (cal <= 1900) {
// //     return { rice: 9,  vegetable: 6, fruit: 4, meat: 7,  milk: 1, sugar: 3, fat: 6, salt: 1 };
// //   } else {
// //     return { rice: 10, vegetable: 6, fruit: 4, meat: 8,  milk: 1, sugar: 3, fat: 6, salt: 1 };
// //   }
// // }

// // // ─── คำนวณ portions ที่กินแล้วจาก nutritional data ─────────────────────────
// // // ข้าว-แป้ง: 1 ทัพพี = 18g carb
// // const calcRicePortions = (logs) => logs.reduce((s, l) => {
// //   const carb = Number(l.totalCarb || l.carb || l.carbs || l.carbGrams || 0);
// //   if (carb > 0) return s + carb / 18;

// //   const sv = Number(l.servings || l.serving || l.amount || l.quantity || l.portionSize || l.portions || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // ผัก: 1 ทัพพี = 5g carb
// // const calcVegetablePortions = (logs) => logs.reduce((s, l) => {
// //   const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
// //   if (carb > 0) return s + carb / 5;

// //   const sv = Number(l.servings || l.serving || l.amount || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // ผลไม้: 1 ส่วน = 15g carb
// // const calcFruitPortions = (logs) => logs.reduce((s, l) => {
// //   const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
// //   if (carb > 0) return s + carb / 15;

// //   const sv = Number(l.servings || l.serving || l.amount || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // เนื้อสัตว์: 1 ช้อนกินข้าว = 7g protein
// // const calcMeatPortions = (logs) => logs.reduce((s, l) => {
// //   const pro = Number(l.totalProtein || l.protein || l.proteins || 0);
// //   if (pro > 0) return s + pro / 7;

// //   const sv = Number(l.servings || l.serving || l.amount || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // นม: 1 แก้ว = 8g protein
// // const calcDairyPortions = (logs) => logs.reduce((s, l) => {
// //   const pro = Number(l.totalProtein || l.protein || l.proteins || 0);
// //   if (pro > 0) return s + pro / 8;

// //   const sv = Number(l.servings || l.serving || l.amount || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // น้ำตาล: 1 ช้อนชา = 4g carb
// // // const calcSugarPortions = (logs) => logs.reduce((s, l) => {
// // //   const carb = Number(l.totalCarb || l.carb || l.carbs || 0);
// // //   if (carb > 0) return s + carb / 4;

// // //   const sv = Number(l.servings || l.serving || l.amount || 0);
// // //   if (sv > 0) return s + sv;

// // //   return s;
// // // }, 0);

// // // น้ำมัน: 1 ช้อนชา = 5g fat
// // const calcFatPortions = (logs) => logs.reduce((s, l) => {
// //   const fat = Number(l.totalFat || l.fat || 0);
// //   if (fat > 0) return s + fat / 5;

// //   const sv = Number(l.servings || l.serving || l.amount || 0);
// //   if (sv > 0) return s + sv;

// //   return s;
// // }, 0);

// // // เกลือ: นับ servings ตรงๆ
// // const calcSaltPortions = (logs) => logs.reduce((s, l) =>
// //   s + Number(l.servings || l.serving || l.amount || 0), 0);

// // function MealPage() {
// //   const navigate = useNavigate();
// //   const [summary, setSummary] = useState({ kcal: 0, protein: 0, carb: 0, fat: 0 });
// //   const [userTarget, setUserTarget] = useState({ calories: 2000, protein: 100, carbs: 250, fat: 67 });
// //   const [mealBreakdown, setMealBreakdown] = useState({
// //     breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //     lunch:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //     dinner:    { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //     snack:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //   });
// //   const [consumed, setConsumed] = useState({
// //     rice: 0, vegetable: 0, fruit: 0, meat: 0, milk: 0, sugar: 0, fat: 0, salt: 0,
// //   });

// //   useEffect(() => {
// //     const currentUser = localStorage.getItem("currentUser") || "default";

// //     const userDataStr = localStorage.getItem(`userData_${currentUser}`);
// //     if (userDataStr) {
// //       const userData = JSON.parse(userDataStr);
// //       setUserTarget({
// //         calories: Number(userData.calories) || 2000,
// //         protein:  Number(userData.protein)  || 100,
// //         carbs:    Number(userData.carbs)    || 250,
// //         fat:      Number(userData.fat)      || 67,
// //       });
// //     }

// //     const getLogs = (key) =>
// //       JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");

// //     const rawRice      = getLogs("riceLogs");
// //     const rawFruit     = getLogs("fruitLogs");
// //     const rawDairy     = getLogs("dairyLogs");
// //     const rawMeat      = getLogs("meatLogs");
// //     const rawVegetable = getLogs("vegetableLogs");
// //     const rawFat       = getLogs("fatLogs");
// //     const rawDish      = getLogs("dishLogs");
// //     const rawDessert = getLogs("dessertLogs")
// //     const rawCondiment = getLogs("condimentLogs");

// //     const now      = new Date();
// //     const todayStr = now.toLocaleDateString("th-TH");
// //     const f        = (arr) => arr.filter((l) => l.date === todayStr);

// //     const todayRice      = f(rawRice);
// //     const todayFruit     = f(rawFruit);
// //     const todayDairy     = f(rawDairy);
// //     const todayMeat      = f(rawMeat);
// //     const todayVegetable = f(rawVegetable);
// //     const todayFat       = f(rawFat);
// //     const todayDish      = f(rawDish);
// //     const todayDessert   = f(rawDessert);
// //     const todayCondiment = f(rawCondiment);

// //     setConsumed({
// //       rice:      Math.round(calcRicePortions(todayRice)      * 10) / 10,
// //       vegetable: Math.round(calcVegetablePortions(todayVegetable) * 10) / 10,
// //       fruit:     Math.round(calcFruitPortions(todayFruit)    * 10) / 10,
// //       meat: Math.round(calcMeatPortions(todayMeat) * 2 * 10) / 10,
// //       milk:      Math.round(calcDairyPortions(todayDairy)    * 10) / 10,
// //     //   sugar:     Math.round(calcSugarPortions(todayDish)     * 10) / 10,
// //       fat:       Math.round(calcFatPortions(todayFat)        * 10) / 10,
// //       salt:      Math.round(calcSaltPortions(todayCondiment) * 10) / 10,
// //     });

// //     const todayLogs = [
// //       ...todayRice, ...todayFruit, ...todayDairy, ...todayMeat,
// //       ...todayVegetable, ...todayFat, ...todayDessert, ...todayDish, ...todayCondiment,
// //     ].map((log) => {
// //       const carbValue    = Number(log.totalCarb    || log.carb    || log.carbs    || 0);
// //       const proteinValue = Number(log.totalProtein || log.protein || log.proteins || 0);
// //       const fatValue     = Number(log.totalFat     || log.fat     || 0);
// //       // คำนวณ calories จาก macro ถ้าไม่มี totalCalories
// //       const kcalValue    = Number(log.totalCalories || log.calories || 0) ||
// //                           (carbValue * 4 + proteinValue * 4 + fatValue * 9);
// //       return { ...log, kcal: kcalValue, carb: carbValue, protein: proteinValue, fat: fatValue };
// //     });

// //     const totals = todayLogs.reduce(
// //       (acc, curr) => ({
// //         kcal:    acc.kcal    + (Number(curr.kcal)    || 0),
// //         protein: acc.protein + (Number(curr.protein) || 0),
// //         carb:    acc.carb    + (Number(curr.carb)    || 0),
// //         fat:     acc.fat     + (Number(curr.fat)     || 0),
// //       }),
// //       { kcal: 0, protein: 0, carb: 0, fat: 0 },
// //     );
// //     setSummary(totals);

// //     const breakdown = {
// //       breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //       lunch:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //       dinner:    { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //       snack:     { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
// //     };
// //     todayLogs.forEach((log) => {
// //       const mealId = log.mealId || "snack";
// //       if (breakdown[mealId]) {
// //         breakdown[mealId].kcal    += Number(log.kcal)    || 0;
// //         breakdown[mealId].protein += Number(log.protein) || 0;
// //         breakdown[mealId].carb    += Number(log.carb)    || 0;
// //         breakdown[mealId].fat     += Number(log.fat)     || 0;
// //         breakdown[mealId].items.push(log);
// //       }
// //     });
// //     setMealBreakdown(breakdown);
// //   }, []);

// //   const portions = getPortionsByCalories(userTarget.calories);

// //   const foodCategories = [
// //     {
// //       id: "rice",      name: "ข้าว-แป้ง",    icon: "🍚", route: "/rice-flour",
// //       target: portions.rice,      consumed: consumed.rice,      unit: "ทัพพี",
// //       gradient: "linear-gradient(135deg,#FDE68A 0%,#FEF3C7 100%)",
// //       shadowColor: "rgba(245,158,11,0.15)",
// //     },
// //     {
// //       id: "vegetable",  name: "ผัก",          icon: "🥬", route: "/vegetable",
// //       target: portions.vegetable, consumed: consumed.vegetable,  unit: "ทัพพี",
// //       gradient: "linear-gradient(135deg,#A7F3D0 0%,#D1FAE5 100%)",
// //       shadowColor: "rgba(34,197,94,0.15)",
// //     },
// //     {
// //       id: "fruit",      name: "ผลไม้",        icon: "🍎", route: "/fruit",
// //       target: portions.fruit,     consumed: consumed.fruit,      unit: "ส่วน",
// //       gradient: "linear-gradient(135deg,#FCA5A5 0%,#FECDD3 100%)",
// //       shadowColor: "rgba(244,63,94,0.15)",
// //     },
// //     {
// //       id: "meat",       name: "เนื้อสัตว์",   icon: "🥩", route: "/meat",
// //       target: portions.meat,      consumed: consumed.meat,       unit: "ช้อนกินข้าว",
// //       gradient: "linear-gradient(135deg,#FDD19A 0%,#FEE9C8 100%)",
// //       shadowColor: "rgba(234,88,12,0.15)",
// //     },
// //     {
// //       id: "dairy",      name: "นม",           icon: "🥛", route: "/dairy",
// //       target: portions.milk,      consumed: consumed.milk,       unit: "แก้ว",
// //       gradient: "linear-gradient(135deg,#BAD8FD 0%,#DBEAFE 100%)",
// //       shadowColor: "rgba(59,130,246,0.15)",
// //     },
// //     {
// //       id: "sugar",      name: "น้ำตาล",       icon: "🍬", route: "/single-dish",
// //       target: portions.sugar,     consumed: consumed.sugar,      unit: "ช้อนชา", isLimit: true,
// //       gradient: "linear-gradient(135deg,#F0ABFC 0%,#FAD1FF 100%)",
// //       shadowColor: "rgba(217,70,239,0.15)",
// //     },
// //     {
// //       id: "fat",        name: "น้ำมัน",       icon: "🧈", route: "/fat",
// //       target: portions.fat,       consumed: consumed.fat,        unit: "ช้อนชา", isLimit: true,
// //       gradient: "linear-gradient(135deg,#FEF08A 0%,#FEF9C3 100%)",
// //       shadowColor: "rgba(234,179,8,0.15)",
// //     },
// //     {
// //       id: "salt",       name: "เกลือ", icon: "🧂", route: "/condiment",
// //       target: portions.salt,      consumed: consumed.salt,       unit: "ช้อนชา", isLimit: true,
// //       gradient: "linear-gradient(135deg,#CBD5E1 0%,#EEF2F6 100%)",
// //       shadowColor: "rgba(100,116,139,0.15)",
// //     },
// //   ];

// //   const meals = [
// //     { id: "breakfast", name: "มื้อเช้า",  icon: "🌅", gradient: "linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%)", borderColor: "#FCD9A0" },
// //     { id: "lunch",     name: "มื้อเที่ยง", icon: "☀️", gradient: "linear-gradient(135deg,#DBEAFE 0%,#BAD8FD 100%)", borderColor: "#93D8FF" },
// //     { id: "dinner",    name: "มื้อเย็น",  icon: "🌙", gradient: "linear-gradient(135deg,#EDE9FE 0%,#DDD6FE 100%)", borderColor: "#C4B5FD" },
// //     { id: "snack",     name: "มื้อว่าง",  icon: "🍪", gradient: "linear-gradient(135deg,#FCE7F3 0%,#FBCFE8 100%)", borderColor: "#F9A8D4" },
// //   ];

// // //   const handleFoodClick = (category) => {
// // //     navigate(`${category.route}?mealId=breakfast&mealName=${encodeURIComponent("มื้อเช้า")}`);
// // //   };
// //   const handleMealClick = (meal) => {
// //     navigate(`/food-log?mealId=${meal.id}&mealName=${encodeURIComponent(meal.name)}`);
// //   };

// //   return (
// //     <div style={{ width: "100vw", minHeight: "100vh", background: "linear-gradient(135deg,#B7C7FF 0%,#E5D4FB 100%)", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
// //       <div style={{ maxWidth: "600px", width: "100%", minHeight: "100vh" }}>
// //         <div style={{ background: "white", minHeight: "100vh" }}>
// //           <Header title="สรุปโภชนาการวันนี้" backTo="/menu" />

// //           <div style={{ padding: "15px" }}>

// //             {/* ── Summary ─────────────────────────── */}
// //             <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "12px", marginBottom: "20px" }}>
// //               <div style={{ background: "linear-gradient(135deg,#A5B4FC 0%,#C4B5FD 100%)", borderRadius: "16px", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 4px 15px rgba(102,126,234,0.15)" }}>
// //                 <div style={{ fontSize: "0.6rem", color: "rgba(60,40,120,0.75)", marginBottom: "4px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>พลังงานรวม</div>
// //                 <div style={{ display: "flex", alignItems: "baseline", marginBottom: "4px" }}>
// //                   <span style={{ fontSize: "1.7rem", fontWeight: "800", color: "rgba(40,20,100,0.85)", letterSpacing: "-1px", lineHeight: "1" }}>{Math.round(summary.kcal)}</span>
// //                   <span style={{ marginLeft: "4px", color: "rgba(60,40,120,0.5)", fontSize: "0.75rem", fontWeight: "600" }}>/ {userTarget.calories}</span>
// //                 </div>
// //                 <div style={{ fontSize: "0.65rem", color: "rgba(60,40,120,0.65)", fontWeight: "700", marginBottom: "8px" }}>kcal</div>
// //                 <div style={{ width: "100%", height: "6px", background: "rgba(80,40,160,0.12)", borderRadius: "10px", overflow: "hidden" }}>
// //                   <div style={{ width: `${Math.min((summary.kcal / userTarget.calories) * 100, 100)}%`, height: "100%", background: summary.kcal > userTarget.calories ? "linear-gradient(90deg,#FF6B9D,#FF85A7)" : "linear-gradient(90deg,#48BB78,#68D391)", borderRadius: "10px", transition: "width 0.5s ease" }} />
// //                 </div>
// //               </div>

// //               <div style={{ display: "grid", gridTemplateRows: "1fr 1fr 1fr", gap: "8px" }}>
// //                 <MacroBox label="คาร์โบไฮเดรต"   value={Math.round(summary.carb)}    target={userTarget.carbs}   unit="g" gradient="linear-gradient(135deg,#FCD9A0 0%,#FDE4BA 100%)" color="#FCD9A0" />
// //                 <MacroBox label="โปรตีน" value={Math.round(summary.protein)} target={userTarget.protein} unit="g" gradient="linear-gradient(135deg,#FBACCA 0%,#FCC2D7 100%)" color="#FBACCA" />
// //                 <MacroBox label="ไขมัน"  value={Math.round(summary.fat)}     target={userTarget.fat}     unit="g" gradient="linear-gradient(135deg,#93D8FF 0%,#BAE8FF 100%)" color="#93D8FF" />
// //               </div>
// //             </div>

// //             {/* ── Food Categories ──────────────────── */}
// //             <div style={{ marginTop: "28px" }}>
// //               <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d3748", marginBottom: "12px" }}>
// //                 สัดส่วนอาหารที่แนะนำต่อวัน
// //               </h3>

// //               {/* Top 3 */}
// //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
// //                 {foodCategories.slice(0, 3).map((cat) => (
// //                   <FoodProgressCard key={cat.id} category={cat} />
// //                 ))}
// //               </div>

// //               {/* Bottom 5 */}
// //               <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
// //                 {foodCategories.slice(3).map((cat) => (
// //                   <FoodProgressCard key={cat.id} category={cat} compact />
// //                 ))}
// //               </div>
// //             </div>

// //             {/* ── Meals ───────────────────────────── */}
// //             <div style={{ marginTop: "30px" }}>
// //               <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#2d3748", marginBottom: "15px" }}>เริ่มบันทึกมื้ออาหาร</h3>
// //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
// //                 {meals.map((meal) => {
// //                   const mealData = mealBreakdown[meal.id];
// //                   const hasData  = mealData && mealData.kcal > 0;
// //                   return (
// //                     <div key={meal.id} onClick={() => handleMealClick(meal)} style={{ background: "white", borderRadius: "16px", padding: "20px 15px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: `3px solid ${meal.borderColor}`, position: "relative", overflow: "hidden" }}>
// //                       <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: meal.gradient }} />
// //                       <div style={{ fontSize: "3rem", marginBottom: "8px", textAlign: "center" }}>{meal.icon}</div>
// //                       <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: "700", color: "#2d3748", textAlign: "center" }}>{meal.name}</h3>
// //                       {hasData ? (
// //                         <div style={{ textAlign: "center" }}>
// //                           <div style={{ fontWeight: "700", color: "#2D3748", fontSize: "0.9rem" }}>{Math.round(mealData.kcal)} kcal</div>
// //                           <div style={{ fontSize: "0.7rem", marginTop: "2px", color: "#A0AEC0" }}>{mealData.items.length} รายการ</div>
// //                         </div>
// //                       ) : (
// //                         <div style={{ fontSize: "0.7rem", color: "#CBD5E0", fontWeight: "600", textAlign: "center" }}>ยังไม่มีรายการ</div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>

// //             {/* Tip */}
// //             <div style={{ marginTop: "20px", padding: "12px", background: "#FEF9C3", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
// //               <span style={{ fontSize: "1.2rem" }}>💡</span>
// //               <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E", fontWeight: "600" }}>คลิกที่มื้ออาหารเพื่อเพิ่มหรือดูรายการ</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── MacroBox ────────────────────────────────────────────────────────────────
// // function MacroBox({ label, value, target, unit, gradient, color }) {
// //   const percentage = Math.min((value / target) * 100, 100);
// //   const isOver     = value > target;
// //   return (
// //     <div style={{ background: gradient, borderRadius: "12px", padding: "12px", boxShadow: `0 3px 12px ${color}40`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
// //       <div style={{ fontSize: "0.65rem", color: "rgba(40,40,80,0.75)", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
// //       <div style={{ display: "flex", alignItems: "baseline", marginBottom: "6px" }}>
// //         <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "rgba(30,30,70,0.85)", lineHeight: "1" }}>{value}</span>
// //         <span style={{ fontSize: "0.7rem", color: "rgba(40,40,80,0.5)", fontWeight: "600", marginLeft: "3px" }}>/{target}</span>
// //         <span style={{ fontSize: "0.65rem", color: "rgba(40,40,80,0.5)", marginLeft: "4px" }}>{unit}</span>
// //       </div>
// //       <div style={{ width: "100%", height: "4px", background: "rgba(40,40,80,0.12)", borderRadius: "10px", overflow: "hidden" }}>
// //         <div style={{ width: `${percentage}%`, height: "100%", background: isOver ? "#EF4444" : "rgba(40,40,100,0.35)", borderRadius: "10px", transition: "width 0.5s ease" }} />
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── FoodProgressCard ────────────────────────────────────────────────────────
// // function FoodProgressCard({ category, compact }) {
// //   const { consumed: eaten = 0, target, unit, name, icon, gradient, shadowColor } = category;
// //   const pct    = target > 0 ? Math.min((eaten / target) * 100, 100) : 0;
// //   const isOver = eaten > target;

// //   return (
// //     <div
// //       style={{
// //         background: gradient,
// //         borderRadius: "14px",
// //         padding: compact ? "10px 6px" : "14px 12px",
// //         cursor: "default",
// //         boxShadow: `0 4px 14px ${shadowColor || "rgba(0,0,0,0.12)"}`,
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         minHeight: compact ? "118px" : "148px",
// //       }}
// //     >
// //       {/* Icon */}
// //       <div style={{ fontSize: compact ? "1.6rem" : "2rem", marginBottom: compact ? "3px" : "5px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
// //         {icon}
// //       </div>

// //       {/* Category name */}
// //       <div style={{ fontSize: compact ? "0.58rem" : "0.72rem", fontWeight: "700", color: "rgba(50,50,80,0.9)", textAlign: "center", marginBottom: compact ? "4px" : "6px", lineHeight: "1.2" }}>
// //         {name}
// //       </div>

// //       {/* X/Y count */}
// //       <div style={{ display: "flex", alignItems: "baseline", marginBottom: compact ? "4px" : "6px" }}>
// //         <span style={{ fontSize: compact ? "1.05rem" : "1.3rem", fontWeight: "800", color: isOver ? "#DC2626" : "rgba(30,30,60,0.85)", lineHeight: "1", transition: "color 0.3s" }}>
// //           {eaten}
// //         </span>
// //         <span style={{ fontSize: compact ? "0.55rem" : "0.65rem", color: "rgba(30,30,60,0.5)", fontWeight: "600", marginLeft: "2px" }}>
// //           /{target}
// //         </span>
// //       </div>

// //       {/* Unit badge */}
// //       <div style={{ fontSize: compact ? "0.42rem" : "0.52rem", color: "rgba(30,30,60,0.6)", fontWeight: "600", background: "rgba(30,30,60,0.08)", padding: "1px 7px", borderRadius: "20px", marginBottom: compact ? "5px" : "7px" }}>
// //         {unit}
// //       </div>

// //       {/* Progress bar */}
// //       <div style={{ width: "100%", height: "4px", background: "rgba(30,30,60,0.1)", borderRadius: "10px", overflow: "hidden" }}>
// //         <div style={{ width: `${pct}%`, height: "100%", background: isOver ? "#EF4444" : "rgba(30,30,80,0.3)", borderRadius: "10px", transition: "width 0.5s ease" }} />
// //       </div>
// //     </div>
// //   );
// // }

// // export default MealPage;

// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Background from "../components/Background";
// import Footer from "../components/Footer";

// // ─── สัดส่วนอาหารตาม calorie tier ───────────────────────────────────
// function getPortionsByCalories(cal) {
//   if (cal <= 1300)
//     return {
//       rice: 6,
//       vegetable: 6,
//       fruit: 3,
//       meat: 5,
//       milk: 1,
//       sugar: 3,
//       fat: 3,
//       salt: 1,
//     };
//   else if (cal <= 1500)
//     return {
//       rice: 7,
//       vegetable: 6,
//       fruit: 3,
//       meat: 5,
//       milk: 1,
//       sugar: 3,
//       fat: 3,
//       salt: 1,
//     };
//   else if (cal <= 1700)
//     return {
//       rice: 8,
//       vegetable: 6,
//       fruit: 3,
//       meat: 6,
//       milk: 1,
//       sugar: 3,
//       fat: 5,
//       salt: 1,
//     };
//   else if (cal <= 1900)
//     return {
//       rice: 9,
//       vegetable: 6,
//       fruit: 4,
//       meat: 7,
//       milk: 1,
//       sugar: 3,
//       fat: 6,
//       salt: 1,
//     };
//   else
//     return {
//       rice: 10,
//       vegetable: 6,
//       fruit: 4,
//       meat: 8,
//       milk: 1,
//       sugar: 3,
//       fat: 6,
//       salt: 1,
//     };
// }

// // ─── Portion calculators ─────────────────────────────────────────────
// const calcRicePortions = (logs) =>
//   logs.reduce((s, l) => {
//     const c = Number(l.totalCarb || l.carb || l.carbs || 0);
//     return c > 0
//       ? s + c / 18
//       : s + Number(l.servings || l.serving || l.amount || l.portions || 0);
//   }, 0);
// const calcVegetablePortions = (logs) =>
//   logs.reduce((s, l) => {
//     // ถ้ามี items array (vegetableLogs format) — นับ portion ของแต่ละ item โดยตรง
//     if (Array.isArray(l.items) && l.items.length > 0) {
//       return (
//         s + l.items.reduce((sum, item) => sum + Number(item.portion || 0), 0)
//       );
//     }
//     // fallback: คำนวณจาก carb หรือ servings
//     const c = Number(l.totalCarb || l.carb || l.carbs || 0);
//     if (c > 0) return s + c / 5;
//     return s + Number(l.servings || l.serving || l.amount || 0);
//   }, 0);
// const calcFruitPortions = (logs) =>
//   logs.reduce((s, l) => {
//     const c = Number(l.totalCarb || l.carb || l.carbs || 0);
//     return c > 0
//       ? s + c / 15
//       : s + Number(l.servings || l.serving || l.amount || 0);
//   }, 0);
// const calcMeatPortions = (logs) =>
//   logs.reduce((s, l) => {
//     const p = Number(l.totalProtein || l.protein || l.proteins || 0);
//     return p > 0
//       ? s + p / 7
//       : s + Number(l.servings || l.serving || l.amount || 0);
//   }, 0);
// const calcDairyPortions = (logs) =>
//   logs.reduce((s, l) => {
//     const p = Number(l.totalProtein || l.protein || l.proteins || 0);
//     return p > 0
//       ? s + p / 8
//       : s + Number(l.servings || l.serving || l.amount || 0);
//   }, 0);
// const calcFatPortions = (logs) =>
//   logs.reduce((s, l) => {
//     const f = Number(l.totalFat || l.fat || 0);
//     return f > 0
//       ? s + f / 5
//       : s + Number(l.servings || l.serving || l.amount || 0);
//   }, 0);
// const calcSaltPortions = (logs) =>
//   logs.reduce(
//     (s, l) => s + Number(l.servings || l.serving || l.amount || 0),
//     0,
//   );

// // ─── Today's date in Thai ────────────────────────────────────────────
// function getTodayThai() {
//   const now = new Date();
//   return now.toLocaleDateString("th-TH", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// }

// export default function MealPage() {
//   const navigate = useNavigate();
//   const [summary, setSummary] = useState({
//     kcal: 0,
//     protein: 0,
//     carb: 0,
//     fat: 0,
//   });
//   const [userTarget, setUserTarget] = useState({
//     calories: 2000,
//     protein: 100,
//     carbs: 250,
//     fat: 67,
//   });
//   const [mealBreakdown, setMealBreakdown] = useState({
//     breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//     lunch: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//     dinner: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//     snack: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//   });
//   const [consumed, setConsumed] = useState({
//     rice: 0,
//     vegetable: 0,
//     fruit: 0,
//     meat: 0,
//     milk: 0,
//     sugar: 0,
//     fat: 0,
//     salt: 0,
//   });

//   useEffect(() => {
//     const currentUser = localStorage.getItem("currentUser") || "default";
//     const userDataStr = localStorage.getItem(`userData_${currentUser}`);
//     if (userDataStr) {
//       const ud = JSON.parse(userDataStr);

//       setUserTarget({
//         calories: Number(ud.calories) || 2000,
//         protein: Number(ud.protein) || 100,
//         carbs: Number(ud.carbs) || 250,
//         fat: Number(ud.fat) || 67,
//       });
//     }

//     const getLogs = (key) =>
//       JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");
//     const todayStr = new Date().toLocaleDateString("th-TH");
//     const f = (arr) => arr.filter((l) => l.date === todayStr);

//     const todayRice = f(getLogs("riceLogs"));
//     const todayFruit = f(getLogs("fruitLogs"));
//     const todayDairy = f(getLogs("dairyLogs"));
//     const todayMeat = f(getLogs("meatLogs"));
//     const todayVegetable = f(getLogs("vegetableLogs"));
//     const todayFat = f(getLogs("fatLogs"));
//     const todayDish = f(getLogs("dishLogs"));
//     const todayDessert = f(getLogs("dessertLogs"));
//     const todayCondiment = f(getLogs("condimentLogs"));

//     setConsumed({
//       rice: Math.round(calcRicePortions(todayRice) * 10) / 10,
//       vegetable: Math.round(calcVegetablePortions(todayVegetable) * 10) / 10,
//       fruit: Math.round(calcFruitPortions(todayFruit) * 10) / 10,
//       meat: Math.round(calcMeatPortions(todayMeat) * 2 * 10) / 10,
//       milk: Math.round(calcDairyPortions(todayDairy) * 10) / 10,
//       fat: Math.round(calcFatPortions(todayFat) * 10) / 10,
//       salt: Math.round(calcSaltPortions(todayCondiment) * 10) / 10,
//       sugar: 0,
//     });

//     const allLogs = [
//       ...todayRice,
//       ...todayFruit,
//       ...todayDairy,
//       ...todayMeat,
//       ...todayVegetable,
//       ...todayFat,
//       ...todayDessert,
//       ...todayDish,
//       ...todayCondiment,
//     ].map((log) => {
//       const carb = Number(log.totalCarb || log.carb || log.carbs || 0);
//       const protein = Number(
//         log.totalProtein || log.protein || log.proteins || 0,
//       );
//       const fat = Number(log.totalFat || log.fat || 0);
//       const kcal =
//         Number(log.totalCalories || log.calories || 0) ||
//         carb * 4 + protein * 4 + fat * 9;
//       return { ...log, kcal, carb, protein, fat };
//     });

//     setSummary(
//       allLogs.reduce(
//         (acc, l) => ({
//           kcal: acc.kcal + l.kcal,
//           protein: acc.protein + l.protein,
//           carb: acc.carb + l.carb,
//           fat: acc.fat + l.fat,
//         }),
//         { kcal: 0, protein: 0, carb: 0, fat: 0 },
//       ),
//     );

//     const bd = {
//       breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//       lunch: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//       dinner: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//       snack: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
//     };
//     allLogs.forEach((log) => {
//       const m = log.mealId || "snack";
//       if (bd[m]) {
//         bd[m].kcal += log.kcal;
//         bd[m].protein += log.protein;
//         bd[m].carb += log.carb;
//         bd[m].fat += log.fat;
//         bd[m].items.push(log);
//       }
//     });
//     setMealBreakdown(bd);
//   }, []);

//   const portions = getPortionsByCalories(userTarget.calories);
//   const kcalPct = Math.min((summary.kcal / userTarget.calories) * 100, 100);
//   const isKcalOver = summary.kcal > userTarget.calories;

//   const foodCategories = [
//     {
//       id: "rice",
//       name: "ข้าว - แป้ง",
//       icon: "🍚",
//       unit: "ทัพพี",
//       target: portions.rice,
//       consumed: consumed.rice,
//       color: "#2CB9A8",
//     },
//     {
//       id: "vegetable",
//       name: "ผัก",
//       icon: "🥬",
//       unit: "ทัพพี",
//       target: portions.vegetable,
//       consumed: consumed.vegetable,
//       color: "#2CB9A8",
//     },
//     {
//       id: "fruit",
//       name: "ผลไม้",
//       icon: "🍎",
//       unit: "ส่วน",
//       target: portions.fruit,
//       consumed: consumed.fruit,
//       color: "#2CB9A8",
//     },
//     {
//       id: "meat",
//       name: "เนื้อสัตว์",
//       icon: "🥩",
//       unit: "ช้อนกินข้าว",
//       target: portions.meat,
//       consumed: consumed.meat,
//       color: "#2CB9A8",
//     },
//     {
//       id: "dairy",
//       name: "นม",
//       icon: "🥛",
//       unit: "แก้ว",
//       target: portions.milk,
//       consumed: consumed.milk,
//       color: "#2CB9A8",
//     },
//     {
//       id: "sugar",
//       name: "น้ำตาล",
//       icon: "🍬",
//       unit: "ช้อนชา",
//       target: portions.sugar,
//       consumed: consumed.sugar,
//       color: "#2CB9A8",
//       isLimit: true,
//     },
//     {
//       id: "fat",
//       name: "น้ำมัน",
//       icon: "🧈",
//       unit: "ช้อนชา",
//       target: portions.fat,
//       consumed: consumed.fat,
//       color: "#2CB9A8",
//       isLimit: true,
//     },
//     {
//       id: "salt",
//       name: "เกลือ",
//       icon: "🧂",
//       unit: "ช้อนชา",
//       target: portions.salt,
//       consumed: consumed.salt,
//       color: "#2CB9A8",
//       isLimit: true,
//     },
//   ];

//   const meals = [
//     { id: "breakfast", name: "มื้อเช้า", icon: "🌤️" },
//     { id: "lunch", name: "มื้อกลางวัน", icon: "⛅" },
//     { id: "dinner", name: "มื้อเย็น", icon: "🌙" },
//   ];

//   return (
//     <Background>
//       <div style={s.wrapper}>
//         <Header title="สรุปโภชนาการวันนี้" backTo="/menu" />
//         <div style={s.container}>
//           {/* ── Top bar ── */}
//           <div style={s.topBar}>
//             <div>
//               <div style={s.brand}>
//                 <span style={s.brandBold}>Smart</span>
//                 <span style={s.brandAccent}>DM</span>
//               </div>
//               <div style={s.dateText}>วันนี้ {getTodayThai()}</div>
//             </div>
//           </div>

//           {/* ── Calorie card ── */}
//           <div style={s.calorieCard}>
//             <div style={s.calorieTitle}>พลังงานรวม</div>
//             <div style={s.calorieRow}>
//               <span style={s.calorieNum}>
//                 {Math.round(summary.kcal).toLocaleString()}
//               </span>
//               <span style={s.calorieOf}>
//                 {" "}
//                 / {userTarget.calories.toLocaleString()} kcal
//               </span>
//               <span
//                 style={{
//                   ...s.caloriePct,
//                   color: isKcalOver ? "#EF4444" : "#2CB9A8",
//                 }}
//               >
//                 {Math.round(kcalPct)}%
//               </span>
//             </div>
//             <ProgressBar
//               pct={kcalPct}
//               color={isKcalOver ? "#EF4444" : "#2CB9A8"}
//               height={10}
//             />

//             <div style={s.macroList}>
//               <MacroRow
//                 label="คาร์บ"
//                 value={Math.round(summary.carb)}
//                 target={userTarget.carbs}
//                 unit="g"
//                 color="#2CB9A8"
//               />
//               <MacroRow
//                 label="โปรตีน"
//                 value={Math.round(summary.protein)}
//                 target={userTarget.protein}
//                 unit="g"
//                 color="#2CB9A8"
//               />
//               <MacroRow
//                 label="ไขมัน"
//                 value={Math.round(summary.fat)}
//                 target={userTarget.fat}
//                 unit="g"
//                 color="#2CB9A8"
//               />
//             </div>
//           </div>

//           {/* ── Food categories (2-col grid) ── */}
//           <div style={s.grid2}>
//             {foodCategories.map((cat) => (
//               <FoodCard key={cat.id} cat={cat} />
//             ))}
//           </div>

//           {/* ── Meals ── */}
//           <div style={s.sectionCard}>
//             <div style={s.sectionTitle}>บันทึกตามมื้อ</div>
//             <div style={s.mealRow}>
//               {meals.map((meal) => {
//                 const md = mealBreakdown[meal.id];
//                 const hasData = md && md.kcal > 0;
//                 return (
//                   <div
//                     key={meal.id}
//                     style={s.mealItem}
//                     onClick={() =>
//                       navigate(
//                         `/food-log?mealId=${meal.id}&mealName=${encodeURIComponent(meal.name)}`,
//                       )
//                     }
//                   >
//                     <span style={s.mealIcon}>{meal.icon}</span>
//                     <div style={s.mealName}>{meal.name}</div>
//                     <div style={s.mealSub}>
//                       {hasData ? `${Math.round(md.kcal)} kcal` : "+ เพิ่ม"}
//                     </div>
//                   </div>
//                 );
//               })}
//               {/* snack as "+ เพิ่ม" */}
//               <div
//                 style={s.mealItem}
//                 onClick={() =>
//                   navigate(
//                     `/food-log?mealId=snack&mealName=${encodeURIComponent("มื้อว่าง")}`,
//                   )
//                 }
//               >
//                 <span style={s.mealIcon}>🍪</span>
//                 <div style={s.mealName}>มื้อว่าง</div>
//                 <div style={s.mealSub}>
//                   {mealBreakdown.snack?.kcal > 0
//                     ? `${Math.round(mealBreakdown.snack.kcal)} kcal`
//                     : "+ เพิ่ม"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── AI insight placeholder ── */}
//           <div style={s.insightCard}>
//             <div style={s.insightHeader}>
//               <span style={s.insightIcon}>🤖</span>
//               <span style={s.insightTitle}>วิเคราะห์วันนี้</span>
//             </div>
//             <div style={s.insightGrid}>
//               <InsightItem
//                 status={getStatus(
//                   summary.carb,
//                   userTarget.carbs * 0.5,
//                   userTarget.carbs,
//                 )}
//                 label="คาร์บ"
//                 good="เหมาะสม"
//                 low="ยังน้อย"
//                 bad="เกินเกณฑ์"
//               />
//               <InsightItem
//                 status={getStatus(
//                   consumed.fruit,
//                   portions.fruit * 0.7,
//                   portions.fruit * 1.5,
//                 )}
//                 label="ผลไม้"
//                 good="เพียงพอ"
//                 low="ยังน้อย"
//                 bad="มากเกิน"
//               />
//               <InsightItem
//                 status={getStatus(
//                   summary.protein,
//                   userTarget.protein * 0.8,
//                   userTarget.protein * 1.3,
//                 )}
//                 label="โปรตีน"
//                 good="เพียงพอ"
//                 low="ยังน้อย"
//                 bad="เกินเกณฑ์"
//               />
//               <InsightItem
//                 status={getStatus(
//                   consumed.vegetable,
//                   portions.vegetable * 0.7,
//                   portions.vegetable * 1.5,
//                 )}
//                 label="ผัก"
//                 good="เพียงพอ"
//                 low="ยังน้อย"
//                 bad="มากเกิน"
//               />
//             </div>
//           </div>

//           <div style={{ height: 24 }} />
//         </div>
//         {/* container */}
//       </div>
//       {/* wrapper */}
//       <Footer />
//     </Background>
//   );
// }

// // ─── Sub-components ──────────────────────────────────────────────────

// function ProgressBar({ pct, color, height = 6 }) {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height,
//         background: "#E8F4F2",
//         borderRadius: 99,
//         overflow: "hidden",
//         marginTop: 6,
//       }}
//     >
//       <div
//         style={{
//           width: `${Math.min(pct, 100)}%`,
//           height: "100%",
//           background: color,
//           borderRadius: 99,
//           transition: "width 0.5s ease",
//         }}
//       />
//     </div>
//   );
// }

// function MacroRow({ label, value, target, unit, color }) {
//   const pct = Math.min((value / target) * 100, 100);
//   const isOver = value > target;
//   return (
//     <div style={{ marginTop: 10 }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "baseline",
//           marginBottom: 4,
//         }}
//       >
//         <span
//           style={{ fontSize: "0.82rem", color: "#5C7C7A", fontWeight: 600 }}
//         >
//           {label}
//         </span>
//         <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
//           <span
//             style={{
//               fontSize: "0.82rem",
//               fontWeight: 700,
//               color: isOver ? "#EF4444" : "#2d3748",
//             }}
//           >
//             {value}
//             {unit}
//           </span>
//           <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
//             /{target}
//             {unit}
//           </span>
//           <span
//             style={{
//               fontSize: "0.72rem",
//               fontWeight: 700,
//               color: isOver ? "#EF4444" : color,
//               marginLeft: 6,
//             }}
//           >
//             {Math.round(pct)}%
//           </span>
//         </div>
//       </div>
//       <ProgressBar pct={pct} color={isOver ? "#EF4444" : color} height={6} />
//     </div>
//   );
// }

// function FoodCard({ cat }) {
//   const { name, icon, unit, target, consumed: eaten = 0, color } = cat;
//   const pct = target > 0 ? Math.min((eaten / target) * 100, 100) : 0;
//   const isOver = eaten > target;
//   const barColor = isOver ? "#EF4444" : color;

//   return (
//     <div style={s.foodCard}>
//       <div style={s.foodNameRow}>
//         <span style={s.foodName}>{name}</span>
//         <span style={s.foodEmoji}>{icon}</span>
//       </div>
//       <div style={s.foodCount}>
//         <span style={{ ...s.foodEaten, color: isOver ? "#EF4444" : "#1a202c" }}>
//           {eaten}
//         </span>
//         <span style={s.foodOf}>
//           {" "}
//           / {target} {unit}
//         </span>
//       </div>
//       <ProgressBar pct={pct} color={barColor} height={5} />
//     </div>
//   );
// }

// // status: "ok" | "low" | "over"
// function getStatus(value, minThreshold, maxThreshold) {
//   if (value < minThreshold) return "low";
//   if (value > maxThreshold) return "over";
//   return "ok";
// }

// function InsightItem({ status, label, good, low, bad }) {
//   const icon = status === "ok" ? "✅" : "⚠️";
//   const text = status === "ok" ? good : status === "low" ? low : bad;
//   const color =
//     status === "ok" ? "#2CB9A8" : status === "low" ? "#9CA3AF" : "#EF4444";
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//       <span style={{ fontSize: "1rem" }}>{icon}</span>
//       <span style={{ fontSize: "0.78rem", color: "#4A5568", fontWeight: 600 }}>
//         {label} <span style={{ color }}>{text}</span>
//       </span>
//     </div>
//   );
// }

// // ─── Styles ──────────────────────────────────────────────────────────

// const s = {
//   page: {
//     width: "100vw",
//     minHeight: "100vh",
//     background: "#EEF4F3",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
//   },
//   wrapper: {
//     maxWidth: 480,
//     width: "100%",
//     minHeight: "100vh",
//     background: "#EEF4F3",
//     display: "flex",
//     flexDirection: "column",
//   },
//   container: {
//     flex: 1,
//     padding: "0 16px 16px",
//   },

//   // top bar
//   topBar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "20px 0 14px",
//   },
//   brand: { fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 },
//   brandBold: { color: "#1a3a38" },
//   brandAccent: { color: "#2CB9A8" },
//   dateText: {
//     fontSize: "0.85rem",
//     color: "#5C7C7A",
//     marginTop: 2,
//     fontWeight: 600,
//   },
//   hospitalBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     background: "white",
//     borderRadius: 12,
//     padding: "8px 12px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//   },
//   hospitalIcon: { fontSize: "1.1rem" },
//   hospitalName: { fontSize: "0.75rem", fontWeight: 700, color: "#2CB9A8" },

//   // calorie card
//   calorieCard: {
//     background: "white",
//     borderRadius: 20,
//     padding: "20px 20px 16px",
//     marginBottom: 14,
//     boxShadow: "0 4px 16px rgba(44,185,168,0.08)",
//   },
//   calorieTitle: {
//     fontSize: "0.8rem",
//     fontWeight: 700,
//     color: "#9CA3AF",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//     marginBottom: 6,
//   },
//   calorieRow: { display: "flex", alignItems: "baseline", gap: 0 },
//   calorieNum: {
//     fontSize: "2.2rem",
//     fontWeight: 800,
//     color: "#1a202c",
//     letterSpacing: -1,
//   },
//   calorieOf: {
//     fontSize: "0.9rem",
//     color: "#9CA3AF",
//     fontWeight: 600,
//     marginLeft: 4,
//   },
//   caloriePct: { marginLeft: "auto", fontSize: "1.1rem", fontWeight: 800 },
//   macroList: { marginTop: 8 },

//   // food grid
//   grid2: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 12,
//     marginBottom: 14,
//   },
//   foodCard: {
//     background: "white",
//     borderRadius: 16,
//     padding: "10px 14px",
//     display: "flex",
//     flexDirection: "column",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//   },
//   foodCardLeft: { flex: 1 },
//   foodNameRow: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   foodName: { fontSize: "0.82rem", fontWeight: 700, color: "#5C7C7A" },
//   foodCount: { marginBottom: 6 },
//   foodEaten: { fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 },
//   foodOf: { fontSize: "0.7rem", color: "#9CA3AF", fontWeight: 600 },
//   foodEmoji: { fontSize: "1.8rem", flexShrink: 0 },

//   // meals
//   sectionCard: {
//     background: "white",
//     borderRadius: 20,
//     padding: "16px",
//     marginBottom: 14,
//     boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//   },
//   sectionTitle: {
//     fontSize: "0.9rem",
//     fontWeight: 700,
//     color: "#1a202c",
//     marginBottom: 14,
//   },
//   mealRow: { display: "flex", gap: 8, justifyContent: "space-between" },
//   mealItem: {
//     flex: 1,
//     background: "#F8FFFE",
//     border: "1.5px solid #E0F2F0",
//     borderRadius: 14,
//     padding: "12px 6px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   },
//   mealIcon: { fontSize: "1.5rem", marginBottom: 4 },
//   mealName: {
//     fontSize: "0.65rem",
//     fontWeight: 700,
//     color: "#5C7C7A",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   mealSub: { fontSize: "0.65rem", fontWeight: 700, color: "#2CB9A8" },

//   // insight
//   insightCard: {
//     background: "white",
//     borderRadius: 20,
//     padding: "16px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//   },
//   insightHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 12,
//   },
//   insightIcon: { fontSize: "1.2rem" },
//   insightTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#1a202c" },
//   insightGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
// };

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import Footer from "../components/Footer";

// ─── Constants ────────────────────────────────

const LOG_KEYS = [
  "riceLogs",
  "fruitLogs",
  "dairyLogs",
  "meatLogs",
  "vegetableLogs",
  "fatLogs",
  "dessertLogs",
  "dishLogs",
  "condimentLogs",
];

// ─── Portion calculators ──────────────────────

function getPortionsByCalories(cal) {
  if (cal <= 1300)
    return {
      rice: 6,
      vegetable: 6,
      fruit: 3,
      meat: 5,
      milk: 1,
      sugar: 3,
      fat: 3,
      salt: 1,
    };
  if (cal <= 1500)
    return {
      rice: 7,
      vegetable: 6,
      fruit: 3,
      meat: 5,
      milk: 1,
      sugar: 3,
      fat: 3,
      salt: 1,
    };
  if (cal <= 1700)
    return {
      rice: 8,
      vegetable: 6,
      fruit: 3,
      meat: 6,
      milk: 1,
      sugar: 3,
      fat: 5,
      salt: 1,
    };
  if (cal <= 1900)
    return {
      rice: 9,
      vegetable: 6,
      fruit: 4,
      meat: 7,
      milk: 1,
      sugar: 3,
      fat: 6,
      salt: 1,
    };
  return {
    rice: 10,
    vegetable: 6,
    fruit: 4,
    meat: 8,
    milk: 1,
    sugar: 3,
    fat: 6,
    salt: 1,
  };
}

const calcRicePortions = (logs) =>
  logs.reduce((s, l) => {
    const c = Number(l.totalCarb || l.carb || l.carbs || 0);
    return c > 0
      ? s + c / 18
      : s + Number(l.servings || l.serving || l.amount || l.portions || 0);
  }, 0);
const calcVegetablePortions = (logs) =>
  logs.reduce((s, l) => {
    if (Array.isArray(l.items) && l.items.length > 0)
      return (
        s + l.items.reduce((sum, item) => sum + Number(item.portion || 0), 0)
      );
    const c = Number(l.totalCarb || l.carb || l.carbs || 0);
    return c > 0
      ? s + c / 5
      : s + Number(l.servings || l.serving || l.amount || 0);
  }, 0);
const calcFruitPortions = (logs) =>
  logs.reduce((s, l) => {
    const c = Number(l.totalCarb || l.carb || l.carbs || 0);
    return c > 0
      ? s + c / 15
      : s + Number(l.servings || l.serving || l.amount || 0);
  }, 0);
const calcMeatPortions = (logs) =>
  logs.reduce((s, l) => {
    const p = Number(l.totalProtein || l.protein || l.proteins || 0);
    return p > 0
      ? s + p / 7
      : s + Number(l.servings || l.serving || l.amount || 0);
  }, 0);
const calcDairyPortions = (logs) =>
  logs.reduce((s, l) => {
    const p = Number(l.totalProtein || l.protein || l.proteins || 0);
    return p > 0
      ? s + p / 8
      : s + Number(l.servings || l.serving || l.amount || 0);
  }, 0);
const calcFatPortions = (logs) =>
  logs.reduce((s, l) => {
    const f = Number(l.totalFat || l.fat || 0);
    return f > 0
      ? s + f / 5
      : s + Number(l.servings || l.serving || l.amount || 0);
  }, 0);
const calcSaltPortions = (logs) =>
  logs.reduce(
    (s, l) => s + Number(l.servings || l.serving || l.amount || 0),
    0,
  );

// ─── Helpers ──────────────────────────────────

function getTodayThai() {
  return new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calcLogKcal(log) {
  const carb = Number(log.totalCarb || log.carb || log.carbs || 0);
  const protein = Number(log.totalProtein || log.protein || log.proteins || 0);
  const fat = Number(log.totalFat || log.fat || 0);
  return (
    Number(log.totalCalories || log.calories || 0) ||
    carb * 4 + protein * 4 + fat * 9
  );
}

function loadDayKcal(currentUser, dateStr) {
  let kcal = 0;
  LOG_KEYS.forEach((key) => {
    const logs = JSON.parse(
      localStorage.getItem(`${key}_${currentUser}`) || "[]",
    );
    logs
      .filter((l) => l.date === dateStr)
      .forEach((l) => {
        kcal += calcLogKcal(l);
      });
  });
  return kcal;
}

// ─── Sub-components ───────────────────────────

function ProgressBar({ pct, color, height = 6 }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#E8F4F2",
        borderRadius: 99,
        overflow: "hidden",
        marginTop: 6,
      }}
    >
      <div
        style={{
          width: `${Math.min(pct, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function MacroRow({ label, value, target, unit, color }) {
  const pct = Math.min((value / target) * 100, 100);
  const isOver = value > target;
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 4,
        }}
      >
        <span
          style={{ fontSize: "0.82rem", color: "#5C7C7A", fontWeight: 600 }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: isOver ? "#EF4444" : "#2d3748",
            }}
          >
            {value}
            {unit}
          </span>
          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
            /{target}
            {unit}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: isOver ? "#EF4444" : color,
              marginLeft: 6,
            }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <ProgressBar pct={pct} color={isOver ? "#EF4444" : color} height={6} />
    </div>
  );
}

function FoodCard({ cat }) {
  const { name, icon, unit, target, consumed: eaten = 0, color } = cat;
  const pct = target > 0 ? Math.min((eaten / target) * 100, 100) : 0;
  const isOver = eaten > target;
  return (
    <div style={s.foodCard}>
      <div style={s.foodNameRow}>
        <span style={s.foodName}>{name}</span>
        <span style={s.foodEmoji}>{icon}</span>
      </div>
      <div style={s.foodCount}>
        <span style={{ ...s.foodEaten, color: isOver ? "#EF4444" : "#1a202c" }}>
          {eaten}
        </span>
        <span style={s.foodOf}>
          {" "}
          / {target} {unit}
        </span>
      </div>
      <ProgressBar pct={pct} color={isOver ? "#EF4444" : color} height={5} />
    </div>
  );
}

function getStatus(value, min, max) {
  if (value < min) return "low";
  if (value > max) return "over";
  return "ok";
}

function InsightItem({ status, label, good, low, bad }) {
  const icon = status === "ok" ? "✅" : "⚠️";
  const text = status === "ok" ? good : status === "low" ? low : bad;
  const color =
    status === "ok" ? "#2CB9A8" : status === "low" ? "#9CA3AF" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: "1rem" }}>{icon}</span>
      <span style={{ fontSize: "0.78rem", color: "#4A5568", fontWeight: 600 }}>
        {label} <span style={{ color }}>{text}</span>
      </span>
    </div>
  );
}

function WeeklyBar({ currentUser, targetKcal, onClick }) {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString("th-TH");
    const dayLabel = d
      .toLocaleDateString("th-TH", { weekday: "short" })
      .slice(0, 2);
    const kcal = loadDayKcal(currentUser, dateStr);
    days.push({ label: dayLabel, kcal, isToday: i === 0 });
  }

  const maxKcal = Math.max(...days.map((d) => d.kcal), 1);

  return (
    <button onClick={onClick} style={wb.wrap}>
      <div style={wb.title}>📊 ประวัติ 7 วัน</div>
      <div style={wb.bars}>
        {days.map((d, i) => (
          <div key={i} style={wb.col}>
            <div style={wb.barWrap}>
              <div
                style={{
                  ...wb.bar,
                  height: `${Math.max((d.kcal / maxKcal) * 100, d.kcal > 0 ? 8 : 3)}%`,
                  background: d.isToday
                    ? "linear-gradient(180deg,#17BCBC,#64C5D7)"
                    : d.kcal > 0
                      ? "#A8DDD9"
                      : "#E0F2F0",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                color: d.isToday ? "#17BCBC" : "#9CA3AF",
                fontWeight: d.isToday ? 800 : 500,
              }}
            >
              {d.label}
            </div>
            {d.kcal > 0 && (
              <div
                style={{
                  fontSize: 9,
                  color: d.kcal > targetKcal ? "#EF4444" : "#17BCBC",
                  fontWeight: 600,
                }}
              >
                {Math.round(d.kcal)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={wb.hint}>แตะเพื่อดูประวัติ →</div>
    </button>
  );
}

const wb = {
  wrap: {
    width: "100%",
    background: "white",
    borderRadius: 16,
    padding: "14px 16px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(23,188,188,0.1)",
    textAlign: "left",
    marginBottom: 14,
  },
  title: { fontSize: 13, fontWeight: 700, color: "#1a3a38", marginBottom: 12 },
  bars: { display: "flex", alignItems: "flex-end", gap: 6, height: 56 },
  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    height: "100%",
  },
  barWrap: { flex: 1, width: "100%", display: "flex", alignItems: "flex-end" },
  bar: {
    width: "100%",
    borderRadius: "4px 4px 0 0",
    minHeight: 3,
    transition: "height 0.3s ease",
  },
  hint: { fontSize: 11, color: "#9CA3AF", marginTop: 8, textAlign: "right" },
};

// ─── Main Component ───────────────────────────

export default function MealPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "default";

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
  const [consumed, setConsumed] = useState({
    rice: 0,
    vegetable: 0,
    fruit: 0,
    meat: 0,
    milk: 0,
    sugar: 0,
    fat: 0,
    salt: 0,
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) setUserData(JSON.parse(savedData));

    const userDataStr = localStorage.getItem(`userData_${currentUser}`);
    if (userDataStr) {
      const ud = JSON.parse(userDataStr);
      setUserTarget({
        calories: Number(ud.calories) || 2000,
        protein: Number(ud.protein) || 100,
        carbs: Number(ud.carbs) || 250,
        fat: Number(ud.fat) || 67,
      });
    }

    const getLogs = (key) =>
      JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");
    const todayStr = new Date().toLocaleDateString("th-TH");
    const f = (arr) => arr.filter((l) => l.date === todayStr);

    const todayRice = f(getLogs("riceLogs"));
    const todayFruit = f(getLogs("fruitLogs"));
    const todayDairy = f(getLogs("dairyLogs"));
    const todayMeat = f(getLogs("meatLogs"));
    const todayVegetable = f(getLogs("vegetableLogs"));
    const todayFat = f(getLogs("fatLogs"));
    const todayDish = f(getLogs("dishLogs"));
    const todayDessert = f(getLogs("dessertLogs"));
    const todayCondiment = f(getLogs("condimentLogs"));

    setConsumed({
      rice: Math.round(calcRicePortions(todayRice) * 10) / 10,
      vegetable: Math.round(calcVegetablePortions(todayVegetable) * 10) / 10,
      fruit: Math.round(calcFruitPortions(todayFruit) * 10) / 10,
      meat: Math.round(calcMeatPortions(todayMeat) * 2 * 10) / 10,
      milk: Math.round(calcDairyPortions(todayDairy) * 10) / 10,
      fat: Math.round(calcFatPortions(todayFat) * 10) / 10,
      salt: Math.round(calcSaltPortions(todayCondiment) * 10) / 10,
      sugar: 0,
    });

    const allLogs = [
      ...todayRice,
      ...todayFruit,
      ...todayDairy,
      ...todayMeat,
      ...todayVegetable,
      ...todayFat,
      ...todayDessert,
      ...todayDish,
      ...todayCondiment,
    ].map((log) => {
      const carb = Number(log.totalCarb || log.carb || log.carbs || 0);
      const protein = Number(
        log.totalProtein || log.protein || log.proteins || 0,
      );
      const fat = Number(log.totalFat || log.fat || 0);
      const kcal =
        Number(log.totalCalories || log.calories || 0) ||
        carb * 4 + protein * 4 + fat * 9;
      return { ...log, kcal, carb, protein, fat };
    });

    setSummary(
      allLogs.reduce(
        (acc, l) => ({
          kcal: acc.kcal + l.kcal,
          protein: acc.protein + l.protein,
          carb: acc.carb + l.carb,
          fat: acc.fat + l.fat,
        }),
        { kcal: 0, protein: 0, carb: 0, fat: 0 },
      ),
    );

    const bd = {
      breakfast: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      lunch: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      dinner: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
      snack: { kcal: 0, protein: 0, carb: 0, fat: 0, items: [] },
    };
    allLogs.forEach((log) => {
      const m = log.mealId || "snack";
      if (bd[m]) {
        bd[m].kcal += log.kcal;
        bd[m].protein += log.protein;
        bd[m].carb += log.carb;
        bd[m].fat += log.fat;
        bd[m].items.push(log);
      }
    });
    setMealBreakdown(bd);
  }, [currentUser]);

  const portions = getPortionsByCalories(userTarget.calories);
  const kcalPct = Math.min((summary.kcal / userTarget.calories) * 100, 100);
  const isKcalOver = summary.kcal > userTarget.calories;

  const foodCategories = [
    {
      id: "rice",
      name: "ข้าว - แป้ง",
      icon: "🍚",
      unit: "ทัพพี",
      target: portions.rice,
      consumed: consumed.rice,
      color: "#2CB9A8",
    },
    {
      id: "vegetable",
      name: "ผัก",
      icon: "🥬",
      unit: "ทัพพี",
      target: portions.vegetable,
      consumed: consumed.vegetable,
      color: "#2CB9A8",
    },
    {
      id: "fruit",
      name: "ผลไม้",
      icon: "🍎",
      unit: "ส่วน",
      target: portions.fruit,
      consumed: consumed.fruit,
      color: "#2CB9A8",
    },
    {
      id: "meat",
      name: "เนื้อสัตว์",
      icon: "🥩",
      unit: "ช้อนกินข้าว",
      target: portions.meat,
      consumed: consumed.meat,
      color: "#2CB9A8",
    },
    {
      id: "dairy",
      name: "นม",
      icon: "🥛",
      unit: "แก้ว",
      target: portions.milk,
      consumed: consumed.milk,
      color: "#2CB9A8",
    },
    {
      id: "sugar",
      name: "น้ำตาล",
      icon: "🍬",
      unit: "ช้อนชา",
      target: portions.sugar,
      consumed: consumed.sugar,
      color: "#2CB9A8",
      isLimit: true,
    },
    {
      id: "fat",
      name: "น้ำมัน",
      icon: "🧈",
      unit: "ช้อนชา",
      target: portions.fat,
      consumed: consumed.fat,
      color: "#2CB9A8",
      isLimit: true,
    },
    {
      id: "salt",
      name: "เกลือ",
      icon: "🧂",
      unit: "ช้อนชา",
      target: portions.salt,
      consumed: consumed.salt,
      color: "#2CB9A8",
      isLimit: true,
    },
  ];

  const meals = [
    { id: "breakfast", name: "มื้อเช้า", icon: "🌤️" },
    { id: "lunch", name: "มื้อกลางวัน", icon: "⛅" },
    { id: "dinner", name: "มื้อเย็น", icon: "🌙" },
  ];

  return (
    <Background>
      <div style={s.wrapper}>
        <Header title="สรุปโภชนาการวันนี้" backTo="/menu" />
        <div style={s.container}>
          {/* Top bar */}
          <div style={s.topBar}>
            <div>
              <div style={s.brand}>
                <span style={s.brandBold}>Smart</span>
                <span style={s.brandAccent}>DM</span>
              </div>
              <div style={s.dateText}>วันนี้ {getTodayThai()}</div>
            </div>

            <button
              onClick={() => navigate("/food/history")}
              style={s.historyBtn}
            >
              <span style={s.historyText}>ประวัติการบันทึกอาหาร</span>
            </button>
          </div>
          {/* Calorie card */}
          <div style={s.calorieCard}>
            <div style={s.calorieTitle}>พลังงานรวม</div>
            <div style={s.calorieRow}>
              <span style={s.calorieNum}>
                {Math.round(summary.kcal).toLocaleString()}
              </span>
              <span style={s.calorieOf}>
                {" "}
                / {userTarget.calories.toLocaleString()} kcal
              </span>
              <span
                style={{
                  ...s.caloriePct,
                  color: isKcalOver ? "#EF4444" : "#2CB9A8",
                }}
              >
                {Math.round(kcalPct)}%
              </span>
            </div>
            <ProgressBar
              pct={kcalPct}
              color={isKcalOver ? "#EF4444" : "#2CB9A8"}
              height={10}
            />
            <div style={s.macroList}>
              <MacroRow
                label="คาร์บ"
                value={Math.round(summary.carb)}
                target={userTarget.carbs}
                unit="g"
                color="#2CB9A8"
              />
              <MacroRow
                label="โปรตีน"
                value={Math.round(summary.protein)}
                target={userTarget.protein}
                unit="g"
                color="#2CB9A8"
              />
              <MacroRow
                label="ไขมัน"
                value={Math.round(summary.fat)}
                target={userTarget.fat}
                unit="g"
                color="#2CB9A8"
              />
            </div>
          </div>

          {/* Food grid */}
          <div style={s.grid2}>
            {foodCategories.map((cat) => (
              <FoodCard key={cat.id} cat={cat} />
            ))}
          </div>

          {/* Meals */}
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>บันทึกตามมื้อ</div>
            <div style={s.mealRow}>
              {meals.map((meal) => {
                const md = mealBreakdown[meal.id];
                const hasData = md && md.kcal > 0;
                return (
                  <div
                    key={meal.id}
                    style={s.mealItem}
                    onClick={() =>
                      navigate(
                        `/food-log?mealId=${meal.id}&mealName=${encodeURIComponent(meal.name)}`,
                      )
                    }
                  >
                    <span style={s.mealIcon}>{meal.icon}</span>
                    <div style={s.mealName}>{meal.name}</div>
                    <div style={s.mealSub}>
                      {hasData ? `${Math.round(md.kcal)} kcal` : "+ เพิ่ม"}
                    </div>
                  </div>
                );
              })}
              <div
                style={s.mealItem}
                onClick={() =>
                  navigate(
                    `/food-log?mealId=snack&mealName=${encodeURIComponent("มื้อว่าง")}`,
                  )
                }
              >
                <span style={s.mealIcon}>🍪</span>
                <div style={s.mealName}>มื้อว่าง</div>
                <div style={s.mealSub}>
                  {mealBreakdown.snack?.kcal > 0
                    ? `${Math.round(mealBreakdown.snack.kcal)} kcal`
                    : "+ เพิ่ม"}
                </div>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div style={s.insightCard}>
            <div style={s.insightHeader}>
              <span style={s.insightIcon}>🤖</span>
              <span style={s.insightTitle}>วิเคราะห์วันนี้</span>
            </div>
            <div style={s.insightGrid}>
              <InsightItem
                status={getStatus(
                  summary.carb,
                  userTarget.carbs * 0.5,
                  userTarget.carbs,
                )}
                label="คาร์บ"
                good="เหมาะสม"
                low="ยังน้อย"
                bad="เกินเกณฑ์"
              />
              <InsightItem
                status={getStatus(
                  consumed.fruit,
                  portions.fruit * 0.7,
                  portions.fruit * 1.5,
                )}
                label="ผลไม้"
                good="เพียงพอ"
                low="ยังน้อย"
                bad="มากเกิน"
              />
              <InsightItem
                status={getStatus(
                  summary.protein,
                  userTarget.protein * 0.8,
                  userTarget.protein * 1.3,
                )}
                label="โปรตีน"
                good="เพียงพอ"
                low="ยังน้อย"
                bad="เกินเกณฑ์"
              />
              <InsightItem
                status={getStatus(
                  consumed.vegetable,
                  portions.vegetable * 0.7,
                  portions.vegetable * 1.5,
                )}
                label="ผัก"
                good="เพียงพอ"
                low="ยังน้อย"
                bad="มากเกิน"
              />
            </div>
          </div>

          <div style={{ height: 24 }} />
        </div>
      </div>
      <Footer userData={userData} />
    </Background>
  );
}

// ─── Styles ───────────────────────────────────

const s = {
  wrapper: {
    maxWidth: 480,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  container: { flex: 1, padding: "0 16px 90px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0 14px",
  },
  brand: { fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 },
  brandBold: { color: "#1a3a38" },
  brandAccent: { color: "#2CB9A8" },
  dateText: {
    fontSize: "0.85rem",
    color: "#5C7C7A",
    marginTop: 2,
    fontWeight: 600,
  },
  calorieCard: {
    background: "white",
    borderRadius: 20,
    padding: "20px 20px 16px",
    marginBottom: 14,
    boxShadow: "0 4px 16px rgba(44,185,168,0.08)",
  },
  calorieTitle: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  calorieRow: { display: "flex", alignItems: "baseline", gap: 0 },
  calorieNum: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#1a202c",
    letterSpacing: -1,
  },
  calorieOf: {
    fontSize: "0.9rem",
    color: "#9CA3AF",
    fontWeight: 600,
    marginLeft: 4,
  },
  caloriePct: { marginLeft: "auto", fontSize: "1.1rem", fontWeight: 800 },
  macroList: { marginTop: 8 },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 14,
  },
  foodCard: {
    background: "white",
    borderRadius: 16,
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  foodNameRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  foodName: { fontSize: "0.82rem", fontWeight: 700, color: "#5C7C7A" },
  foodCount: { marginBottom: 6 },
  foodEaten: { fontSize: "1.1rem", fontWeight: 800, lineHeight: 1 },
  foodOf: { fontSize: "0.7rem", color: "#9CA3AF", fontWeight: 600 },
  foodEmoji: { fontSize: "1.8rem", flexShrink: 0 },
  sectionCard: {
    background: "white",
    borderRadius: 20,
    padding: "16px",
    marginBottom: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: 14,
  },
  mealRow: { display: "flex", gap: 8, justifyContent: "space-between" },
  mealItem: {
    flex: 1,
    background: "#F8FFFE",
    border: "1.5px solid #E0F2F0",
    borderRadius: 14,
    padding: "12px 6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  mealIcon: { fontSize: "1.5rem", marginBottom: 4 },
  mealName: {
    fontSize: "0.65rem",
    fontWeight: 700,
    color: "#5C7C7A",
    textAlign: "center",
    marginBottom: 4,
  },
  mealSub: { fontSize: "0.65rem", fontWeight: 700, color: "#2CB9A8" },
  insightCard: {
    background: "white",
    borderRadius: 20,
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  insightHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  insightIcon: { fontSize: "1.2rem" },
  insightTitle: { fontSize: "0.9rem", fontWeight: 700, color: "#1a202c" },
  insightGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  historyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: 12,
    border: "1.5px solid #E0F2F0",
    background: "white",
    color: "#17BCBC",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(23,188,188,0.08)",
    whiteSpace: "nowrap",
  },
  historyText: { fontSize: 14, fontWeight: 700, color: "#17BCBC" },
};
