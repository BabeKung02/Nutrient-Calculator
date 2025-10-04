import React, { useState } from "react";
import "../styles/SummaryData.css";

const recommended = { fat: 64, protein: 128, carbs: 224, calories: 2000 };

const generateWeekData = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }).map((_, i) => {
    const date = new Date(year, month, i + 1);
    const actual = {
      fat: Math.round(recommended.fat * (0.7 + Math.random() * 0.7)),
      protein: Math.round(recommended.protein * (0.7 + Math.random() * 0.7)),
      carbs: Math.round(recommended.carbs * (0.7 + Math.random() * 0.7)),
      calories: Math.round(recommended.calories * (0.7 + Math.random() * 0.7)),
    };
    return { date, actual, recommended };
  });
};

const monthNames = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
];

const nutritionIcons = {
  fat: "🥑",
  protein: "🍗", 
  carbs: "🍞",
  calories: "⚡"
};

const nutritionLabels = {
  fat: "ไขมัน (f)",
  protein: "โปรตีน (p)",
  carbs: "คาร์โบไฮเดรต (c)", 
  calories: "แคลอรี่ (kcal)"
};

export default function SummaryDataPage() {
  const [openYear, setOpenYear] = useState(false);
  const [openMonth, setOpenMonth] = useState({});

  const year = 2568;
  const baseYear = year - 543;
  const months = [8, 9, 10, 11]; // กันยายน - ธันวาคม
  
  const monthData = {};
  months.forEach((m) => {
    monthData[m] = generateWeekData(baseYear, m);
  });

  const formatDateTH = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const yearBE = date.getFullYear() + 543;
    return `${day}/${month}/${yearBE}`;
  };

  const getProgressPercentage = (actual, recommended) => 
    Math.min((actual / recommended) * 100, 100);

  const isGoodNutrition = (actual, recommended) => actual >= recommended;

  return (
    <div className="summary-container">
      <div className="header">
        <h1 className="header-title">
          📊 สรุปผลการรับประทานอาหาร
        </h1>
      </div>

      <div className="accordion" style={{marginTop:"-18px"}}>
        <button 
          className={`accordion-btn year-btn ${openYear ? 'active' : ''}`}
          onClick={() => setOpenYear(!openYear)}
        >
          <div className="btn-content">
            <span className="btn-icon">🗓️</span>
            <span className="btn-text">ปี {year}</span>
          </div>
          <span className={`arrow ${openYear ? 'rotate' : ''}`}>▶</span>
        </button>

        <div className={`accordion-content ${openYear ? 'open' : ''}`}>
          {months.map((m) => (
            <div key={m} className="month-section">
              <button
                className={`accordion-btn month-btn ${openMonth[m] ? 'active' : ''}`}
                onClick={() =>
                  setOpenMonth((prev) => ({ ...prev, [m]: !prev[m] }))
                }
              >
                <div className="btn-content">
                  <span className="btn-icon">📅</span>
                  <span className="btn-text">{monthNames[m]}</span>
                </div>
                <span className={`arrow ${openMonth[m] ? 'rotate' : ''}`}>▶</span>
              </button>

              <div className={`accordion-content ${openMonth[m] ? 'open' : ''}`}>
                <div className="days-grid">
                  {monthData[m].map(({ date, actual, recommended }, idx) => (
                    <div key={idx} className="nutrition-card">
                      <div className="card-header">
                        <span className="date-icon">📅</span>
                        <span className="date-text">{formatDateTH(date)}</span>
                      </div>

                      <div className="nutrition-list">
                        {Object.entries(actual).map(([key, value]) => (
                          <div key={key} className="nutrition-item">
                            <div className="nutrition-header">
                              <div className="nutrition-label">
                                <span className="nutrition-icon">{nutritionIcons[key]}</span>
                                <span className="nutrition-name">{nutritionLabels[key]}</span>
                              </div>
                              <div className={`nutrition-value ${isGoodNutrition(value, recommended[key]) ? 'good' : 'bad'}`}>
                                {value} / {recommended[key]}
                              </div>
                            </div>
                            <div className="progress-container">
                              <div className="progress-bar">
                                <div 
                                  className={`progress-fill ${isGoodNutrition(value, recommended[key]) ? 'good' : 'bad'}`}
                                  style={{width: `${getProgressPercentage(value, recommended[key])}%`}}
                                ></div>
                              </div>
                              <div className="progress-percentage">
                                {Math.round(getProgressPercentage(value, recommended[key]))}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}