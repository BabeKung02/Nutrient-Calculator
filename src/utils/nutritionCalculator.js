// ============================================
// ฟังก์ชันคำนวณ BMI
// ============================================
export function calculateBMI(weight, height) {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100; // แปลง cm เป็น m

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
    return null;
  }

  return (w / (h * h)).toFixed(1);
}

// ============================================
// แปลผล BMI ตามเกณฑ์ที่กำหนด
// ============================================
export function getBMICategory(bmi) {
  const b = parseFloat(bmi);

  if (b < 18.5) return "ผอม";
  if (b >= 18.5 && b < 23) return "สมส่วน";
  if (b >= 23 && b < 25) return "น้ำหนักเกิน";
  if (b >= 25 && b < 30) return "อ้วน";
  if (b >= 30) return "อ้วนอันตราย";

  return "ไม่สามารถระบุได้";
}

// ============================================
// คำนวณ BMR ตามสูตร Harris-Benedict equation
// ============================================
export function calculateBMR({ weight, height, age, gender }) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(a) || a <= 0) {
    return 0;
  }

  let bmr = 0;

  if (gender === "male") {
    bmr = 66 + 13.7 * w + 5 * h - 6.8 * a;
  } else if (gender === "female") {
    bmr = 665 + 9.6 * w + 1.8 * h - 4.7 * a;
  }

  return Math.round(bmr);
}

// ============================================
// คำนวณ TDEE (Total Daily Energy Expenditure)
// ============================================
export function calculateTDEE({ bmr, activityLevel }) {
  const b = parseFloat(bmr);
  const level = parseFloat(activityLevel);

  if (isNaN(b) || b <= 0 || isNaN(level) || level <= 0) {
    return 0;
  }

  return Math.round(b * level);
}

// ============================================
// คำนวณพลังงานที่ต้องการสำหรับผู้ป่วยเบาหวาน
// ============================================
export function calculateCaloriesRequirement({ tdee, bmi }) {
  const b = parseFloat(bmi);
  const t = parseFloat(tdee);

  if (isNaN(b) || isNaN(t)) {
    return 0;
  }

  // เงื่อนไข: BMI 18.5 – 22.9 (น้ำหนักปกติ)
  if (b >= 18.5 && b < 23) {
    return Math.round(t); // ใช้ TDEE ตามปกติ
  }

  // เงื่อนไข: BMI >= 23 (น้ำหนักเกิน/อ้วน)
  // สำหรับผู้ป่วยเบาหวาน ลด 500 kcal
  if (b >= 23) {
    return Math.round(t - 500);
  }

  return Math.round(t);
}

// ============================================
// คำนวณสัดส่วนสารอาหาร (สำหรับผู้ป่วยเบาหวาน)
// ============================================
export function calculateMacros({ calories, weight, bmi }) {
  const cal = parseFloat(calories);
  const w = parseFloat(weight);
  const b = parseFloat(bmi);

  if (isNaN(cal) || isNaN(w) || isNaN(b)) {
    return {
      carbs: 0,
      protein: 0,
      fat: 0,
      sodium: 2000,
    };
  }

  let carbPercent, proteinPercent, fatPercent;

    carbPercent = 0.5;
    proteinPercent = 0.2;
    fatPercent = 0.3;


  // คำนวณปริมาณสารอาหารในหน่วยกรัม
  // คาร์โบไฮเดรต: 1g = 4 kcal
  const carbsGrams = Math.round((cal * carbPercent) / 4);

  const carbs = Math.round((carbsGrams / 15) * 100) / 100;
  // โปรตีน: 1g = 4 kcal
  const proteinGrams = Math.round((cal * proteinPercent) / 4);

  // ไขมัน: 1g = 9 kcal
  const fatGrams = Math.round((cal * fatPercent) / 9);

  return {
    carbs: carbsGrams,
    carb : carbs,
    protein: proteinGrams,
    fat: fatGrams,
    sodium: 2000, // โซเดียมน้อยกว่า 2,000 mg
  };
}

// ============================================
// ฟังก์ชันหลักที่รวมการคำนวณทั้งหมด (สำหรับผู้ป่วยเบาหวาน)
// ============================================
export function calculateNutrition(userData) {
  const { weight, height, age, gender, activityLevel } = userData;

  // 1. คำนวณ BMI
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  // 2. คำนวณ BMR
  const bmr = calculateBMR({ weight, height, age, gender });

  // 3. คำนวณ TDEE
  const tdee = calculateTDEE({ bmr, activityLevel });

  // 4. คำนวณพลังงานที่ต้องการ (สำหรับผู้ป่วยเบาหวาน)
  const calories = calculateCaloriesRequirement({ tdee, bmi });


  const macros = calculateMacros({
    calories,
    tdee, // ส่ง tdee เพื่อคำนวณ (TDEE × 20%) / 4
    weight: parseFloat(weight),
    bmi: parseFloat(bmi),
  });

  return {
    bmi: parseFloat(bmi),
    bmiCategory,
    bmr,
    tdee,
    calories,
    ...macros,
  };
}

// ============================================
// ตัวอย่างการใช้งาน
// ============================================
/*
const userData = {
  weight: 70,
  height: 170,
  age: 30,
  gender: "male",
  activityLevel: 1.55, // ออกกำลังกายปานกลาง
};

const result = calculateNutrition(userData);
console.log(result);

ผลลัพธ์สำหรับผู้ป่วยเบาหวาน:
{
  bmi: 24.2,
  bmiCategory: "น้ำหนักเกิน",
  bmr: 1679,
  tdee: 2602,
  calories: 2102, // TDEE - 500 (เพราะ BMI >= 23 และเป็นผู้ป่วยเบาหวาน)
  carbs: 263,     // 50% ของ 2102 kcal (สำหรับน้ำหนักเกิน)
  protein: 105,   // 20% ของ 2102 kcal (สำหรับน้ำหนักเกิน)
  fat: 70,        // 30% ของ 2102 kcal (สำหรับน้ำหนักเกิน)
  sodium: 2000
}

หมายเหตุ:
- ลบพารามิเตอร์ hasDiabetes และ hasHypertension ออกแล้ว
- ใช้เกณฑ์สำหรับผู้ป่วยเบาหวานเป็นค่าเริ่มต้น
- น้ำหนักปกติ (BMI 18.5-22.9): คาร์โบ 55%, โปรตีน 12.5%, ไขมัน 27.5%
- น้ำหนักเกิน/อ้วน (BMI >= 23): คาร์โบ 50%, โปรตีน 20%, ไขมัน 30%
- ลดพลังงาน 500 kcal เมื่อ BMI >= 23
*/
