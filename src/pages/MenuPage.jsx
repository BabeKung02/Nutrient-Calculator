import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../components/Background";
import Footer from "../components/Footer";

function MenuPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");
    navigate("/");
  };

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
    // {
    //   id: 2,
    //   title: "โภชนาการอาหาร",
    //   icon: "🥗",
    //   color: "#43C6A0", // เขียวมิ้นท์ — nutrition/health
    //   onClick: () => navigate("/summary", { state: userData }),
    // },
    {
      id: 3,
      title: "บันทึกการรับประทานอาหาร",
      icon: "🍽️",
      color: "#F7A84A", // ส้มอบอุ่น — food/meal
      onClick: () => navigate("/meal", { state: userData }),
    },
    {
      id: 4,
      title: "บันทึกค่าน้ำตาล",
      icon: "🩸",
      color: "#F06292", // ชมพูแดง — blood sugar (medical alert)
      onClick: () => navigate("/sugar-level", { state: userData }),
    },
    {
      id: 5,
      title: "บันทึกยาที่ได้รับ",
      icon: "💊",
      color: "#AB82D4", // ม่วงลาเวนเดอร์ — medication
      onClick: () => navigate("/medication", { state: userData }),
    },
    {
      id: 6,
      title: "บันทึกการตรวจเท้า",
      icon: "🦶",
      color: "#4DB6AC", // teal — physical check
      onClick: () => navigate("/foot-exam", { state: userData }),
    },
    {
      id: 7,
      title: "บันทึกนัดพบแพทย์",
      icon: "🏥",
      color: "#5B8DEF", // น้ำเงิน — doctor/appointment
      onClick: () => navigate("/doctor-record", { state: userData }),
    },
    {
      id: 8,
      title: "บทความเกี่ยวกับเบาหวาน",
      icon: "📖",
      color: "#78909C", // เทาน้ำเงิน — content/article
      onClick: () => alert("Coming soon!"),
    },
  ];

  return (
    <Background>
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            position: "relative",
            background: "white",
            padding: "40px 15px 15px 15px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              background: "#f1f5f9",
              border: "none",
              borderBottomLeftRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fee2e2";
              e.currentTarget.style.color = "#b91c1c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            ออกจากระบบ
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "12px",
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
      <Footer userData={userData} />
    </Background>
  );
}

export default MenuPage;
