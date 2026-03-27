import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Background from "../components/Background";
import Footer from "../components/Footer";

// ─── Config ───────────────────────────────────

const FOOD_CATEGORIES = [
  { id: 1, name: "ข้าว - แป้ง",     icon: "🍚", gradient: "linear-gradient(135deg, #ffeaa7, #fdcb6e)", route: "/food/rice-flour"   },
  { id: 2, name: "ผัก",             icon: "🥬", gradient: "linear-gradient(135deg, #55efc4, #00b894)", route: "/food/vegetable"    },
  { id: 3, name: "เนื้อสัตว์",      icon: "🥩", gradient: "linear-gradient(135deg, #fab1a0, #e17055)", route: "/food/meat"         },
  { id: 4, name: "ผลไม้",           icon: "🍎", gradient: "linear-gradient(135deg, #ff7675, #d63031)", route: "/food/fruit"        },
  { id: 5, name: "นม",              icon: "🥛", gradient: "linear-gradient(135deg, #a29bfe, #6c5ce7)", route: "/food/dairy"        },
  { id: 6, name: "ขนม",             icon: "🍰", gradient: "linear-gradient(135deg, #fd79a8, #e84393)", route: "/food/dessert"      },
  { id: 7, name: "ไขมัน / น้ำมัน", icon: "🧈", gradient: "linear-gradient(135deg, #feca57, #ff9ff3)", route: "/food/fat"          },
  { id: 8, name: "อาหาร",           icon: "🍛", gradient: "linear-gradient(135deg, #fd79a8, #e84393)", route: "/food/single-dish"  },
];

// ─── Sub-components ───────────────────────────

function MealBadge({ mealName }) {
  return (
    <div style={styles.badge}>
      กำลังบันทึก: <b>{mealName || "ไม่ระบุ"}</b>
    </div>
  );
}

function CategoryCard({ category, onClick }) {
  return (
    <div
      onClick={onClick}
      style={styles.categoryCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ ...styles.cardTopBar, background: category.gradient }} />
      <div style={styles.cardIcon}>{category.icon}</div>
      <h3 style={styles.cardName}>{category.name}</h3>
    </div>
  );
}

// ─── Main Component ───────────────────────────

function FoodLogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mealId   = searchParams.get("mealId");
  const mealName = searchParams.get("mealName");

  const handleCategoryClick = (category) => {
    navigate(`${category.route}?mealId=${mealId}&mealName=${mealName}`);
  };

  return (
    <Background>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <Header title="เลือกหมวดหมู่อาหาร" backTo="/meal" />

          <div style={styles.inner}>
            <MealBadge mealName={mealName} />

            <div style={styles.grid}>
              {FOOD_CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>

            <p style={styles.hint}>💡 เลือกประเภทอาหารที่คุณต้องการบันทึก</p>
          </div>
        </div>
      </div>
      <Footer />
    </Background>
  );
}

export default FoodLogPage;

// ─── Styles ───────────────────────────────────

const styles = {
  wrapper: {
    maxWidth: "600px",
    width: "100%",
    paddingBottom: "80px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  inner: {
    padding: "16px 15px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  badge: {
    textAlign: "center",
    color: "#17BCBC",
    fontWeight: 500,
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  categoryCard: {
    background: "white",
    borderRadius: "16px",
    padding: "30px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
  cardTopBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "8px",
  },
  cardIcon: {
    fontSize: "3.5rem",
    marginBottom: "12px",
  },
  cardName: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#2d3748",
  },
  hint: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#718096",
    textAlign: "center",
  },
};