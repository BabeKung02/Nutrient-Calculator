import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "#faf8ff",
    boxSizing: "border-box",
    fontFamily: "'Prompt', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(102,126,234,0.3)",
    position: "relative",
    overflow: "hidden",
  },

  content: {
    padding: "24px",
  },
  name: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#2d3748",
  },
  subText: {
    textAlign: "center",
    fontSize: "15px",
    color: "#718096",
    marginBottom: "28px",
    fontWeight: 500,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  infoCard: {
    borderRadius: "16px",
    padding: "18px",
    textAlign: "center",
    fontWeight: 600,
  },
  editBtn: {
    width: "100%",
    marginTop: "24px",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "16px",
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(102,126,234,0.4)",
  },
};

const PersonalPage = () => {
  const navigate = useNavigate();
  const { state: userData } = useLocation();

  if (!userData) {
    return <p>ไม่พบข้อมูลผู้ใช้ กรุณากลับไปหน้าเดิม</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <Header title="ข้อมูลส่วนตัว" backTo="/menu" />

        {/* Content */}
        <div style={styles.content}>
          <h3 style={styles.name}>
            {userData.firstName} {userData.lastName}
          </h3>
          <p style={styles.subText}>
            {userData.gender === "male" ? "ชาย" : "หญิง"} • {userData.age} ปี
          </p>

          <div style={styles.grid}>
            <div
              style={{
                ...styles.infoCard,
                background: "linear-gradient(135deg, #fef5e7, #fdebd0)",
                border: "2px solid #f9e79f",
              }}
            >
              <div>น้ำหนัก</div>
              <div style={{ fontSize: "28px", color: "#d68910" }}>
                {userData.weight}
              </div>
              <small>kg</small>
            </div>

            <div
              style={{
                ...styles.infoCard,
                background: "linear-gradient(135deg, #e8f8f5, #d1f2eb)",
                border: "2px solid #a3e4d7",
              }}
            >
              <div>ส่วนสูง</div>
              <div style={{ fontSize: "28px", color: "#1abc9c" }}>
                {userData.height}
              </div>
              <small>cm</small>
            </div>
          </div>

          <div
            style={{
              ...styles.infoCard,
              background: "#f7fafc",
              border: "2px solid #e2e8f0",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#718096" }}>BMI</div>
            <div style={{ fontSize: "32px", color: "#667eea" }}>
              {userData.bmi}
            </div>
            <div>{userData.bmiCategory}</div>
          </div>

          <div
            style={{
              ...styles.infoCard,
              background: "linear-gradient(135deg, #fff5f5, #fed7d7)",
              border: "2px solid #feb2b2",
            }}
          >
            <div>พลังงานต่อวัน</div>
            <div style={{ fontSize: "32px", color: "#e53e3e" }}>
              {userData.calories?.toLocaleString()} kcal
            </div>
          </div>

          <button
            style={styles.editBtn}
            onClick={() => navigate("/register", { state: userData })}
          >
            <svg
              style={{
                position: "relative",
                right: "6px",
                marginTop: "-5px",
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2" // หนาขึ้นนิด
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            แก้ไขข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
