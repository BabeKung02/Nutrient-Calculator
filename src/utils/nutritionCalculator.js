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

  if (b < 18.5) return "น้ำหนักน้อย";
  if (b >= 18.5 && b < 23) return "ปกติ";
  if (b >= 23 && b < 25) return "น้ำหนักเกิน";
  if (b >= 25 && b < 30) return "โรคอ้วน ระดับ 1";
  if (b >= 30) return "โรคอ้วน ระดับ 2";

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
// คำนวณพลังงานที่ต้องการตามเงื่อนไขและโรคประจำตัว
// ============================================
export function calculateCaloriesRequirement({
  tdee,
  bmi,
  hasDiabetes,
  hasHypertension,
}) {
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
  if (b >= 23) {
    // ถ้ามีโรคเบาหวานหรือความดันโลหิตสูง ลด 500-1000
    if (hasDiabetes || hasHypertension) {
      return Math.round(t - 750); // ใช้ค่ากลางระหว่าง 500-1000
    }
    // ถ้าไม่มีโรคประจำตัว ลด 500
    return Math.round(t - 500);
  }

  return Math.round(t);
}

// ============================================
// คำนวณสัดส่วนสารอาหาร (มาโครนิวเทรียนต์)
// ============================================
export function calculateMacros({
  calories,
  weight,
  bmi,
  hasDiabetes,
  hasHypertension,
}) {
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

  // ===== กรณีป่วยทั่วไป ไม่มีโรคประจำตัว =====
  if (!hasDiabetes && !hasHypertension) {
    if (b >= 18.5 && b < 23) {
      // น้ำหนักปกติ
      carbPercent = 0.55; // ใช้ค่ากลาง 55% (45-65%)
      proteinPercent = 0.125; // ใช้ค่ากลาง 12.5% (10-15%)
      fatPercent = 0.275; // ใช้ค่ากลาง 27.5% (20-35%)
    } else {
      // น้ำหนักเกิน/อ้วน
      carbPercent = 0.55;
      proteinPercent = 0.125;
      fatPercent = 0.275;
    }
  }

  // ===== กรณีมีโรคเบาหวาน =====
  else if (hasDiabetes) {
    if (b >= 18.5 && b < 23) {
      // น้ำหนักปกติ
      carbPercent = 0.55;
      proteinPercent = 0.125;
      fatPercent = 0.275;
    } else {
      // น้ำหนักเกิน/อ้วน
      carbPercent = 0.5;
      proteinPercent = 0.2;
      fatPercent = 0.3;
    }
  }

  // ===== กรณีมีโรคความดันโลหิตสูง =====
  else if (hasHypertension) {
    if (b >= 18.5 && b < 23) {
      // น้ำหนักปกติ
      carbPercent = 0.55;
      proteinPercent = 0.125;
      fatPercent = 0.275;
    } else {
      // น้ำหนักเกิน/อ้วน
      carbPercent = 0.5;
      proteinPercent = 0.2;
      fatPercent = 0.3;
    }
  }

  // คำนวณปริมาณสารอาหารในหน่วยกรัม
  // คาร์โบไฮเดรต: 1g = 4 kcal
  const carbsGrams = Math.round((cal * carbPercent) / 4);

  // โปรตีน: 1g = 4 kcal
  const proteinGrams = Math.round((cal * proteinPercent) / 4);

  // ไขมัน: 1g = 9 kcal (ไม่ใช่ 7 ตามที่เขียนไว้)
  const fatGrams = Math.round((cal * fatPercent) / 9);

  return {
    carbs: carbsGrams,
    protein: proteinGrams,
    fat: fatGrams,
    sodium: 2000, // โซเดียมน้อยกว่า 2,000 mg สำหรับทุกกรณี
  };
}

// ============================================
// ฟังก์ชันหลักที่รวมการคำนวณทั้งหมด
// ============================================
export function calculateNutrition(userData) {
  const {
    weight,
    height,
    age,
    gender,
    activityLevel,
    hasDiabetes = false,
    hasHypertension = false,
  } = userData;

  // 1. คำนวณ BMI
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);

  // 2. คำนวณ BMR
  const bmr = calculateBMR({ weight, height, age, gender });

  // 3. คำนวณ TDEE
  const tdee = calculateTDEE({ bmr, activityLevel });

  // 4. คำนวณพลังงานที่ต้องการ
  const calories = calculateCaloriesRequirement({
    tdee,
    bmi,
    hasDiabetes,
    hasHypertension,
  });

  // 5. คำนวณสัดส่วนสารอาหาร
  const macros = calculateMacros({
    calories,
    weight,
    bmi,
    hasDiabetes,
    hasHypertension,
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
  hasDiabetes: false,
  hasHypertension: false
};

const result = calculateNutrition(userData);
console.log(result);

ผลลัพธ์:
{
  bmi: 24.2,
  bmiCategory: "น้ำหนักเกิน",
  bmr: 1679,
  tdee: 2602,
  calories: 2102, // TDEE - 500 (เพราะ BMI >= 23)
  carbs: 289,     // 55% ของ 2102 kcal
  protein: 66,    // 12.5% ของ 2102 kcal
  fat: 64,        // 27.5% ของ 2102 kcal
  sodium: 2000
}
*/
