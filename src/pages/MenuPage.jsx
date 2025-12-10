import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [glucoseRecords, setGlucoseRecords] = useState([]);
  const [newGlucose, setNewGlucose] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showInput, setShowInput] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length && activeTooltip !== null) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "2px solid #4facfe",
            pointerEvents: "auto",
            position: "relative",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTooltip(null);
            }}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#ff4757",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "bold",
              padding: 0,
              lineHeight: "1",
            }}
          >
            ×
          </button>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "4px",
              paddingRight: "20px",
            }}
          >
            📅 {data.fullDate}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: data.value > 180 ? "#ff4757" : "#4facfe",
            }}
          >
            🩸 {data.value} mg/dL
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const stateData = location.state;
    const savedData = localStorage.getItem("userData");
    const savedGlucose = localStorage.getItem("glucoseRecords");

    if (stateData) {
      setUserData(stateData);
      localStorage.setItem("userData", JSON.stringify(stateData));
    } else if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      navigate("/");
    }

    if (savedGlucose) {
      setGlucoseRecords(JSON.parse(savedGlucose));
    }
  }, [location, navigate]);

  const handleAddGlucose = () => {
    if (newGlucose && !isNaN(newGlucose)) {
      const selectedDateTime = new Date(selectedDate + "T12:00:00");
      
      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth()).padStart(2, '0');
      const day = String(selectedDateTime.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const newRecord = {
        value: parseFloat(newGlucose),
        date: selectedDateTime.toISOString(),
        dateKey: dateKey,
      };

      // ลบข้อมูลวันเดียวกันออกก่อน (ถ้ามี)
      const filteredRecords = glucoseRecords.filter(
        (r) => r.dateKey !== dateKey
      );
      const updatedRecords = [...filteredRecords, newRecord];

      setGlucoseRecords(updatedRecords);
      localStorage.setItem("glucoseRecords", JSON.stringify(updatedRecords));
      setNewGlucose("");
      setShowInput(false);
      setSelectedDate(new Date().toISOString().split("T")[0]);
    }
  };

  if (!userData) return null;

  const menuItems = [
    {
      id: 1,
      title: "โภชนาการอาหาร",
      icon: "🍽️",
      color: "#667eea",
      onClick: () => navigate("/summary", { state: userData }),
    },
    {
      id: 2,
      title: "สารอาหารที่ควรได้รับต่อวัน",
      icon: "💊",
      color: "#f093fb",
      onClick: () => alert("Coming soon!"),
    },
    {
      id: 3,
      title: "บันทึกอาหารประจำวัน",
      icon: "📊",
      color: "#4facfe",
      onClick: () => alert("Coming soon!"),
    },
  ];

  // Prepare data for Recharts
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get last 3 months
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const last3Months = [];
  for (let i = 2; i >= 0; i--) {
    let month = currentMonth - i;
    let year = currentYear;
    if (month < 0) {
      month += 12;
      year -= 1;
    }
    last3Months.push({ month, year, name: monthNames[month] });
  }

  // Filter records from last 3 months
  const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
  const recentRecords = glucoseRecords
    .filter((record) => new Date(record.date) >= threeMonthsAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate position within 3-month range (0-100 scale)
  const startDate = new Date(last3Months[0].year, last3Months[0].month, 1);
  const endDate = new Date(
    last3Months[2].year,
    last3Months[2].month + 1,
    0,
    23,
    59,
    59
  );
  const totalRange = endDate - startDate;

  // Create chart data with calculated x position
  const chartData = recentRecords.map((record, index) => {
    const recordDate = new Date(record.date);
    const position = ((recordDate - startDate) / totalRange) * 100;

    return {
      position: position,
      value: record.value,
      displayDate: `${recordDate.getDate()} ${
        monthNames[recordDate.getMonth()]
      }`,
      fullDate: recordDate.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      index: index,
    };
  });

  // Create month markers for X-axis
  const monthMarkers = last3Months.map((m, index) => {
    return {
      position: (index / 2) * 100,
      name: m.name,
    };
  });

  // Custom dot component to color based on value
  const CustomDot = (props) => {
    const { cx, cy, value, payload } = props;
    if (value === null) return null;
    const isHigh = value > 180;
    const isActive = activeTooltip === payload.index;
    return (
      <g
        onClick={(e) => {
          e.stopPropagation();
          setActiveTooltip(activeTooltip === payload.index ? null : payload.index);
        }}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 7 : 5}
          fill="white"
          stroke={isHigh ? "#ff4757" : "#4facfe"}
          strokeWidth={isActive ? 3 : 2.5}
        />
      </g>
    );
  };

  // Custom line segment color
  const CustomLine = (props) => {
    const { points } = props;
    if (!points || points.length < 2) return null;

    return (
      <g>
        {points.map((point, i) => {
          if (i === points.length - 1) return null;
          const nextPoint = points[i + 1];
          if (!point.value || !nextPoint.value) return null;

          const isCurrentHigh = point.value > 180;
          const isNextHigh = nextPoint.value > 180;
          const strokeColor =
            isCurrentHigh || isNextHigh ? "#ff4757" : "#4facfe";

          return (
            <line
              key={i}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={strokeColor}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "20px 15px",
        background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <style>{`
        * {
          outline: none !important;
        }
        *:focus {
          outline: none !important;
        }
        svg {
          outline: none !important;
        }
        .recharts-surface {
          outline: none !important;
        }
      `}</style>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {/* User Info Card */}
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "5px 12px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "10px",
            }}
          >
            ข้อมูลผู้ใช้
          </div>

          <h3 style={{ margin: 0, fontSize: "18px", marginBottom: "8px" }}>
            {userData.firstName} {userData.lastName}
          </h3>

          <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "13px" }}>
            {userData.gender === "male" ? "ชาย" : "หญิง"} • {userData.age} ปี
          </p>

          <div
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#666", fontSize: "13px" }}>BMI</span>
              <span
                style={{ color: "#667eea", fontWeight: 700, fontSize: "15px" }}
              >
                {userData.bmi}
              </span>
            </div>

            <div
              style={{
                background: "#f8f9fa",
                fontSize: "14px",
                padding: "10px",
                textAlign: "center",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              {userData.bmiCategory}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>
                พลังงานต่อวัน
              </span>
              <span
                style={{ color: "#ff6b6b", fontWeight: 700, fontSize: "15px" }}
              >
                {userData.calories?.toLocaleString()} kcal
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/", { state: userData })}
            style={{
              width: "100%",
              padding: "10px",
              color: "white",
              borderRadius: "8px",
              fontSize: "14px",
              border: "none",
              marginTop: "12px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg
              style={{ verticalAlign: "middle" }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            แก้ไขข้อมูล
          </button>
        </div>

        {/* Glucose Tracking Card */}
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
              color: "white",
              padding: "5px 12px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "15px",
            }}
          >
            ระดับน้ำตาลในเลือด (POCT) - 3 เดือนล่าสุด
          </div>

          {glucoseRecords.length > 0 ? (
            <div style={{ marginBottom: "15px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={chartData}
                  margin={{ top: 40, right: 20, left: 10, bottom: 30 }}
                  onClick={() => setActiveTooltip(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="position"
                    dy={20}
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    tickFormatter={(value) => {
                      const marker = monthMarkers.find(
                        (m) => m.position === value
                      );
                      return marker ? marker.name : "";
                    }}
                    tick={{ fontSize: 12, fill: "#555", fontWeight: 600 }}
                    axisLine={{ stroke: "#e8e8e8" }}
                  />
                  <YAxis
                    domain={[0, 250]}
                    ticks={[0, 50, 100, 150, 200, 250]}
                    tick={{ fontSize: 11, fill: "#888", fontWeight: 500 }}
                    axisLine={{ stroke: "#e8e8e8" }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={false}
                    isAnimationActive={false}
                  />
                  <ReferenceLine
                    y={180}
                    stroke="#ffcc00"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4facfe"
                    strokeWidth={2.5}
                    dot={<CustomDot />}
                    activeDot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginTop: "10px",
                  fontSize: "11px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#4facfe",
                      borderRadius: "50%",
                      border: "2px solid white",
                      boxShadow: "0 0 0 1px #4facfe",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>ปกติ (80-180)</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#ff4757",
                      borderRadius: "50%",
                      border: "2px solid white",
                      boxShadow: "0 0 0 1px #ff4757",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>สูง (&gt;180)</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "30px 20px",
                color: "#999",
                fontSize: "13px",
              }}
            >
              ยังไม่มีข้อมูลการบันทึก
            </div>
          )}

          {showInput ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  📅 เลือกวันที่
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #4facfe",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  🩸 ระดับน้ำตาล (mg/dL)
                </label>
                <input
                  type="number"
                  value={newGlucose}
                  onChange={(e) => setNewGlucose(e.target.value)}
                  placeholder="เช่น 120, 150, 180"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #4facfe",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleAddGlucose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setNewGlucose("");
                    setSelectedDate(new Date().toISOString().split("T")[0]);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#f0f0f0",
                    color: "#666",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span>
              บันทึกค่าน้ำตาล
            </button>
          )}
        </div>

        {/* Menu */}
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                style={{
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  padding: "16px",
                  borderRadius: "10px",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "30px" }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    flex: 1,
                    marginLeft: "15px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  ➜
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;