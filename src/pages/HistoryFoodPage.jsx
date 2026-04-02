import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "../components/Background";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LOG_KEYS = ["riceLogs","fruitLogs","dairyLogs","meatLogs","vegetableLogs","fatLogs","dessertLogs","dishLogs","condimentLogs"];

function calcKcal(log) {
  const carb    = Number(log.totalCarb    || log.carb    || log.carbs    || 0);
  const protein = Number(log.totalProtein || log.protein || log.proteins || 0);
  const fat     = Number(log.totalFat     || log.fat     || 0);
  return Number(log.totalCalories || log.calories || 0) || (carb * 4 + protein * 4 + fat * 9);
}

function getStatusColor(kcal, target) {
  if (kcal === 0)               return { color: "#9CA3AF", label: "ไม่มีข้อมูล", bg: "#f9fafb" };
  if (kcal <= target * 0.8)     return { color: "#f59e0b", label: "น้อยกว่าเป้า",  bg: "#fffbeb" };
  if (kcal <= target)           return { color: "#22c55e", label: "เหมาะสม",       bg: "#f0fdf4" };
  if (kcal <= target * 1.2)     return { color: "#f97316", label: "เกินเล็กน้อย",  bg: "#fff7ed" };
  return                               { color: "#ef4444", label: "เกินเป้า",      bg: "#fef2f2" };
}

export default function HistoryFoodPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData    = location.state || JSON.parse(localStorage.getItem("userData") || "null");
  const currentUser = localStorage.getItem("currentUser") || "default";
  const targetKcal  = Number(JSON.parse(localStorage.getItem(`userData_${currentUser}`) || "{}")?.calories) || 2000;

  const [days, setDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    const result = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr  = d.toLocaleDateString("th-TH");
      const dateDisp = d.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });

      let kcal = 0, carb = 0, protein = 0, fat = 0, itemCount = 0;

      LOG_KEYS.forEach((key) => {
        const logs = JSON.parse(localStorage.getItem(`${key}_${currentUser}`) || "[]");
        logs.filter((l) => l.date === dateStr).forEach((l) => {
          kcal    += calcKcal(l);
          carb    += Number(l.totalCarb    || l.carb    || l.carbs    || 0);
          protein += Number(l.totalProtein || l.protein || l.proteins || 0);
          fat     += Number(l.totalFat     || l.fat     || 0);
          itemCount++;
        });
      });

      if (kcal > 0 || i === 0) {
        result.push({ dateStr, dateDisp, kcal, carb, protein, fat, itemCount, isToday: i === 0 });
      }
    }

    setDays(result);
  }, [currentUser]);

  const maxKcal = Math.max(...days.map((d) => d.kcal), 1);

  return (
    <Background>
      <div style={s.wrapper}>
        <div style={s.outerCard}>
          <Header title="ประวัติการบันทึกอาหาร" backTo="/meal" />

          <div style={s.inner}>
            {/* ── Weekly summary bar ── */}
            {/* <div style={s.sectionTitle}>7 วันล่าสุด</div>
            <div style={s.weekRow}>
              {days.slice(0, 7).reverse().map((d, i) => {
                const pct = Math.max((d.kcal / maxKcal) * 100, d.kcal > 0 ? 8 : 3);
                const st  = getStatusColor(d.kcal, targetKcal);
                return (
                  <div key={i} style={s.weekCol}>
                    <div style={s.weekBarWrap}>
                      <div style={{ ...s.weekBar, height: `${pct}%`, background: d.isToday ? "linear-gradient(180deg,#17BCBC,#64C5D7)" : d.kcal > 0 ? "#A8DDD9" : "#E0F2F0" }} />
                    </div>
                    <div style={{ fontSize: 10, color: d.isToday ? "#17BCBC" : "#9CA3AF", fontWeight: d.isToday ? 800 : 500 }}>
                      {d.dateDisp.split(" ")[0]}
                    </div>
                    {d.kcal > 0 && (
                      <div style={{ fontSize: 9, color: st.color, fontWeight: 600 }}>
                        {Math.round(d.kcal)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div> */}

            {/* ── Day cards ── */}
            <div style={{ ...s.sectionTitle, marginTop: 20 }}>ประวัติทั้งหมด</div>

            {days.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <div style={{ color: "#9CA3AF", fontWeight: 600 }}>ยังไม่มีประวัติการบันทึก</div>
              </div>
            ) : (
              days.map((d, i) => {
                const st = getStatusColor(d.kcal, targetKcal);
                const pct = Math.min((d.kcal / targetKcal) * 100, 100);
                return (
                  <div key={i} style={{ ...s.dayCard, background: st.bg, border: `1.5px solid ${st.color}22` }}>
                    <div style={s.dayTop}>
                      <div>
                        <div style={s.dayDate}>
                          {d.isToday && <span style={s.todayBadge}>วันนี้</span>}
                          {d.dateDisp}
                        </div>
                        <div style={{ ...s.statusLabel, color: st.color }}>{st.label}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...s.kcalNum, color: st.color }}>{Math.round(d.kcal)}</div>
                        <div style={s.kcalUnit}>/ {targetKcal} kcal</div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={s.progressTrack}>
                      <div style={{ ...s.progressFill, width: `${pct}%`, background: st.color }} />
                    </div>

                    {/* Macros */}
                    {d.kcal > 0 && (
                      <div style={s.macroRow}>
                        <MacroChip label="คาร์บ"    value={Math.round(d.carb)}    unit="g" color="#f59e0b" />
                        <MacroChip label="โปรตีน"   value={Math.round(d.protein)} unit="g" color="#3b82f6" />
                        <MacroChip label="ไขมัน"    value={Math.round(d.fat)}     unit="g" color="#8b5cf6" />
                        <MacroChip label="รายการ"   value={d.itemCount}           unit=""  color="#17BCBC" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer userData={userData} />
    </Background>
  );
}

function MacroChip({ label, value, unit, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}{unit}</div>
      <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

const s = {
  wrapper:       { maxWidth: 480, width: "100%", paddingBottom: 80 },
  outerCard:     { background: "white", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", overflow: "hidden" },
  inner:         { padding: "16px 16px 24px" },
  sectionTitle:  { fontSize: 13, fontWeight: 700, color: "#5C7C7A", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },

  weekRow:    { display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 4 },
  weekCol:    { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" },
  weekBarWrap:{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" },
  weekBar:    { width: "100%", borderRadius: "4px 4px 0 0", minHeight: 3, transition: "height 0.3s ease" },

  dayCard:       { borderRadius: 14, padding: "14px 16px", marginBottom: 10 },
  dayTop:        { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  dayDate:       { fontSize: 14, fontWeight: 700, color: "#1a3a38", display: "flex", alignItems: "center", gap: 6, marginBottom: 2 },
  todayBadge:    { background: "#17BCBC", color: "white", borderRadius: 99, padding: "1px 8px", fontSize: 10, fontWeight: 700 },
  statusLabel:   { fontSize: 12, fontWeight: 600 },
  kcalNum:       { fontSize: 20, fontWeight: 800, lineHeight: 1 },
  kcalUnit:      { fontSize: 11, color: "#9CA3AF", fontWeight: 600 },
  progressTrack: { height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 99, overflow: "hidden", marginBottom: 10 },
  progressFill:  { height: "100%", borderRadius: 99, transition: "width 0.4s ease" },
  macroRow:      { display: "flex", justifyContent: "space-around" },

  empty: { textAlign: "center", padding: "40px 0" },
};