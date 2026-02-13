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
// คำนวณพลังงานที่ต้องการ
// ============================================
export function calculateCaloriesRequirement({ tdee, bmi }) {
  const b = parseFloat(bmi);
  const t = parseFloat(tdee);

  if (isNaN(b) || isNaN(t)) {
    return 0;
  }

  // 1. กรณี BMI < 18.5 (ผอม) -> เพิ่ม 500 kcal
  if (b < 18.5) {
    return Math.round(t + 500);
  }

  // 2. กรณี BMI 18.5 - 22.9 (สมส่วน) -> ใช้ TDEE ตามปกติ
  if (b >= 18.5 && b < 23) {
    return Math.round(t);
  }

  // 3. กรณี BMI >= 23 (น้ำหนักเกิน/อ้วน) -> ลด 500 kcal
  if (b >= 23) {
    return Math.round(t - 500);
  }

  return Math.round(t);
}

// ============================================
// คำนวณสัดส่วนสารอาหาร (Macros)
// ============================================
export function calculateMacros({ calories, tdee, weight, bmi }) {
  const cal = parseFloat(calories);
  const t = parseFloat(tdee);
  const w = parseFloat(weight);
  const b = parseFloat(bmi);

  if (isNaN(cal) || isNaN(t) || isNaN(w) || isNaN(b)) {
    return {
      carbs: 0,
      carb: 0,
      protein: 0,
      fat: 0,
      sodium: 2000,
    };
  }

  let carbPercent, proteinPercent, fatPercent;
  let carbsGrams, proteinGrams, fatGrams;

  if (b >= 23.0) {
    // กรณีน้ำหนักเกิน (BMI ≥ 23.0)
    // พลังงาน = TDEE - 500
    // คำนวณทุกอย่างจาก calories (TDEE - 500)
    carbPercent = 0.50;
    proteinPercent = 0.20;
    fatPercent = 0.30;

    carbsGrams = Math.round((cal * carbPercent) / 4); // 50% ของ TDEE-500
    proteinGrams = Math.round((cal * proteinPercent) / 4); // 20% ของ TDEE-500
    fatGrams = Math.round((cal * fatPercent) / 9); // 30% ของ TDEE-500
  } else if (b >= 18.5 && b < 23) {
    // กรณีสมส่วน (BMI 18.5-22.9)
    // พลังงาน = TDEE
    // คำนวณทุกอย่างจาก calories (TDEE)
    carbPercent = 0.50;
    proteinPercent = 0.15;
    fatPercent = 0.35;

    carbsGrams = Math.round((cal * carbPercent) / 4); // 50% ของ TDEE
    proteinGrams = Math.round((cal * proteinPercent) / 4); // 15% ของ TDEE
    fatGrams = Math.round((cal * fatPercent) / 9); // 35% ของ TDEE
  } else {
    // กรณีผอม (BMI < 18.5)
    // พลังงาน = TDEE + 500
    // คำนวณทุกอย่างจาก calories (TDEE + 500)
    carbPercent = 0.50;
    proteinPercent = 0.15;
    fatPercent = 0.35;

    carbsGrams = Math.round((cal * carbPercent) / 4); // 50% ของ TDEE+500
    proteinGrams = Math.round((cal * proteinPercent) / 4); // 15% ของ TDEE+500
    fatGrams = Math.round((cal * fatPercent) / 9); // 35% ของ TDEE+500
  }

  // คำนวณหน่วยแลกเปลี่ยนคาร์โบไฮเดรต (1 หน่วย = 15 กรัม)
  const carb = Math.round((carbsGrams / 15) * 100) / 100;

  return {
    carbs: carbsGrams,
    carb: carb,
    protein: proteinGrams,
    fat: fatGrams,
    sodium: 2000, // โซเดียมไม่เกิน 2000 มิลลิกรัม/วัน
  };
}

// ============================================
// ฟังก์ชันหลักที่รวมการคำนวณทั้งหมด
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

  // 4. คำนวณพลังงานที่ต้องการ
  const calories = calculateCaloriesRequirement({ tdee, bmi });

  // 5. คำนวณสารอาหาร
  const macros = calculateMacros({
    calories,
    tdee,
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

ผลลัพธ์ตัวอย่าง (BMI 24.2 - น้ำหนักเกิน):
{
  bmi: 24.2,
  bmiCategory: "น้ำหนักเกิน",
  bmr: 1679,
  tdee: 2602,
  calories: 2102,  // TDEE - 500 (เพราะ BMI >= 23)
  carbs: 263,      // 50% ของ TDEE-500 (2102 * 0.5 / 4)
  carb: 17.53,     // หน่วยแลกเปลี่ยน (263 / 15)
  protein: 105,    // 20% ของ TDEE-500 (2102 * 0.2 / 4)
  fat: 70,         // 30% ของ TDEE-500 (2102 * 0.3 / 9)
  sodium: 2000
}

หมายเหตุ:
เงื่อนไขการคำนวณ:

1. BMI < 18.5 (ผอม):
   - พลังงาน: TDEE + 500 kcal
   - คาร์โบไฮเดรต: 50% ของ TDEE+500
   - โปรตีน: 15% ของ TDEE+500
   - ไขมัน: 35% ของ TDEE+500

2. BMI 18.5 - 22.9 (สมส่วน):
   - พลังงาน: TDEE
   - คาร์โบไฮเดรต: 50% ของ TDEE
   - โปรตีน: 15% ของ TDEE
   - ไขมัน: 35% ของ TDEE

3. BMI ≥ 23.0 (น้ำหนักเกิน/อ้วน):
   - พลังงาน: TDEE - 500 kcal
   - คาร์โบไฮเดรต: 50% ของ TDEE-500
   - โปรตีน: 20% ของ TDEE-500
   - ไขมัน: 30% ของ TDEE-500

4. โซเดียม: ไม่เกิน 2000 มิลลิกรัม/วัน
   (เทียบเท่าเกลือแกงหรือเกลือโซเดียมคลอร์ไรด์ 1 ช้อนชา หรือ 5 กรัม)
*/