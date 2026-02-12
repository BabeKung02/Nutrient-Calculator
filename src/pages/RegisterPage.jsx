import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  calculateBMR,
  calculateTDEE,
  calculateCaloriesRequirement,
  calculateMacros,
} from "../utils/nutritionCalculator";
import "../styles/Register.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [weightDate, setWeightDate] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setWeightDate("");
    setActivityLevel("");
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/");
      return;
    }

    setUsername(currentUser);
  }, [navigate]);

  useEffect(() => {
    if (!username) return;

    const savedData = localStorage.getItem(`userData_${username}`);
    if (savedData) {
      const userData = JSON.parse(savedData);

      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setAge(userData.age || "");
      setGender(userData.gender || "");
      setWeight(userData.weight || "");
      setHeight(userData.height || "");
      setWeightDate(formatDateToYYYYMMDD(userData.weightDate) || "");
      setActivityLevel(userData.activityLevel || "");
    } else {
      resetForm();
    }
  }, [username]);

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";

    const parts = dateString.split("-");
    if (parts.length !== 3) return "";

    const [year, month, day] = parts;

    if (!year || !month || !day) return "";

    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";

    const parts = dateString.split("/");
    if (parts.length !== 3) return "";

    const [day, month, year] = parts;

    if (!day || !month || !year) return "";

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;

    if (weightNum > 0 && heightNum > 0) {
      return (weightNum / (heightNum * heightNum)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "ผอม", color: "#3498db" };
    if (bmi < 23) return { text: "สมส่วน", color: "#27ae60" };
    if (bmi < 25) return { text: "น้ำหนักเกิน", color: "#f39c12" };
    if (bmi < 30) return { text: "อ้วน", color: "#e67e22" };
    return { text: "อ้วนอันตราย", color: "#e74c3c" };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const handleSubmit = () => {
    const emptyFields = [];

    if (!firstName.trim()) emptyFields.push("ชื่อ");
    if (!lastName.trim()) emptyFields.push("นามสกุล");
    if (!weight || weight === "") emptyFields.push("น้ำหนัก");
    if (!height || height === "") emptyFields.push("ส่วนสูง");
    if (!age || age === "") emptyFields.push("อายุ");
    if (!gender) emptyFields.push("เพศ");
    if (!activityLevel) emptyFields.push("กิจกรรมที่ทำเป็นประจำ");

    if (emptyFields.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: `ข้อมูลที่ยังไม่ได้กรอก: ${emptyFields.join(", ")}`,
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!firstName.trim()) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกชื่อ",
        text: "โปรดระบุชื่อของคุณ",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!lastName.trim()) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกนามสกุล",
        text: "โปรดระบุนามสกุลของคุณ",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (weight === null || weight === undefined || weight === "") {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกน้ำหนัก",
        text: "โปรดระบุน้ำหนักของคุณเพื่อคำนวณสารอาหารที่เหมาะสม",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (isNaN(weight) || parseFloat(weight) <= 0) {
      Swal.fire({
        icon: "error",
        title: "น้ำหนักไม่ถูกต้อง",
        text: "โปรดระบุน้ำหนักเป็นตัวเลขที่มีค่ามากกว่า 0",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (height === null || height === undefined || height === "") {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกส่วนสูง",
        text: "โปรดระบุส่วนสูงของคุณเพื่อคำนวณสารอาหารที่เหมาะสม",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (isNaN(height) || parseFloat(height) <= 0 || parseFloat(height) > 300) {
      Swal.fire({
        icon: "error",
        title: "ส่วนสูงไม่ถูกต้อง",
        text: "โปรดระบุส่วนสูงเป็นตัวเลขระหว่าง 1-300 เซนติเมตร",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (age === null || age === undefined || age === "") {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกอายุ",
        text: "โปรดระบุอายุของคุณเพื่อคำนวณสารอาหารที่เหมาะสม",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (isNaN(age) || parseFloat(age) <= 0 || parseFloat(age) > 120) {
      Swal.fire({
        icon: "error",
        title: "อายุไม่ถูกต้อง",
        text: "โปรดกรอกอายุเป็นตัวเลขที่อยู่ในช่วง 1-120 ปี",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!gender) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกเพศ",
        text: "โปรดเลือกเพศของคุณเพื่อดำเนินการต่อ",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!activityLevel) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกระดับกิจกรรม",
        text: "โปรดระบุกิจกรรมที่ทำเป็นประจำ",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    // คำนวณค่าต่างๆ ตามสูตรในภาพ
    const bmr = calculateBMR({
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseFloat(age),
      gender,
    });

    const tdee = calculateTDEE({
      bmr,
      activityLevel: parseFloat(activityLevel),
    });

    const calories = calculateCaloriesRequirement({
      tdee,
      bmi: parseFloat(bmi),
    });

    // คำนวณ carbs ตามสูตร: (TDEE × 20%) / 4
    const macros = calculateMacros({
      calories,
      tdee, // ต้องส่ง tdee เพื่อคำนวณ carbs
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
    });

    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูลเรียบร้อย!",
      html: `
        <div style="text-align: center; margin-top: 10px;">
          <p><strong>ชื่อ-นามสกุล:</strong> ${firstName} ${lastName}</p>
          <p><strong>อายุ:</strong> ${parseFloat(age)} ปี</p>
          <p><strong>เพศ:</strong> ${gender === "male" ? "ชาย" : "หญิง"}</p>
          <p><strong>น้ำหนัก:</strong> ${parseFloat(weight)} กิโลกรัม</p>
          <p><strong>ส่วนสูง:</strong> ${parseFloat(height)} เซนติเมตร</p>
          <p><strong>BMI:</strong> ${bmi} (${bmiCategory.text})</p>
        </div>
      `,
      confirmButtonText: "ตกลง",
      customClass: { title: "swal2-title-custom" },
    }).then(() => {
      const currentUser = localStorage.getItem("currentUser");
      const userData = {
        firstName,
        lastName,
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseFloat(age),
        gender,
        weightDate: formatDateToDDMMYYYY(weightDate),
        bmi: parseFloat(bmi),
        bmiCategory: bmiCategory.text,
        activityLevel,
        tdee,
        bmr,
        calories,
        carbs: macros.carbs, // เพิ่ม carbs
        carb : macros.carb,
        carbsPerMeal: macros.carbsPerMeal, // เพิ่ม carbsPerMeal
        carbChoices: macros.carbChoices, // เพิ่ม carbChoices
        protein: macros.protein, // เพิ่ม protein
        fat: macros.fat, // เพิ่ม fat
        sodium: macros.sodium, // เพิ่ม sodium
      };

      if (!currentUser) {
        Swal.fire({
          icon: "error",
          title: "ไม่พบผู้ใช้งาน",
          text: "กรุณาเข้าสู่ระบบใหม่",
        });
        navigate("/");
        return;
      }

      localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
      navigate("/menu", { state: userData });
    });
  };

  const EggIcon = () => <div className="egg-icon" />;
  const CarrotIcon = () => <div className="carrot-icon" />;

  return (
    <div className="main-container">
      <div
        className="container-fluid d-flex align-items-center justify-content-center min-vh-100 p-4"
        style={{
          background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <div className="w-100" style={{ maxWidth: "450px" }}>
          <div className="card p-4 content-card">
            <div className="text-center">
              <p className="description">กรอกข้อมูลส่วนตัว</p>
              <div className="healthy-food-section">
                <div className="food-item">
                  <EggIcon />
                </div>
                <div className="food-item">
                  <CarrotIcon />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="form-label text-center d-block fw-semibold"
              >
                ชื่อ <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control weight-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="กรอกชื่อของคุณ"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="form-label text-center d-block fw-semibold"
              >
                นามสกุล <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control weight-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="กรอกนามสกุลของคุณ"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="weight"
                className="form-label text-center d-block fw-semibold"
              >
                น้ำหนัก (กิโลกรัม) <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="weight"
                className="form-control weight-input"
                value={weight}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setWeight(value);
                  }
                }}
                placeholder="กรอกน้ำหนักของคุณ"
                inputMode="decimal"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="height"
                className="form-label text-center d-block fw-semibold"
              >
                ส่วนสูง (เซนติเมตร) <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="height"
                className="form-control weight-input"
                value={height}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setHeight(value);
                  }
                }}
                placeholder="กรอกส่วนสูงของคุณ"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="age"
                className="form-label text-center d-block fw-semibold"
              >
                อายุ (ปี) <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="age"
                className="form-control weight-input"
                value={age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setAge(value);
                  }
                }}
                placeholder="กรอกอายุของคุณ"
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                เพศ <span className="required-star">*</span>
              </label>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ gap: "80px", paddingRight: "20px" }}
              >
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="male">
                    ชาย
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="female">
                    หญิง
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                กิจกรรมที่ทำเป็นประจำ <span className="required-star">*</span>
              </label>
              <div className="activity-radio-list">
                <div className="form-check activity-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="activity-1"
                    name="activityLevel"
                    value="1.2"
                    checked={activityLevel === "1.2"}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="activity-1">
                    เคลื่อนไหวน้อยมาก นั่งเป็นส่วนใหญ่ ไม่ออกกำลังกายเลย
                  </label>
                </div>
                <div className="form-check activity-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="activity-2"
                    name="activityLevel"
                    value="1.375"
                    checked={activityLevel === "1.375"}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="activity-2">
                    ออกกำลังกาย 1-3 วัน/สัปดาห์
                  </label>
                </div>
                <div className="form-check activity-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="activity-3"
                    name="activityLevel"
                    value="1.55"
                    checked={activityLevel === "1.55"}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="activity-3">
                    ออกกำลังกาย 3-5 วัน/สัปดาห์
                  </label>
                </div>
                <div className="form-check activity-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="activity-4"
                    name="activityLevel"
                    value="1.725"
                    checked={activityLevel === "1.725"}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="activity-4">
                    ออกกำลังกาย 6-7 วัน/สัปดาห์
                  </label>
                </div>
                <div className="form-check activity-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="activity-5"
                    name="activityLevel"
                    value="1.9"
                    checked={activityLevel === "1.9"}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="activity-5">
                    ออกกำลังกายเช้า-เย็นทุกวัน
                  </label>
                </div>
              </div>
            </div>

            {bmi && (
              <div className="mb-4">
                <div className="bmi-display text-center">
                  <div
                    className="bmi-card p-3 rounded"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "2px solid #e9ecef",
                    }}
                  >
                    <h5 className="mb-2" style={{ color: "#495057" }}>
                      ดัชนีมวลกาย (BMI)
                    </h5>
                    <div className="bmi-value mb-2">
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: bmiCategory.color,
                        }}
                      >
                        {bmi}
                      </span>
                    </div>
                    <div className="bmi-category">
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: bmiCategory.color,
                          color: "white",
                          fontSize: "0.9rem",
                        }}
                      >
                        {bmiCategory.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-4">
              <button className="btn w-100 submit-btn" onClick={handleSubmit}>
                คลิกเพื่อเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;