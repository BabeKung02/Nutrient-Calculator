import { useNavigate, useSearchParams } from "react-router-dom"; // เพิ่ม useSearchParams
import Header from "../components/Header";

function FoodLogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // เรียกใช้ Hook เพื่อดึงค่าจาก URL

  // ดึงค่า mealId และ mealName จาก URL
  const mealId = searchParams.get("mealId");
  const mealName = searchParams.get("mealName");

  const foodCategories = [
    {
      id: 1,
      name: "ข้าว - แป้ง",
      icon: "🍚",
      gradient: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
      route: "/food/rice-flour",
    },
    {
      id: 2,
      name: "ผัก",
      icon: "🥬",
      gradient: "linear-gradient(135deg, #55efc4 0%, #00b894 100%)",
      route: "/food/vegetable",
    },
    {
      id: 3,
      name: "เนื้อสัตว์",
      icon: "🥩",
      gradient: "linear-gradient(135deg, #fab1a0 0%, #e17055 100%)",
      route: "/food/meat",
    },
    {
      id: 4,
      name: "ผลไม้",
      icon: "🍎",
      gradient: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
      route: "/food/fruit",
    },
    {
      id: 5,
      name: "นม",
      icon: "🥛",
      gradient: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
      route: "/food/dairy",
    },
    {
      id: 6,
      name: "ขนม",
      icon: "🍰",
      gradient: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
      route: "/food/dessert",
    },
        {
      id: 7,
      name: "ไขมัน หรือ น้ำมัน",
      icon: "🧈",
      gradient: "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)",
      route: "/food/fat",
    },
        {
      id: 8,
      name: "อาหาร",
      icon: "🍛",
      gradient: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)",
      route: "/food/single-dish",
    },
  ];

  const handleCategoryClick = (category) => {
    // ส่งต่อค่า mealId และ mealName ไปยังหน้าบันทึกอาหาร
    // เช่น /food/rice-flour?mealId=breakfast&mealName=มื้อเช้า
    navigate(`${category.route}?mealId=${mealId}&mealName=${mealName}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "40px 15px",
        background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {/* ปรับ Header ให้ Back กลับไปหน้า Meal ได้ถูกต้อง */}
          <Header title="เลือกหมวดหมู่อาหาร" backTo="/meal" />

          {/* แสดงข้อมูลว่ากำลังบันทึกมื้อไหนอยู่ (Optional) */}
          <div style={{ textAlign: "center", paddingTop: "15px", color: "#667eea", fontWeight: "600" }}>
             กำลังบันทึก: {mealName || "ไม่ระบุ"}
          </div>

          {/* Food Categories Grid */}
          <div style={{ padding: "20px 15px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
              }}
            >
              {foodCategories.map((category) => {
                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "30px 20px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      border: "3px solid transparent",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Gradient Background */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "8px",
                        background: category.gradient,
                      }}
                    />

                    {/* Icon */}
                    <div
                      style={{
                        fontSize: "3.5rem",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}
                    >
                      {category.icon}
                    </div>

                    {/* Category Name */}
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        textAlign: "center",
                      }}
                    >
                      {category.name}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Text */}
          <div
            style={{
              padding: "0 15px 20px 15px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#718096",
              }}
            >
              💡 เลือกประเภทอาหารที่คุณต้องการบันทึก
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodLogPage;