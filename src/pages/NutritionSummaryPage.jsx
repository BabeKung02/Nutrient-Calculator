import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const getFoodRecommendations = (weight, calories, category) => {
  const recommendations = {
    grains: {
      title: "กลุ่มข้าว แป้ง",
      icon: "🍚",
      color: "#F59E0B",
      foods: [
        {
          name: "ข้าวสวย",
          image: "🍚",
          portion:
            weight < 60
              ? "2-3 ทัพพี/มื้อ"
              : weight < 80
                ? "3-4 ทัพพี/มื้อ"
                : "4-5 ทัพพี/มื้อ",
          detail: "ประมาณ 6-12 ทัพพี/วัน",
          calories: 130,
          protein: 2.7,
          fat: 0.3,
          carbs: 28,
        },
        {
          name: "ขนมปังโฮลวีต",
          image: "🍞",
          portion: "2-3 แผ่น/วัน",
          detail: "เลือกแบบธัญพืชเต็มเมล็ด",
          calories: 80,
          protein: 3.5,
          fat: 1,
          carbs: 14,
        },
        {
          name: "บะหมี่/เส้นก๋วยเตี๋ยว",
          image: "🍜",
          portion: weight < 70 ? "1 ทัพพี/มื้อ" : "1.5 ทัพพี/มื้อ",
          detail: "ควรเป็นเส้นที่ต้มสุก",
          calories: 110,
          protein: 3.5,
          fat: 0.5,
          carbs: 22,
        },
        {
          name: "ข้าวโอ๊ต",
          image: "🥣",
          portion: "½-1 ถ้วย/มื้อ",
          detail: "เหมาะสำหรับมื้อเช้า",
          calories: 150,
          protein: 5,
          fat: 3,
          carbs: 27,
        },
      ],
    },
    vegetables: {
      title: "กลุ่มผัก",
      icon: "🥬",
      color: "#10B981",
      foods: [
        {
          name: "ผักใบเขียว",
          image: "🥬",
          portion: "1-2 ถ้วย/มื้อ",
          detail: "คะน้า ผักบุ้ง ผักกาดขาว",
          calories: 25,
          protein: 2.5,
          fat: 0.3,
          carbs: 4,
        },
        {
          name: "ผักสีส้ม-เหลือง",
          image: "🥕",
          portion: "½-1 ถ้วย/วัน",
          detail: "แครอท ฟักทอง มะเขือเทศ",
          calories: 40,
          protein: 1,
          fat: 0.2,
          carbs: 9,
        },
        {
          name: "ผักกาดหอม",
          image: "🥗",
          portion: "1-2 ถ้วย/วัน",
          detail: "เหมาะทำสลัด",
          calories: 12,
          protein: 1,
          fat: 0.1,
          carbs: 2,
        },
        {
          name: "บรอกโคลี่",
          image: "🥦",
          portion: "½-1 ถ้วย/วัน",
          detail: "อุดมด้วยวิตามินซี",
          calories: 30,
          protein: 2.5,
          fat: 0.3,
          carbs: 6,
        },
      ],
    },
    fruits: {
      title: "กลุ่มผลไม้",
      icon: "🍎",
      color: "#F59E0B",
      foods: [
        {
          name: "แอปเปิ้ล",
          image: "🍎",
          portion: "1 ผล/วัน",
          detail: "ผลไม่โตเกินไป",
          calories: 90,
          protein: 0.5,
          fat: 0.3,
          carbs: 23,
        },
        {
          name: "ส้ม",
          image: "🍊",
          portion: "1-2 ผล/วัน",
          detail: "อุดมวิตามินซี",
          calories: 70,
          protein: 1,
          fat: 0.2,
          carbs: 17,
        },
        {
          name: "ฝรั่ง",
          image: "🍐",
          portion: "1-2 ผล/วัน",
          detail: "ใยอาหารสูง",
          calories: 60,
          protein: 0.5,
          fat: 0.5,
          carbs: 14,
        },
        {
          name: "มะเขือเทศ",
          image: "🍅",
          portion: "2-3 ผล/วัน",
          detail: "ทานสดหรือปรุงสุก",
          calories: 25,
          protein: 1,
          fat: 0.3,
          carbs: 5,
        },
      ],
    },
    dairy: {
      title: "กลุ่มนม",
      icon: "🥛",
      color: "#93C5FD",
      foods: [
        {
          name: "นมสดจืด",
          image: "🥛",
          portion: "1-2 แก้ว/วัน",
          detail: "เลือกแบบไขมันต่ำ",
          calories: 125,
          protein: 8,
          fat: 5,
          carbs: 12,
        },
        {
          name: "โยเกิร์ตไม่หวาน",
          image: "🥛",
          portion: "1 ถ้วย/วัน",
          detail: "อุดมด้วยโปรไบโอติก",
          calories: 110,
          protein: 10,
          fat: 3.5,
          carbs: 12,
        },
        {
          name: "นมถั่วเหลือง",
          image: "🥤",
          portion: "1-2 แก้ว/วัน",
          detail: "ทางเลือกสำหรับคนแพ้นม",
          calories: 90,
          protein: 7,
          fat: 4,
          carbs: 8,
        },
        {
          name: "เนยแข็งไขมันต่ำ",
          image: "🧀",
          portion: "1-2 แผ่น/วัน",
          detail: "อุดมแคลเซียม",
          calories: 80,
          protein: 7,
          fat: 5,
          carbs: 1,
        },
      ],
    },
    protein: {
      title: "กลุ่มเนื้อสัตว์",
      icon: "🥩",
      color: "#EF4444",
      foods: [
        {
          name: "เนื้อไก่ไม่มีหนัง",
          image: "🍗",
          portion:
            weight < 60
              ? "3-4 ช้อนโต๊ะ/มื้อ"
              : weight < 80
                ? "4-5 ช้อนโต๊ะ/มื้อ"
                : "5-6 ช้อนโต๊ะ/มื้อ",
          detail: "เลือกส่วนอกไก่",
          calories: 165,
          protein: 31,
          fat: 3.6,
          carbs: 0,
        },
        {
          name: "ปลา",
          image: "🐟",
          portion: "4-6 ช้อนโต๊ะ/มื้อ",
          detail: "อุดมโอเมก้า 3",
          calories: 150,
          protein: 28,
          fat: 4,
          carbs: 0,
        },
        {
          name: "ไข่ไก่",
          image: "🥚",
          portion: "1-2 ฟอง/วัน",
          detail: "ต้ม หรือทอดน้อยน้ำมัน",
          calories: 70,
          protein: 6,
          fat: 5,
          carbs: 0.5,
        },
        {
          name: "ถั่ว",
          image: "🥜",
          portion: "30 กรัม/วัน",
          detail: "โปรตีนจากพืช",
          calories: 160,
          protein: 7,
          fat: 14,
          carbs: 6,
        },
      ],
    },
    // fats: {
    //   title: "กลุ่มไขมัน น้ำตาล เกลือ",
    //   icon: "🫗",
    //   color: "#FCD34D",
    //   foods: [
    //     {
    //       name: "น้ำมันพืช",
    //       image: "🫗",
    //       portion: weight < 70 ? "2-3 ช้อนชา/วัน" : "3-4 ช้อนชา/วัน",
    //       detail: "น้ำมันมะกอก คาโนลา",
    //       calories: 40,
    //       protein: 0,
    //       fat: 4.5,
    //       carbs: 0
    //     },
    //     {
    //       name: "น้ำตาล",
    //       image: "🍯",
    //       portion: "ไม่เกิน 6 ช้อนชา/วัน",
    //       detail: "รวมน้ำตาลในอาหารทุกประเภท",
    //       calories: 16,
    //       protein: 0,
    //       fat: 0,
    //       carbs: 4
    //     },
    //     {
    //       name: "เกลือ",
    //       image: "🧂",
    //       portion: "ไม่เกิน 1 ช้อนชา/วัน",
    //       detail: "ประมาณ 2,000 mg โซเดียม",
    //       calories: 0,
    //       protein: 0,
    //       fat: 0,
    //       carbs: 0
    //     },
    //     {
    //       name: "อโวคาโด",
    //       image: "🥑",
    //       portion: "¼-½ ผล/วัน",
    //       detail: "ไขมันดีจากธรรมชาติ",
    //       calories: 80,
    //       protein: 1,
    //       fat: 7.5,
    //       carbs: 4
    //     }
    //   ]
    // }
  };

  return recommendations[category] || null;
};

function NutritionSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hooks ทั้งหมดต้องอยู่บนสุด
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFoodDetailModal, setShowFoodDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [userData, setUserData] = useState(null);

  // โหลดข้อมูล user
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

  // เช็ค weight หลังจากได้ userData แล้ว
  useEffect(() => {
    if (userData && !userData.weight) {
      navigate("/register");
    }
  }, [userData, navigate]);

  // ✅ return หลังจาก Hooks ทั้งหมด
  if (!userData) return null;

  const state = location.state;

  // const menuItems = [
  //   {
  //     id: 1,
  //     title: "บันทึกการรับประทานอาหาร",
  //     icon: "🍽️",
  //     color: "#FFA500",
  //     onClick: () => navigate("/meal", { state: userData }),
  //   },
  // ];

  // Define clickable regions for the food chart
  const handleImageClick = (e) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x < 50 && y > 30 && y < 70) {
      handleCategoryClick("vegetables");
    } else if (x > 50 && y < 35) {
      handleCategoryClick("grains");
    } else if (x > 50 && y > 50 && y < 75) {
      handleCategoryClick("protein");
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
  };

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setShowFoodDetailModal(true);
  };

  const commonImgStyle = {
    width: "100%",
    height: "135px",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "transform 0.3s",
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between", // หรือ space-around / space-evenly
    gap: "20px",
  };

  const leftImgStyle = {
    ...commonImgStyle,
    transform: "translateX(10px)",
  };

  const rightImgStyle = {
    ...commonImgStyle,
    transform: "translateX(-10px)",
  };

  const handleMouseOver = (e) =>
    (e.currentTarget.style.transform = "scale(1.02)");
  const handleMouseOut = (e) => (e.currentTarget.style.transform = "scale(1)");

  const closeFoodDetailModal = () => {
    setShowFoodDetailModal(false);
    setSelectedFood(null);
  };

  const currentRecommendation = selectedCategory
    ? getFoodRecommendations(state.weight, state.calories, selectedCategory)
    : null;

  // const handleSave = () => {
  //   navigate("/summary-data", {
  //     state: {
  //       ...state
  //     },
  //   });
  // };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgb(183, 199, 255) 0%, rgb(229, 212, 251) 100%)",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            borderRadius: "30px",
          }}
        >
          <Header title="โภชนาการอาหาร" backTo="/menu" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            {/* {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                style={{
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  padding: "10px 15px",
                  borderRadius: "10px",
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s",
                  width: "90%",
                  margin: "20px auto",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "30px", marginTop: "-8px" }}>{item.icon}</div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    flex: 1,
                    marginLeft: "15px",
                    whiteSpace: "pre-line",
                    marginLeft: "5px",
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
            ))} */}
          </div>

          <div style={{}}>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: "25px",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              💡คลิกที่แต่ละส่วนเพื่อดูคำแนะนำอาหาร
            </p>

            <div
              style={{
                maxWidth: "",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <img
                src="/food_chart.png"
                alt="Food Chart"
                onClick={handleImageClick}
                style={{
                  width: "100%",
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: "10px",
                  transition: "transform 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />

              <div style={{ display: "flex", gap: "30px" }}>
                {/* 2. รูปนม (Dairy) - คลิกแล้วส่ง 'dairy' เลย */}
                <img
                  src="/milk.png"
                  alt="Milk Group"
                  onClick={() => handleCategoryClick("dairy")} // เรียกตรงๆ ไม่ต้องคำนวณ
                  style={leftImgStyle}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                />

                {/* 3. รูปผลไม้ (Fruits) - คลิกแล้วส่ง 'fruits' เลย */}
                <img
                  src="/fruit.png"
                  alt="Fruit Group"
                  onClick={() => handleCategoryClick("fruits")} // เรียกตรงๆ ไม่ต้องคำนวณ
                  style={rightImgStyle}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                />
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                margin: "20px 0",
                color: "green",
                fontSize: "16px",
              }}
            >
              <strong>
                เมนูอาหารที่แนะนำและวิธีทำ
                <p
                  style={{ color: "#666", fontSize: "14px", marginTop: "5px" }}
                >
                  (คลิกที่รูปภาพเพื่อดูสูตรการทำอาหาร)
                </p>
              </strong>
            </div>

            {/* Food Menu Gallery */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                marginTop: "20px",
                padding: "0 10px",
              }}
            >
              {[
                {
                  img: "/pork_noodle_soup.png",
                  name: "เกาเหลาหมู",
                  link: "https://drive.google.com/file/d/1Pn1Kpfcz5r_RGnA0lWXfIg_uYuzmpkKt/view?usp=drive_link",
                },
                {
                  img: "/chinese_cabbage_soup.jpg",
                  name: "แกงจืดผักกาดขาวเต้าหู้หมูสับ",
                  link: "https://drive.google.com/file/d/1lKod899k0NGDbJbewzP0gubwdjVYj_yi/view?usp=drive_link",
                },
                {
                  img: "/green_pumpkin_minced_pork_soup.png",
                  name: "แกงจืดฟักเขียวหมูสับ",
                  link: "https://drive.google.com/file/d/14Py2AOMD82kVcBGGj9AgISh0IwFj1LEn/view?usp=drive_link",
                },
                {
                  img: "/brownrice_chicken_basil_herbs.png",
                  name: "ข้าวกล้องไก่ราดกะเพราไก่สมุนไพร",
                  link: "https://drive.google.com/file/d/1ExGlyB-nwIyb8s9EFohFiFW1jLVH_1zf/view?usp=drive_link",
                },
                {
                  img: "/stir_fried_benjarong_vegetables.png",
                  name: "ผัดผักเบญจรงค์",
                  link: "https://drive.google.com/file/d/1ABKDgyqxyKW-HO4htQDxERLY6CPZqYlK/view?usp=drive_link",
                },
                {
                  img: "/stir_fried_bitter_melon_egg.png",
                  name: "ผัดมะระขี้นกผัดไข่",
                  link: "https://drive.google.com/file/d/11Vsq_WoHkrHfqyd3Stjlv6dBMycX440J/view?usp=drive_link",
                },
                {
                  img: "/stir_fried_zucchini_chicken.png",
                  name: "ผัดบวบใส่ไก่",
                  link: "https://drive.google.com/file/d/1R44VfbBhU7SCMYjC8kCKtVduqcJBo77S/view?usp=drive_link",
                },
                {
                  img: "/three_color_steamed_eggs.png",
                  name: "ไข่ตุ๋นสามสี",
                  link: "https://drive.google.com/file/d/1dF8wtIBZ7nhDm2lwyCacDeRCJxbfwNyd/view?usp=drive_link",
                },
                {
                  img: "/three_friends_soup.png",
                  name: "แกงจืดสามสหาย",
                  link: "https://drive.google.com/file/d/1nvYXewIRDhRaAlaPRQ8Lp1qAWyYE70rA/view?usp=drive_link",
                },
                {
                  img: "/red_tilapia_salad.png",
                  name: "ลาบปลาทับทิม",
                  link: "https://drive.google.com/file/d/1X_rfSaPUiwrI7TLma-ehZJeQxbX6LVM4/view?usp=drive_link",
                },
                {
                  img: "/pork_curry_milk.png",
                  name: "แกงหมูเทโพนมพร่องมันเนย",
                  link: "https://drive.google.com/file/d/1G_YWcBTGQ4xURiM911lGRcxTzZ3-v5r6/view?usp=drive_link",
                },
                {
                  img: "/nile_tilapia_chili_paste.png",
                  name: "น้ำพริกปลานิล",
                  link: "https://drive.google.com/file/d/1bcZIRkK-0MpJvY_PPhUK_L2WUFY-Xi7T/view?usp=drive_link",
                },
              ].map((menu, index) => (
                <a
                  key={index}
                  href={menu.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "115px",
                      overflow: "hidden",
                      background: "#f5f5f5",
                    }}
                  >
                    <img
                      src={menu.img}
                      alt={menu.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#333",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {menu.name}
                    </p>
                    <p
                      style={{
                        margin: "5px 0 0 0",
                        color: "#667eea",
                        fontSize: "12px",
                      }}
                    ></p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* {(state.hasDiabetes || state.hasHypertension) && (
            <div
              style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "10px",
                padding: "15px",
                margin: "20px 0",
                textAlign: "center",

              }}
            >
              <strong>หมายเหตุ:</strong>{" "}
              ค่าพลังงานและสัดส่วนสารอาหารถูกปรับตามโรคประจำตัวของคุณ
              {state.hasDiabetes && " (เบาหวาน)"}
              {state.hasDiabetes && state.hasHypertension && " และ"}
              {state.hasHypertension && " (ความดันโลหิตสูง)"}
            </div>
          )} */}

          {/* <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button 
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              บันทึกและดำเนินการต่อ
            </button>
          </div> */}
        </div>
      </div>

      {/* Category Modal - แสดงรายการอาหารแค่ภาพ */}
      {showCategoryModal && currentRecommendation && (
        <div
          onClick={closeCategoryModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              maxWidth: "500px",
              marginBottom: "100px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={closeCategoryModal}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(0,0,0,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                zIndex: 10,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.1)")
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div
              style={{
                background: `linear-gradient(135deg, ${currentRecommendation.color}, ${currentRecommendation.color}dd)`,
                padding: "30px",
                borderRadius: "20px 20px 0 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "60px", marginBottom: "10px" }}>
                {currentRecommendation.icon}
              </div>
              <h3
                style={{
                  color: "white",
                  fontSize: "28px",
                  margin: 0,
                  fontWeight: "700",
                }}
              >
                {currentRecommendation.title}
              </h3>
            </div>

            <div style={{ padding: "25px" }}>
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              ></p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "15px",
                }}
              >
                {currentRecommendation.foods.map((food, index) => (
                  <div
                    key={index}
                    onClick={() => handleFoodClick(food)}
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "15px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      border: "2px solid transparent",
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.borderColor =
                        currentRecommendation.color;
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "70px",
                        marginBottom: "10px",
                      }}
                    >
                      {food.image}
                    </div>
                    <h4
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        margin: 0,
                        fontWeight: "600",
                      }}
                    >
                      {food.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Detail Modal - แสดงข้อมูลเต็ม */}
      {showFoodDetailModal && selectedFood && (
        <div
          onClick={closeFoodDetailModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              maxWidth: "450px",
              width: "100%",
              position: "relative",
              animation: "slideUp 0.3s ease-out",
              marginBottom: "112px",
            }}
          >
            <button
              onClick={closeFoodDetailModal}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(0,0,0,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                zIndex: 10,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.1)")
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div
              style={{
                background: `linear-gradient(135deg, ${currentRecommendation?.color}, ${currentRecommendation?.color}dd)`,
                padding: "40px 30px",
                borderRadius: "20px 20px 0 0",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                }}
              >
                {selectedFood.image}
              </div>
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  margin: 0,
                  fontWeight: "700",
                }}
              >
                {selectedFood.name}
              </h3>
            </div>

            <div
              style={{
                padding: "30px",
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: currentRecommendation?.color,
                    marginBottom: "8px",
                    fontSize: "15px",
                  }}
                >
                  📊 ปริมาณแนะนำ:
                </div>
                <div
                  style={{ fontSize: "18px", color: "#333", fontWeight: "600" }}
                >
                  {selectedFood.portion}
                </div>
                <div
                  style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}
                >
                  {selectedFood.detail}
                </div>
              </div>

              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "15px",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  ⚡ คุณค่าทางโภชนาการ
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      แคลอรี่
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#FF6B6B",
                      }}
                    >
                      {selectedFood.calories}
                    </div>
                    <div style={{ fontSize: "11px", color: "#999" }}>kcal</div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      โปรตีน
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#4ECDC4",
                      }}
                    >
                      {selectedFood.protein}
                    </div>
                    <div style={{ fontSize: "11px", color: "#999" }}>g</div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      ไขมัน
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#FFE66D",
                      }}
                    >
                      {selectedFood.fat}
                    </div>
                    <div style={{ fontSize: "11px", color: "#999" }}>g</div>
                  </div>
                  <div
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      คาร์โบไฮเดรต
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#95E1D3",
                      }}
                    >
                      {selectedFood.carbs}
                    </div>
                    <div style={{ fontSize: "11px", color: "#999" }}>g</div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#e8f4fd",
                  padding: "15px",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                💡 ข้อมูลคำนวณจากน้ำหนัก {state.weight} กก.
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default NutritionSummaryPage;
