import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Background from "../components/Background";

function FootExaminationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stateData = location.state;
    const savedData = localStorage.getItem("userData");

    if (stateData) {
      setUserData(stateData);
    } else if (savedData) {
      setUserData(JSON.parse(savedData));
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  if (!userData) return null;

  const footExamMenuItems = [
    {
      id: 1,
      title: "เริ่มการตรวจเท้า",
      icon: "👤",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      onClick: () => navigate("/foot-exam/data", { state: userData }),
    },
    {
      id: 2,
      title: "การดูแลเท้า",
      icon: "🏥",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      onClick: () => navigate("/foot-exam/care", { state: userData }),
    },
    {
      id: 3,
      title: "ประวัติการตรวจเท้า",
      icon: "📋",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      onClick: () => navigate("/foot-exam/history", { state: userData }),
    },
  ];

  return (
    <Background>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            background: "white",
            padding: "0",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <Header title="การตรวจเท้า" backTo="/menu" />

          {/* Menu Items */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              margin: "12px",
              padding: "0 15px 15px 15px",
            }}
          >
          {footExamMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              style={{
                background: item.gradient,
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
                  whiteSpace: "pre-line",
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
      <Footer/>
    </Background>
  );
}

export default FootExaminationPage;