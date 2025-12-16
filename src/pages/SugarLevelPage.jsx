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

function SugarLevel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [poctRecords, setPoctRecords] = useState([]);
  const [hba1cRecords, setHba1cRecords] = useState([]);
  const [newPoct, setNewPoct] = useState("");
  const [newHba1c, setNewHba1c] = useState("");
  const [selectedDatePoct, setSelectedDatePoct] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDateHba1c, setSelectedDateHba1c] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showInputPoct, setShowInputPoct] = useState(false);
  const [showInputHba1c, setShowInputHba1c] = useState(false);
  const [activeTooltipPoct, setActiveTooltipPoct] = useState(null);
  const [activeTooltipHba1c, setActiveTooltipHba1c] = useState(null);

  const CustomTooltipPoct = ({ active, payload }) => {
    if (active && payload && payload.length && activeTooltipPoct !== null) {
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

  useEffect(() => {
    const stateData = location.state;
    const savedData = localStorage.getItem("userData");
    const savedPoct = localStorage.getItem("poctRecords");
    const savedHba1c = localStorage.getItem("hba1cRecords");

    if (stateData) {
      setUserData(stateData);
      localStorage.setItem("userData", JSON.stringify(stateData));
    } else if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      navigate("/");
    }

    if (savedPoct) {
      setPoctRecords(JSON.parse(savedPoct));
    }

    if (savedHba1c) {
      setHba1cRecords(JSON.parse(savedHba1c));
    }
  }, [location, navigate]);

  const handleAddPoct = () => {
    if (newPoct && !isNaN(newPoct)) {
      const selectedDateTime = new Date(selectedDatePoct + "T12:00:00");
      const year = selectedDateTime.getFullYear();
      const month = String(selectedDateTime.getMonth()+1).padStart(2, "0");
      const day = String(selectedDateTime.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const newRecord = {
        value: parseFloat(newPoct),
        date: selectedDateTime.toISOString(),
        dateKey: dateKey,
      };

      const filteredRecords = poctRecords.filter((r) => r.dateKey !== dateKey);
      const updatedRecords = [...filteredRecords, newRecord];

      setPoctRecords(updatedRecords);
      localStorage.setItem("poctRecords", JSON.stringify(updatedRecords));
      setNewPoct("");
      setShowInputPoct(false);
      setSelectedDatePoct(new Date().toISOString().split("T")[0]);
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
      localStorage.setItem("hba1cRecords", JSON.stringify(updatedRecords));
      setNewHba1c("");
      setShowInputHba1c(false);
      setSelectedDateHba1c(new Date().toISOString().split("T")[0]);
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

  console.log("HbA1c Records:", hba1cRecords);
  console.log("Chart Data HbA1c:", chartDataHba1c);
  console.log("Recent HbA1c:", recentHba1cRecords);

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
    const isHigh = value > 180;
    const isActive = activeTooltipPoct === payload.index;
    return (
      <g
        onClick={(e) => {
          e.stopPropagation();
          setActiveTooltipPoct(
            activeTooltipPoct === payload.index ? null : payload.index
          );
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

  const CustomDotHba1c = (props) => {
    const { cx, cy, value, payload } = props;
    if (value === null) return null;
    const isHigh = value > 7;
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
          fill="white"
          stroke={isHigh ? "#ff4757" : "#5DD39E"}
          strokeWidth={isActive ? 3 : 2.5}
        />
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
  * { outline: none !important; } 
  *:focus { outline: none !important; } 
  svg { outline: none !important; } 
  .recharts-surface { outline: none !important; }
  body, input, button, label, span, p, div {
    font-size: 16px !important;
  }
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
                padding: "10px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                marginTop: "24px",
              }}
            >
              🩸 กราฟ POCT 3 เดือนล่าสุด
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
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4facfe"
                    strokeWidth={2.5}
                    dot={<CustomDotPoct />}
                    activeDot={false}
                    connectNulls={false}
                  />
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
                padding: "10px 45px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              🩸 ระดับน้ำตาลในเลือด (POCT)
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
              <span style={{ fontSize: "20px" }}>+</span>บันทึกค่า POCT
            </button>
          )}
        </div>

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
                      border: "2px solid white",
                      boxShadow: "0 0 0 1px #5DD39E",
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
                      border: "2px solid white",
                      boxShadow: "0 0 0 1px #ff4757",
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
    </div>
  );
}

export default SugarLevel;
