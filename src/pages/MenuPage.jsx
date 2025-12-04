import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stateData = location.state;
    const savedData = localStorage.getItem("userData");

    if (stateData) {
      setUserData(stateData);
      localStorage.setItem("userData", JSON.stringify(stateData));
    } else if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      navigate("/");
    }
  }, [location, navigate]);

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
      onClick: () =>
        (window.location.href =
          "https://drive.google.com/file/d/1Pn1Kpfcz5r_RGnA0lWXfIg_uYuzmpkKt/view?usp=drive_link"),
    },
  ];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "50px 20px",
        background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        {/* User Info Card */}
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "10px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              padding: "3px 10px",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 600,
              display: "inline-block",
              marginBottom: "8px",
            }}
          >
            ข้อมูลผู้ใช้
          </div>

          <h3 style={{ margin: 0, fontSize: "15px" }}>
            {userData.firstName} {userData.lastName}
          </h3>

          <p style={{ marginTop: "10px", color: "#666", fontSize: "11px" }}>
            {userData.gender === "male" ? "ชาย" : "หญิง"} • {userData.age} ปี
          </p>

          <div
            style={{
              marginTop: "8px",
              borderTop: "1px solid #eee",
              paddingTop: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#666", fontSize: "11px" }}>BMI</span>
              <span style={{ color: "#667eea", fontWeight: 700 }}>
                {userData.bmi}
              </span>
            </div>

            <div
              style={{
                background: "#f8f9fa",
                fontSize: "14px",
                padding: "8px",
                textAlign: "center",
                borderRadius: "4px",
                marginBottom: "6px",
              }}
            >
              {userData.bmiCategory}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#666" }}>
                พลังงานต่อวัน
              </span>
              <span style={{ color: "#ff6b6b", fontWeight: 700 }}>
                {userData.calories?.toLocaleString()} kcal
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/", { state: userData })}
            style={{
              width: "100%",
              style: "margin:0 5px 2px 0;",
              padding: "6px",
              color: "white",
              borderRadius: "6px",
              fontSize: "14px",
              border: "none",
              marginTop: "10px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              cursor: "pointer",
            }}
          >
            <svg
              style={{ margin: "0 5px 2px 0" }}
              width="14"
              height="14"
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
              gap: "20px",
              padding: "5px",
              height: "260px",
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                style={{
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  padding: "12px",
                  borderRadius: "10px",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ fontSize: "26px" }}>{item.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  {item.title}
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
