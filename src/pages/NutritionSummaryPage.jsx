import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { calculateNutrition } from "../utils/nutritionCalculator";
import "../styles/NutritionSummary.css";
import FOODS from "../data/food";

// Food recommendations based on weight and calories
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
          portion: weight < 60 ? "2-3 ทัพพี/มื้อ" : weight < 80 ? "3-4 ทัพพี/มื้อ" : "4-5 ทัพพี/มื้อ",
          detail: "ประมาณ 6-12 ทัพพี/วัน",
          calories: "130 kcal/ทัพพี"
        },
        {
          name: "ขนมปังโฮลวีต",
          image: "🍞",
          portion: "2-3 แผ่น/วัน",
          detail: "เลือกแบบธัญพืชเต็มเมล็ด",
          calories: "80 kcal/แผ่น"
        },
        {
          name: "บะหมี่/เส้นก๋วยเตี๋ยว",
          image: "🍜",
          portion: weight < 70 ? "1 ทัพพี/มื้อ" : "1.5 ทัพพี/มื้อ",
          detail: "ควรเป็นเส้นที่ต้มสุก",
          calories: "110 kcal/ทัพพี"
        },
        {
          name: "ข้าวโอ๊ต",
          image: "🥣",
          portion: "½-1 ถ้วย/มื้อ",
          detail: "เหมาะสำหรับมื้อเช้า",
          calories: "150 kcal/ถ้วย"
        }
      ]
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
          calories: "20-30 kcal/ถ้วย"
        },
        {
          name: "ผักสีส้ม-เหลือง",
          image: "🥕",
          portion: "½-1 ถ้วย/วัน",
          detail: "แครอท ฟักทอง มะเขือเทศ",
          calories: "30-50 kcal/ถ้วย"
        },
        {
          name: "ผักกาดหอม",
          image: "🥗",
          portion: "1-2 ถ้วย/วัน",
          detail: "เหมาะทำสลัด",
          calories: "10-15 kcal/ถ้วย"
        },
        {
          name: "บรอกโคลี่",
          image: "🥦",
          portion: "½-1 ถ้วย/วัน",
          detail: "อุดมด้วยวิตามินซี",
          calories: "30 kcal/ถ้วย"
        }
      ]
    },
    fruits: {
      title: "กลุ่มผลไม้ (ไม่หวาน)",
      icon: "🍎",
      color: "#F59E0B",
      foods: [
        {
          name: "แอปเปิ้ล",
          image: "🍎",
          portion: "1 ผล/วัน",
          detail: "ผลไม่โตเกินไป",
          calories: "80-100 kcal/ผล"
        },
        {
          name: "ส้ม",
          image: "🍊",
          portion: "1-2 ผล/วัน",
          detail: "อุดมวิตามินซี",
          calories: "60-80 kcal/ผล"
        },
        {
          name: "ฝรั่ง",
          image: "🍐",
          portion: "1-2 ผล/วัน",
          detail: "ใยอาหารสูง",
          calories: "50-70 kcal/ผล"
        },
        {
          name: "มะเขือเทศ",
          image: "🍅",
          portion: "2-3 ผล/วัน",
          detail: "ทานสดหรือปรุงสุก",
          calories: "20-30 kcal/ผล"
        }
      ]
    },
    dairy: {
      title: "กลุ่มนมหรือนมเนย",
      icon: "🥛",
      color: "#93C5FD",
      foods: [
        {
          name: "นมสดจืด",
          image: "🥛",
          portion: "1-2 แก้ว/วัน",
          detail: "เลือกแบบไขมันต่ำ",
          calories: "100-150 kcal/แก้ว"
        },
        {
          name: "โยเกิร์ตไม่หวาน",
          image: "🥛",
          portion: "1 ถ้วย/วัน",
          detail: "อุดมด้วยโปรไบโอติก",
          calories: "100-120 kcal/ถ้วย"
        },
        {
          name: "นมถั่วเหลือง",
          image: "🥤",
          portion: "1-2 แก้ว/วัน",
          detail: "ทางเลือกสำหรับคนแพ้นม",
          calories: "80-100 kcal/แก้ว"
        },
        {
          name: "เนยแข็งไขมันต่ำ",
          image: "🧀",
          portion: "1-2 แผ่น/วัน",
          detail: "อุดมแคลเซียม",
          calories: "70-90 kcal/แผ่น"
        }
      ]
    },
    protein: {
      title: "กลุ่มเนื้อสัตว์ไม่มีมัน",
      icon: "🥩",
      color: "#EF4444",
      foods: [
        {
          name: "เนื้อไก่ไม่มีหนัง",
          image: "🍗",
          portion: weight < 60 ? "3-4 ช้อนโต๊ะ/มื้อ" : weight < 80 ? "4-5 ช้อนโต๊ะ/มื้อ" : "5-6 ช้อนโต๊ะ/มื้อ",
          detail: "เลือกส่วนอกไก่",
          calories: "165 kcal/100g"
        },
        {
          name: "ปลา",
          image: "🐟",
          portion: "4-6 ช้อนโต๊ะ/มื้อ",
          detail: "อุดมโอเมก้า 3",
          calories: "120-180 kcal/100g"
        },
        {
          name: "ไข่ไก่",
          image: "🥚",
          portion: "1-2 ฟอง/วัน",
          detail: "ต้ม หรือทอดน้อยน้ำมัน",
          calories: "70 kcal/ฟอง"
        },
        {
          name: "เต้าหู้",
          image: "🫘",
          portion: "2-3 ช้อนโต๊ะ/วัน",
          detail: "โปรตีนจากพืช",
          calories: "80 kcal/100g"
        }
      ]
    },
    fats: {
      title: "กลุ่มน้ำมัน น้ำตาล เกลือ",
      icon: "🫗",
      color: "#FCD34D",
      foods: [
        {
          name: "น้ำมันพืช",
          image: "🫗",
          portion: weight < 70 ? "2-3 ช้อนชา/วัน" : "3-4 ช้อนชา/วัน",
          detail: "น้ำมันมะกอก คาโนลา",
          calories: "40 kcal/ช้อนชา"
        },
        {
          name: "น้ำตาล",
          image: "🍯",
          portion: "ไม่เกิน 6 ช้อนชา/วัน",
          detail: "รวมน้ำตาลในอาหารทุกประเภท",
          calories: "16 kcal/ช้อนชา"
        },
        {
          name: "เกลือ",
          image: "🧂",
          portion: "ไม่เกิน 1 ช้อนชา/วัน",
          detail: "ประมาณ 2,000 mg โซเดียม",
          calories: "0 kcal"
        },
        {
          name: "อโวคาโด",
          image: "🥑",
          portion: "¼-½ ผล/วัน",
          detail: "ไขมันดีจากธรรมชาติ",
          calories: "80 kcal/¼ผล"
        }
      ]
    }
  };
  
  return recommendations[category] || null;
};

function NutritionSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [selectedFoods, setSelectedFoods] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!state || !state.weight || !state.activityLevel) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state || !state.weight || !state.activityLevel) {
    return null;
  }

  const nutritionData = calculateNutrition({
    weight: state.weight,
    height: state.height,
    age: state.age,
    gender: state.gender,
    activityLevel: parseFloat(state.activityLevel),
    hasDiabetes: state.hasDiabetes || false,
    hasHypertension: state.hasHypertension || false,
  });

  const handlePyramidClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const currentRecommendation = selectedCategory 
    ? getFoodRecommendations(state.weight, nutritionData.calories, selectedCategory)
    : null;

  const handleFoodQuantityChange = (foodId, change) => {
    setSelectedFoods((prev) => {
      const current = prev[foodId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [foodId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [foodId]: newQuantity };
    });
  };

  const handleSave = () => {
    const selectedFoodData = Object.entries(selectedFoods).map(
      ([id, quantity]) => {
        const food = FOODS.find((f) => f.id === parseInt(id));
        return { ...food, quantity };
      }
    );

    const totalNutrition = selectedFoodData.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories * food.quantity,
        protein: acc.protein + food.protein * food.quantity,
        fat: acc.fat + food.fat * food.quantity,
        carbs: acc.carbs + food.carbs * food.quantity,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    navigate("/summary-data", {
      state: {
        ...state,
        ...nutritionData,
        selectedFoods: selectedFoodData,
        totalNutrition,
      },
    });
  };

  return (
    <div className="nutrition-main-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <button className="back-button" onClick={() => navigate("/")}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>ย้อนกลับ</span>
            </button>

            <div className="title-section">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <h2>คำแนะนำสารอาหารต่อวัน</h2>
              </div>
              <p>สำหรับน้ำหนัก {state.weight} กิโลกรัม</p>
              <p className="small text-muted">
                BMI: {nutritionData.bmi} ({nutritionData.bmiCategory})
              </p>
            </div>

            <div className="card p-4 mb-4 pyramid-card">
              <h3 className="pyramid-title">ธงโภชนาการ</h3>
              <p className="pyramid-subtitle">คลิกที่แต่ละชั้นเพื่อดูคำแนะนำอาหาร</p>
              
              <div className="pyramid-container">
                <svg 
                  viewBox="0 0 400 500" 
                  style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* ชั้นที่ 4 - ข้าว แป้ง (ล่างสุด - กว้างสุด) */}
                  <g 
                    onClick={() => handlePyramidClick('grains')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 20 350 L 380 350 L 350 500 L 50 500 Z"
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="200" y="410" textAnchor="middle" fill="white" fontSize="40">🍚</text>
                    <text x="200" y="445" textAnchor="middle" fill="white" fontSize="18" fontWeight="600">ข้าว และ แป้ง</text>
                    <text x="200" y="470" textAnchor="middle" fill="white" fontSize="14" opacity="0.9">วันละ: 7-9 ทัพพี</text>
                  </g>

                  {/* ชั้นที่ 3 - ผัก และ ผลไม้ (แบ่ง 2 ฝั่ง) */}
                  <g 
                    onClick={() => handlePyramidClick('vegetables')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 50 230 L 200 230 L 220 350 L 20 350 Z"
                      fill="#10B981"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="120" y="275" textAnchor="middle" fill="white" fontSize="38">🥬</text>
                    <text x="120" y="308" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">ผัก</text>
                    <text x="120" y="328" textAnchor="middle" fill="white" fontSize="13" opacity="0.9">วันละ: 4 ทัพพี</text>
                  </g>

                  <g 
                    onClick={() => handlePyramidClick('fruits')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 200 230 L 350 230 L 380 350 L 220 350 Z"
                      fill="#F59E0B"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="280" y="275" textAnchor="middle" fill="white" fontSize="38">🍎</text>
                    <text x="280" y="308" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">ผลไม้ (ไม่หวาน)</text>
                    <text x="280" y="328" textAnchor="middle" fill="white" fontSize="13" opacity="0.9">วันละ: 1-3 ส่วน</text>
                  </g>

                  {/* ชั้นที่ 2 - นมเนย และ เนื้อสัตว์ (แบ่ง 2 ฝั่ง) */}
                  <g 
                    onClick={() => handlePyramidClick('dairy')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 90 120 L 200 120 L 200 230 L 50 230 Z"
                      fill="#93C5FD"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="145" y="160" textAnchor="middle" fill="white" fontSize="35">🥛</text>
                    <text x="145" y="190" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">นมหรือนมเนย</text>
                    <text x="145" y="210" textAnchor="middle" fill="white" fontSize="12" opacity="0.9">วันละ: 1-2 แก้ว</text>
                  </g>

                  <g 
                    onClick={() => handlePyramidClick('protein')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 200 120 L 310 120 L 350 230 L 200 230 Z"
                      fill="#EF4444"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="255" y="160" textAnchor="middle" fill="white" fontSize="35">🥩</text>
                    <text x="255" y="190" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">เนื้อสัตว์ ไม่มีมัน</text>
                    <text x="255" y="210" textAnchor="middle" fill="white" fontSize="12" opacity="0.9">วันละ: 6-8 ช้อนโต๊ะ</text>
                  </g>

                  {/* ชั้นที่ 1 - น้ำมัน น้ำตาล เกลือ (บนสุด - แคบสุด) */}
                  <g 
                    onClick={() => handlePyramidClick('fats')}
                    style={{ cursor: 'pointer' }}
                    className="pyramid-svg-level"
                  >
                    <path
                      d="M 140 20 L 260 20 L 280 120 L 120 120 Z"
                      fill="#FCD34D"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                    <text x="200" y="55" textAnchor="middle" fill="white" fontSize="32">🫗</text>
                    <text x="200" y="82" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">น้ำมัน น้ำตาล เกลือ</text>
                    <text x="200" y="100" textAnchor="middle" fill="white" fontSize="12" opacity="0.9">วันละ: น้อยสุด</text>
                  </g>
                </svg>
              </div>
              
              <div className="pyramid-footer">
                <p className="pyramid-note">
                  💡 แตะที่แต่ละชั้นเพื่อดูคำแนะนำอาหารที่เหมาะสมกับคุณ
                </p>
              </div>
            </div>

            {(state.hasDiabetes || state.hasHypertension) && (
              <div className="card p-3 mb-4 bg-warning bg-opacity-10">
                <p className="mb-0 text-center">
                  <strong>หมายเหตุ:</strong>{" "}
                  ค่าพลังงานและสัดส่วนสารอาหารถูกปรับตามโรคประจำตัวของคุณ
                  {state.hasDiabetes && " (เบาหวาน)"}
                  {state.hasDiabetes && state.hasHypertension && " และ"}
                  {state.hasHypertension && " (ความดันโลหิตสูง)"}
                </p>
              </div>
            )}

            <div className="text-center mb-4">
              <button className="btn-lg save-btn" onClick={handleSave}>
                บันทึกและดำเนินการต่อ
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && currentRecommendation && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-header">
              <span className="modal-icon">{currentRecommendation.icon}</span>
              <h3 className="modal-title">{currentRecommendation.title}</h3>
            </div>

            <div className="modal-body">
              <div className="food-grid">
                {currentRecommendation.foods.map((food, index) => (
                  <div key={index} className="food-recommendation-card">
                    <div className="food-image">{food.image}</div>
                    <h4 className="food-name-modal">{food.name}</h4>
                    <div className="food-portion-box">
                      <strong>ปริมาณแนะนำ:</strong>
                      <p className="food-portion-text">{food.portion}</p>
                    </div>
                    <p className="food-detail">{food.detail}</p>
                    <div className="food-calories-badge">{food.calories}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <p className="modal-footer-text">
                💡 ปริมาณที่แนะนำคำนวณจากน้ำหนัก {state.weight} กก. และพลังงานที่ต้องการ {nutritionData.calories} แคลอรี่/วัน
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutritionSummaryPage;