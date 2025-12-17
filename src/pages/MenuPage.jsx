import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    {
      id: 1,
      title: "ข้อมูลส่วนตัว",
      icon: "👤",
      color: "#667eea",
      onClick: () => navigate("/personal", { state: userData }),
    },
    {
      id: 2,
      title: "โภชนาการอาหาร",
      icon: "🍽️",
      color: "#f093fb",
      onClick: () => navigate("/summary", { state: userData }),
    },
    {
      id: 3,
      title: "บันทึกค่าน้ำตาล",
      icon: "⬜",
      color: "#4facfe",
      onClick: () => navigate("/sugar-level", { state: userData }),
    },
    {
      id: 4,
      title: "บันทึกยาที่ได้รับ",
      icon: "💊",
      color: "#fa709a",
      onClick: () => alert("Coming soon!"),
    },
    {
      id: 5,
      title: "บันทึกการตรวจเท้า",
      icon: "🏥",
      color: "#ff6b6b",
      onClick: () => alert("Coming soon!"),
    },
    {
      id: 6,
      title: "บันทึกนัดที่ต้องไปพบแพทย์",
      icon: "👨‍⚕️",
      color: "#48dbfb",
      onClick: () => alert("Coming soon!"),
    },
    {
      id: 7,
      title: "บทความให้ความรู้ต่างๆ\nเกี่ยวกับเบาหวาน",
      icon: "📝",
      color: "#54a0ff",
      onClick: () => alert("Coming soon!"),
    },
  ];

  return (
<div
    style={{
      width: "100vw",
      minHeight: "100vh",
      padding: "40px 15px", // เพิ่ม padding บนเล็กน้อยเพื่อให้กล่องไม่ชิดขอบจอเกินไป
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
        <div
        style={{
          position: "relative", // เพิ่มบรรทัดนี้เพื่อให้ปุ่มอ้างอิงตำแหน่งกับกล่องขาว
          background: "white",
          padding: "40px 15px 15px 15px", // เพิ่ม padding top เพื่อเว้นที่ให้ปุ่มไม่บังเนื้อหา
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          overflow: "hidden", // ช่วยให้มุมของปุ่มตัดพอดีกับความโค้งของกล่อง (ถ้าต้องการ)
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "0",    // ชิดขอบบนสุด
            right: "0",  // ชิดขอบขวาสุด
            background: "#f1f5f9",
            border: "none",
            borderBottomLeftRadius: "12px", // มนเฉพาะมุมล่างซ้าย
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
    </div>
  );
}

export default MenuPage;
