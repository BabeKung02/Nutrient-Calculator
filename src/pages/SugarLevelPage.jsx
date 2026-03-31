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

import Header from "../components/Header";
import Footer from "../components/Footer";
import Background from "../components/Background";

function SugarLevel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [poctRecords, setPoctRecords] = useState([]);
  const [hba1cRecords, setHba1cRecords] = useState([]);
  const [fbsRecords, setFbsRecords] = useState([]);
  const [newPoct, setNewPoct] = useState("");
  const [newHba1c, setNewHba1c] = useState("");
  const [newFbs, setNewFbs] = useState("");
  const [selectedDatePoct, setSelectedDatePoct] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTimePoct, setSelectedTimePoct] = useState("before_breakfast");
  const [selectedDateHba1c, setSelectedDateHba1c] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDateFbs, setSelectedDateFbs] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showInputPoct, setShowInputPoct] = useState(false);
  const [showInputHba1c, setShowInputHba1c] = useState(false);
  const [showInputFbs, setShowInputFbs] = useState(false);
  const [activeTooltipPoct, setActiveTooltipPoct] = useState(null);
  const [activeTooltipHba1c, setActiveTooltipHba1c] = useState(null);
  const [activeTooltipFbs, setActiveTooltipFbs] = useState(null);

  const currentUser = localStorage.getItem("currentUser");

  const CustomTooltipPoct = ({ active, payload }) => {
    if (active && payload && payload.length && activeTooltipPoct !== null) {
      const data = payload[0].payload;

      // สร้าง unique ID จาก date + timeOfDay
      const currentId = `${data.fullDate}_${data.timeOfDay}`;

      // เช็คว่า tooltip นี้ถูกเปิดอยู่หรือไม่
      if (activeTooltipPoct !== currentId) {
        return null;
      }

      const timeLabels = {
        before_breakfast: "🌅 ก่อนอาหารเช้า",
        before_lunch: "☀️ ก่อนอาหารเที่ยง",
        before_dinner: "🌆 ก่อนอาหารเย็น",
        before_bed: "🌙 ก่อนนอน",
      };

      return (
        <div
          style={{
            position: "relative",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            border: "2px solid #4facfe",
            borderRadius: "12px",
            padding: "12px 16px",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            minWidth: "180px",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTooltipPoct(null);
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

          <div style={{ fontSize: "13px", marginBottom: "6px", opacity: 0.9 }}>
            📅 {data.fullDate}
          </div>
          <div style={{ fontSize: "12px", marginBottom: "8px", opacity: 0.8 }}>
            {timeLabels[data.timeOfDay] || ""}
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: data.value > 180 ? "#ff4757" : "#4facfe",
            }}
          >
            🩸 {data.value} mg/dL
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipHba1c = ({ active, payload }) => {
    if (active && payload && payload.length && activeTooltipHba1c !== null) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "2px solid #5DD39E",
            pointerEvents: "auto",
            position: "relative",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTooltipHba1c(null);
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
              color: data.value > 7 ? "#ff4757" : "#5DD39E",
            }}
          >
            📊 {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipFbs = ({ active, payload }) => {
    if (active && payload && payload.length && activeTooltipFbs !== null) {
      const data = payload[0].payload;
      
      // กำหนดสีตามเกณฑ์
      let color = "#5DD39E"; // สีเขียว (ควบคุมได้ดี)
      let label = "ควบคุมได้ดี";
      
      if (data.value >= 183) {
        color = "#ff4757"; // สีแดง (รุนแรง)
        label = "รุนแรง";
      } else if (data.value >= 155) {
        color = "#FF8A65"; // สีส้ม (พอใช้)
        label = "พอใช้";
      } else if (data.value >= 126) {
        color = "#FFD54F"; // สีเหลือง (ดี)
        label = "ดี";
      }
      
      return (
        <div
          style={{
            background: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: `2px solid ${color}`,
            pointerEvents: "auto",
            position: "relative",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTooltipFbs(null);
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
              color: color,
            }}
          >
            🩸 {data.value} mg/dL
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 500,
              color: color,
              marginTop: "4px",
            }}
          >
            ({label})
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const stateData = location.state; // ข้อมูลจาก navigate
    const currentUser = localStorage.getItem("currentUser"); // ดึง username ปัจจุบัน

    if (!currentUser) {
      navigate("/login"); // ถ้าไม่มี username กลับไปหน้า login
      return;
    }

    // โหลดข้อมูลผู้ใช้แยกตาม username
    const savedData = localStorage.getItem(`userData_${currentUser}`);
    const savedPoct = localStorage.getItem(`poctRecords_${currentUser}`);
    const savedHba1c = localStorage.getItem(`hba1cRecords_${currentUser}`);
    const savedFbs = localStorage.getItem(`fbsRecords_${currentUser}`);

    if (stateData) {
      setUserData(stateData);
      localStorage.setItem(
        `userData_${currentUser}`,
        JSON.stringify(stateData)
      );
    } else if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      navigate("/register", { state: { username: currentUser } });
    }

    if (savedPoct) {
      setPoctRecords(JSON.parse(savedPoct));
    }

    if (savedHba1c) {
      setHba1cRecords(JSON.parse(savedHba1c));
    }

    if (savedFbs) {
      setFbsRecords(JSON.parse(savedFbs));
    }
  }, [location, navigate]);

  const handleAddPoct = () => {
    if (newPoct && !isNaN(newPoct)) {
      const selectedDateTime = new Date(selectedDatePoct + "T12:00:00");
      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDateTime.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}-${selectedTimePoct}`;

      const newRecord = {
        value: parseFloat(newPoct),
        date: selectedDateTime.toISOString(),
        dateKey: dateKey,
        timeOfDay: selectedTimePoct,
      };

      const filteredRecords = poctRecords.filter((r) => r.dateKey !== dateKey);
      const updatedRecords = [...filteredRecords, newRecord];

      setPoctRecords(updatedRecords);
      localStorage.setItem(
        `poctRecords_${currentUser}`,
        JSON.stringify(updatedRecords)
      );
      setNewPoct("");
      setShowInputPoct(false);
      setSelectedDatePoct(new Date().toISOString().split("T")[0]);
      setSelectedTimePoct("before_breakfast");
    }
  };

  const handleAddHba1c = () => {
    if (newHba1c && !isNaN(newHba1c)) {
      const selectedDateTime = new Date(selectedDateHba1c + "T12:00:00");
      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDateTime.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const newRecord = {
        value: parseFloat(newHba1c),
        date: selectedDateTime.toISOString(),
        dateKey: dateKey,
      };

      const filteredRecords = hba1cRecords.filter((r) => r.dateKey !== dateKey);
      const updatedRecords = [...filteredRecords, newRecord];

      setHba1cRecords(updatedRecords);
      localStorage.setItem(
        `hba1cRecords_${currentUser}`,
        JSON.stringify(updatedRecords)
      );
      setNewHba1c("");
      setShowInputHba1c(false);
      setSelectedDateHba1c(new Date().toISOString().split("T")[0]);
    }
  };

  const handleAddFbs = () => {
    if (newFbs && !isNaN(newFbs)) {
      const selectedDateTime = new Date(selectedDateFbs + "T12:00:00");
      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDateTime.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const newRecord = {
        value: parseFloat(newFbs),
        date: selectedDateTime.toISOString(),
        dateKey: dateKey,
      };

      const filteredRecords = fbsRecords.filter((r) => r.dateKey !== dateKey);
      const updatedRecords = [...filteredRecords, newRecord];

      setFbsRecords(updatedRecords);
      localStorage.setItem(
        `fbsRecords_${currentUser}`,
        JSON.stringify(updatedRecords)
      );
      setNewFbs("");
      setShowInputFbs(false);
      setSelectedDateFbs(new Date().toISOString().split("T")[0]);
    }
  };

  if (!userData) return null;

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

  const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
  const recentPoctRecords = poctRecords
    .filter((record) => new Date(record.date) >= threeMonthsAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const recentHba1cRecords = hba1cRecords
    .filter((record) => new Date(record.date) >= threeMonthsAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const recentFbsRecords = fbsRecords
    .filter((record) => new Date(record.date) >= threeMonthsAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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

  const chartDataPoct = recentPoctRecords.map((record, index) => {
    const recordDate = new Date(record.date);
    const position = ((recordDate - startDate) / totalRange) * 100;

    const year = recordDate.getFullYear();
    const month = String(recordDate.getMonth() + 1).padStart(2, "0");
    const day = String(recordDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    return {
      position: position,
      value: record.value,
      displayDate: `${recordDate.getDate()} ${
        monthNames[recordDate.getMonth()]
      }`,
      fullDate: dateString,
      timeOfDay: record.timeOfDay || "before_breakfast",
      index: index,
    };
  });

  const chartDataHba1c = recentHba1cRecords.map((record, index) => {
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

  const chartDataFbs = recentFbsRecords.map((record, index) => {
  const recordDate = new Date(record.date);

  // snap ไปวันที่ 1 ของเดือนเดียวกันเสมอ
  const snappedDate = new Date(
    recordDate.getFullYear(),
    recordDate.getMonth(),
    1
  );
  const position = ((snappedDate - startDate) / totalRange) * 100;

  return {
    position: position,
    value: record.value,
    displayDate: `${monthNames[recordDate.getMonth()]} ${recordDate.getFullYear()}`,
    fullDate: recordDate.toLocaleDateString("th-TH", {
      day: "numeric", month: "short", year: "numeric",
    }),
    index: index,
  };
});

  const monthMarkers = last3Months.map((m) => {
    const monthStart = new Date(m.year, m.month, 1);
    const position = ((monthStart - startDate) / totalRange) * 100;
    return {
      position: position,
      name: m.name,
    };
  });

  const CustomDotPoct = (props) => {
    const { cx, cy, value, payload } = props;
    if (value === null) return null;

    const timeColors = {
      before_breakfast: "#00FFFF",
      before_lunch: "#FFD54F",
      before_dinner: "#FF8A65",
      before_bed: "#9575CD",
    };

    const dotColor = timeColors[payload.timeOfDay] || "#4facfe";

    // สร้าง unique ID จาก date + timeOfDay
    const uniqueId = `${payload.fullDate}_${payload.timeOfDay}`;
    const isActive = activeTooltipPoct === uniqueId;

    return (
      <g
        onClick={(e) => {
          e.stopPropagation();
          // Toggle: ถ้ากดซ้ำจะปิด ถ้ากดใหม่จะเปิด
          setActiveTooltipPoct(
            activeTooltipPoct === uniqueId ? null : uniqueId
          );
        }}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 7 : 5}
          fill={dotColor}
          stroke={dotColor}
          strokeWidth={isActive ? 3 : 2.5}
        />
      </g>
    );
  };

  const CustomDotHba1c = (props) => {
    const { cx, cy, value, payload } = props;
    if (value === null) return null;
    const isHigh = value > 7;
    const dotColor = isHigh ? "#ff4757" : "#5DD39E";
    const isActive = activeTooltipHba1c === payload.index;
    return (
      <g
        onClick={(e) => {
          e.stopPropagation();
          setActiveTooltipHba1c(
            activeTooltipHba1c === payload.index ? null : payload.index
          );
        }}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 7 : 5}
          fill={dotColor}
          stroke={dotColor}
          strokeWidth={isActive ? 3 : 2.5}
        />
      </g>
    );
  };

  const CustomDotFbs = (props) => {
    const { cx, cy, value, payload } = props;
    if (value === null) return null;
    
    // กำหนดสีตามเกณฑ์
    let dotColor = "#5DD39E"; // สีเขียว (ควบคุมได้ดี)
    
    if (value >= 183) {
      dotColor = "#ff4757"; // สีแดง (รุนแรง)
    } else if (value >= 155) {
      dotColor = "#FF8A65"; // สีส้ม (พอใช้)
    } else if (value >= 126) {
      dotColor = "#FFD54F"; // สีเหลือง (ดี)
    }
    
    const isActive = activeTooltipFbs === payload.index;
    return (
      <g
        onClick={(e) => {
          e.stopPropagation();
          setActiveTooltipFbs(
            activeTooltipFbs === payload.index ? null : payload.index
          );
        }}
        style={{ cursor: "pointer" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 7 : 5}
          fill={dotColor}
          stroke={dotColor}
          strokeWidth={isActive ? 3 : 2.5}
        />
      </g>
    );
  };

  return (
    <Background>
      <style>{`
        * { outline: none !important; }
        *:focus { outline: none !important; }
        svg { outline: none !important; }
        .recharts-surface { outline: none !important; }
        body, input, button, label, span, p, div { font-size: 16px !important; }
      `}</style>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: "30px",
          }}
        >
            <Header title="บันทึกค่าน้ำตาล" backTo="/menu" />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                color: "white",
                padding: "10px 25px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "24px",
              }}
            >
              🩸 กราฟค่าน้ำตาลปลายนิ้ว 3 เดือนล่าสุด
            </div>
          </div>

          {poctRecords.length > 0 ? (
            <div style={{ marginBottom: "15px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={chartDataPoct}
                  margin={{ top: 40, right: 20, left: 10, bottom: 30 }}
                  onClick={() => setActiveTooltipPoct(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="position"
                    dy={20}
                    type="number"
                    domain={[0, 75]}
                    ticks={monthMarkers.map((m) => m.position)}
                    tickFormatter={(value) => {
                      const marker = monthMarkers.find(
                        (m) => Math.abs(m.position - value) < 1
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
                    content={<CustomTooltipPoct />}
                    cursor={false}
                    isAnimationActive={false}
                  />
                  <ReferenceLine
                    y={180}
                    stroke="#ffcc00"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                  />
                  {[
                    "before_breakfast",
                    "before_lunch",
                    "before_dinner",
                    "before_bed",
                  ].map((timeOfDay) => {
                    const filteredData = chartDataPoct.map((point) =>
                      point.timeOfDay === timeOfDay
                        ? point
                        : { ...point, value: null }
                    );
                    return (
                      <Line
                        key={timeOfDay}
                        type="monotone"
                        dataKey="value"
                        data={filteredData}
                        stroke="#d0d0d0"
                        strokeWidth={2.5}
                        dot={<CustomDotPoct />}
                        activeDot={false}
                        connectNulls={true}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "19px",
                  marginTop: "20px",
                  fontSize: "13px",
                  fontWeight: 500,
                  paddingBottom: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#00FFFF",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}> เช้า</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#FFD54F",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}> เที่ยง</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#FF8A65",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}> เย็น</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#9575CD",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}> ก่อนนอน</span>
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
        </div>

        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginBottom: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                color: "white",
                padding: "10px 8px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              🩸 ระดับน้ำตาลในเลือด (ค่าน้ำตาลปลายนิ้ว)
            </div>
          </div>
          {showInputPoct ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  📅 เลือกวันที่
                </label>
                <input
                  type="date"
                  value={selectedDatePoct}
                  onChange={(e) => setSelectedDatePoct(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #4facfe",
                    borderRadius: "8px",
                    fontSize: "15px",
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
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  ⏰ ช่วงเวลา
                </label>
                <select
                  value={selectedTimePoct}
                  onChange={(e) => setSelectedTimePoct(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #4facfe",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                  }}
                >
                  <option value="before_breakfast">🌅 ก่อนอาหารเช้า</option>
                  <option value="before_lunch">☀️ ก่อนอาหารเที่ยง</option>
                  <option value="before_dinner">🌆 ก่อนอาหารเย็น</option>
                  <option value="before_bed">🌙 ก่อนนอน</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  🩸 ระดับน้ำตาล (mg/dL)
                </label>
                <input
                  type="number"
                  value={newPoct}
                  onChange={(e) => setNewPoct(e.target.value)}
                  placeholder="เช่น 120, 150, 180"
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #4facfe",
                    borderRadius: "8px",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleAddPoct}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setShowInputPoct(false);
                    setNewPoct("");
                    setSelectedDatePoct(new Date().toISOString().split("T")[0]);
                  }}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "#f0f0f0",
                    color: "#666",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
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
              onClick={() => setShowInputPoct(true)}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "20px" }}>+</span>บันทึกค่าน้ำตาลปลายนิ้ว
            </button>
          )}
        </div>

        {/* FBS Section - ย้ายมาอยู่ตำแหน่งที่ 2 */}
        <div
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: "30px",
            marginTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FF9A9E, #FAD0C4)",
                color: "white",
                padding: "10px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              🩸 กราฟ FBS 3 เดือนล่าสุด
            </div>
          </div>
          {fbsRecords.length > 0 ? (
            <div style={{ marginBottom: "15px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={chartDataFbs}
                  margin={{ top: 40, right: 20, left: 20, bottom: 30 }}
                  onClick={() => setActiveTooltipFbs(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="position"
                    dy={20}
                    type="number"
                    domain={[0, 75]}
                    ticks={monthMarkers.map((m) => m.position)}
                    tickFormatter={(value) => {
                      const marker = monthMarkers.find(
                        (m) => Math.abs(m.position - value) < 1
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
                    width={35}
                  />
                  <Tooltip
                    content={<CustomTooltipFbs />}
                    cursor={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF9A9E"
                    strokeWidth={2.5}
                    dot={<CustomDotFbs />}
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
                  marginTop: "20px",
                  fontSize: "13px",
                  fontWeight: 500,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#5DD39E",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>ควบคุมได้ดี (≤125)</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#FFD54F",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>ดี (126-154)</span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#FF8A65",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>พอใช้ (155-182)</span>
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
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>รุนแรง (≥183)</span>
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
        </div>

        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FF9A9E, #FAD0C4)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              🩸 ระดับน้ำตาลขณะอดอาหาร (FBS)
            </div>
          </div>
          {showInputFbs ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  📅 เลือกวันที่
                </label>
                <input
                  type="date"
                  value={selectedDateFbs}
                  onChange={(e) => setSelectedDateFbs(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #FF9A9E",
                    borderRadius: "8px",
                    fontSize: "15px",
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
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  🩸 ระดับ FBS (mg/dL)
                </label>
                <input
                  type="number"
                  value={newFbs}
                  onChange={(e) => setNewFbs(e.target.value)}
                  placeholder="เช่น 100, 130, 160"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #FF9A9E",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleAddFbs}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "linear-gradient(135deg, #FF9A9E, #FAD0C4)",
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
                    setShowInputFbs(false);
                    setNewFbs("");
                    setSelectedDateFbs(
                      new Date().toISOString().split("T")[0]
                    );
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
              onClick={() => setShowInputFbs(true)}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #FF9A9E, #FAD0C4)",
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
              <span style={{ fontSize: "20px" }}>+</span>บันทึกค่า FBS
            </button>
          )}
        </div>

        {/* HbA1c Section */}
        <div
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: "30px",
            marginTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #5DD39E, #00D9A5)",
                color: "white",
                padding: "10px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              📊 กราฟ HbA1c 3 เดือนล่าสุด
            </div>
          </div>
          {hba1cRecords.length > 0 ? (
            <div style={{ marginBottom: "15px" }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={chartDataHba1c}
                  margin={{ top: 40, right: 20, left: 20, bottom: 30 }}
                  onClick={() => setActiveTooltipHba1c(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="position"
                    dy={20}
                    type="number"
                    domain={[0, 75]}
                    ticks={monthMarkers.map((m) => m.position)}
                    tickFormatter={(value) => {
                      const marker = monthMarkers.find(
                        (m) => Math.abs(m.position - value) < 1
                      );
                      return marker ? marker.name : "";
                    }}
                    tick={{ fontSize: 12, fill: "#555", fontWeight: 600 }}
                    axisLine={{ stroke: "#e8e8e8" }}
                  />
                  <YAxis
                    domain={[0, 15]}
                    ticks={[0, 5, 10, 15]}
                    tick={{ fontSize: 11, fill: "#888", fontWeight: 500 }}
                    axisLine={{ stroke: "#e8e8e8" }}
                    width={35}
                  />
                  <Tooltip
                    content={<CustomTooltipHba1c />}
                    cursor={false}
                    isAnimationActive={false}
                  />
                  <ReferenceLine
                    y={7}
                    stroke="#ff6b6b"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#5DD39E"
                    strokeWidth={2.5}
                    dot={<CustomDotHba1c />}
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
                  marginTop: "20px",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "#5DD39E",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>ปกติ (≤7%)</span>
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
                    }}
                  ></div>
                  <span style={{ color: "#666" }}>สูง (&gt;7%)</span>
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
        </div>

        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #5DD39E, #BCE784)",
                color: "white",
                padding: "10px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              📊 ระดับน้ำตาลสะสม (HbA1c)
            </div>
          </div>
          {showInputHba1c ? (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  📅 เลือกวันที่
                </label>
                <input
                  type="date"
                  value={selectedDateHba1c}
                  onChange={(e) => setSelectedDateHba1c(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "2px solid #5DD39E",
                    borderRadius: "8px",
                    fontSize: "15px",
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
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  📊 ระดับ HbA1c (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newHba1c}
                  onChange={(e) => setNewHba1c(e.target.value)}
                  placeholder="เช่น 5.5, 6.2, 7.8"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #10ac84",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleAddHba1c}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "linear-gradient(135deg, #10ac84, #1dd1a1)",
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
                    setShowInputHba1c(false);
                    setNewHba1c("");
                    setSelectedDateHba1c(
                      new Date().toISOString().split("T")[0]
                    );
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
              onClick={() => setShowInputHba1c(true)}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #10ac84, #1dd1a1)",
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
              <span style={{ fontSize: "20px" }}>+</span>บันทึกค่า HbA1c
            </button>
          )}
        </div>
      </div>
      <Footer userData={userData} />
    </Background>
  );
}

export default SugarLevel;