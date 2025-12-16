import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  calculateBMR,
  calculateTDEE,
  calculateCaloriesRequirement,
} from "../utils/nutritionCalculator";
import "../styles/Register.css";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  // const [religion, setReligion] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [weightDate, setWeightDate] = useState("");
  const [hasDiseaseOption, setHasDiseaseOption] = useState(false);

  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [hasKidneyDisease, setHasKidneyDisease] = useState(false);
  const [kidneyStage, setKidneyStage] = useState("");
  const [smoking, setSmoking] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    if (savedData) {
      const userData = JSON.parse(savedData);

      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setAge(userData.age || "");
      setGender(userData.gender || "");
      setWeight(userData.weight || "");
      setHeight(userData.height || "");
      setWeightDate(formatDateToYYYYMMDD(userData.weightDate) || "");
      setHasDiseaseOption(
        userData.hasDiabetes ||
          userData.hasHypertension ||
          userData.hasKidneyDisease ||
          false
      );

      setHasDiabetes(userData.hasDiabetes || false);
      setHasHypertension(userData.hasHypertension || false);
      setHasKidneyDisease(userData.hasKidneyDisease || false);
      setKidneyStage(userData.kidneyStage || "");
      setSmoking(userData.smoking || "");
      setAlcohol(userData.alcohol || "");
      setActivityLevel(userData.activityLevel || "");
    }
  }, []);

  const navigate = useNavigate();

  // ฟังก์ชันแปลงวันที่จาก yyyy-mm-dd เป็น dd/mm/yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    // ตรวจสอบค่าว่างหรือไม่ใช่สตริง
    if (!dateString || typeof dateString !== "string") return "";

    // แยกส่วนปี เดือน วัน
    const parts = dateString.split("-");
    if (parts.length !== 3) return "";

    const [year, month, day] = parts;

    // ตรวจสอบว่ามีค่า year, month, day ทุกตัว
    if (!year || !month || !day) return "";

    // คืนค่าในรูปแบบ DD/MM/YYYY
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  };

  // ฟังก์ชันแปลงวันที่จาก dd/mm/yyyy เป็น yyyy-mm-dd
  const formatDateToYYYYMMDD = (dateString) => {
    // ตรวจสอบค่าว่างหรือไม่ใช่สตริง
    if (!dateString || typeof dateString !== "string") return "";

    // แยกส่วนวัน เดือน ปี
    const parts = dateString.split("/");
    if (parts.length !== 3) return "";

    const [day, month, year] = parts;

    // ตรวจสอบว่ามีค่า day, month, year ทุกตัว
    if (!day || !month || !year) return "";

    // คืนค่าในรูปแบบ YYYY-MM-DD
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // คำนวณ BMI
  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100;

    if (weightNum > 0 && heightNum > 0) {
      return (weightNum / (heightNum * heightNum)).toFixed(1);
    }
    return null;
  };

  // แปลผล BMI
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: "น้ำหนักน้อย", color: "#3498db" };
    if (bmi < 23) return { text: "ปกติ", color: "#27ae60" };
    if (bmi < 25) return { text: "น้ำหนักเกิน", color: "#f39c12" };
    if (bmi < 30) return { text: "โรคอ้วน ระดับ 1", color: "#e67e22" };
    return { text: "โรคอ้วน ระดับ 2", color: "#e74c3c" };
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
    // if (!religion) emptyFields.push("ศาสนา");
    if (!weightDate) emptyFields.push("วันที่ชั่งน้ำหนักล่าสุด");
    if (!smoking) emptyFields.push("สูบบุหรี่");
    if (!alcohol) emptyFields.push("ดื่มแอลกอฮอล์");
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

    // if (!religion) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "กรุณาเลือกศาสนา",
    //     text: "โปรดเลือกศาสนาของคุณเพื่อดำเนินการต่อ",
    //     customClass: { title: "swal2-title-custom" },
    //   });
    //   return;
    // }

    if (!weightDate) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกวันที่ชั่งน้ำหนัก",
        text: "โปรดระบุวันที่ชั่งน้ำหนักล่าสุด",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!smoking) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกสถานะการสูบบุหรี่",
        text: "โปรดระบุว่าคุณสูบบุหรี่หรือไม่",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    if (!alcohol) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกสถานะการดื่มแอลกอฮอล์",
        text: "โปรดระบุว่าคุณดื่มแอลกอฮอล์หรือไม่",
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

    if (hasKidneyDisease && !kidneyStage) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุระดับโรคไต",
        text: "โปรดเลือกระดับโรคไตเรื้อรัง (1-4)",
        customClass: { title: "swal2-title-custom" },
      });
      return;
    }

    const diseases = [];
    if (hasDiabetes) diseases.push("เบาหวาน");
    if (hasHypertension) diseases.push("ความดันโลหิตสูง");
    if (hasKidneyDisease) diseases.push(`โรคไตเรื้อรัง ระดับ ${kidneyStage}`);

    // const getReligionText = (r) => {
    //   const religionMap = {
    //     buddhism: "พุทธ",
    //     islam: "อิสลาม",
    //     christianity: "คริสต์",
    //     other: "อื่นๆ",
    //   };
    //   return religionMap[r] || r;
    // };
    // คำนวณแคลอรี่โดยใช้ฟังก์ชันจาก nutritionCalculator
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
      hasDiabetes,
      hasHypertension,
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
 <p><strong>พลังงานที่ควรได้รับต่อวัน:</strong> ${calories.toLocaleString()} kcal</p>
 ${
   diseases.length > 0
     ? `<p><strong>โรคประจำตัว:</strong> ${diseases.join(", ")}</p>`
     : ""
 }
</div>
`,
      confirmButtonText: "ตกลง",
      customClass: { title: "swal2-title-custom" },
    }).then(() => {
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
        hasDiabetes,
        hasHypertension,
        hasKidneyDisease,
        kidneyStage,
        smoking,
        alcohol,
        activityLevel,
        tdee,
        bmr,
        calories,
        diseases: diseases.join(", "),
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/menu", { state: userData });
    });
  };

  const EggIcon = () => <div className="egg-icon" />;
  const CarrotIcon = () => <div className="carrot-icon" />;

  return (
    <div className="main-container">
      <div
        class="container-fluid d-flex align-items-center justify-content-center min-vh-100 p-4"
        style={{
          background: "linear-gradient(135deg, #B7C7FF 0%, #E5D4FB 100%)",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <div className="w-100" style={{ maxWidth: "450px" }}>
          <div className="card p-4 content-card">
            <div className="text-center">
              <p className="description">โปรแกรมคำนวณสารอาหาร</p>
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

            {/* <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                ศาสนา <span className="required-star">*</span>
              </label>
              <div className="religion-radio-grid">
                <div className="form-check religion-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="buddhism"
                    name="religion"
                    value="buddhism"
                    checked={religion === "buddhism"}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="buddhism">
                    พุทธ
                  </label>
                </div>
                <div className="form-check religion-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="islam"
                    name="religion"
                    value="islam"
                    checked={religion === "islam"}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="islam">
                    อิสลาม
                  </label>
                </div>
                <div className="form-check religion-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="christianity"
                    name="religion"
                    value="christianity"
                    checked={religion === "christianity"}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="christianity">
                    คริสต์
                  </label>
                </div>
                <div className="form-check religion-radio-item">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="other"
                    name="religion"
                    value="other"
                    checked={religion === "other"}
                    onChange={(e) => setReligion(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="other">
                    อื่นๆ
                  </label>
                </div>
              </div>
            </div> */}

            <div className="mb-4">
              <label
                htmlFor="weightDate"
                className="form-label text-center d-block fw-semibold"
              >
                วันที่ชั่งน้ำหนักล่าสุด <span className="required-star">*</span>
              </label>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  id="weightDate"
                  className="form-control weight-input date-picker-input"
                  style={{
                    color: weightDate ? "transparent" : "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                />
                <span className="date-display">
                  {weightDate && formatDateToDDMMYYYY(weightDate) !== ""
                    ? formatDateToDDMMYYYY(weightDate)
                    : "เลือกวันที่"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                โรคประจำตัว
              </label>

              {/* มีโรคประจำตัว */}
              <div className="form-check mb-2">
                <input
                  className="form-check-input radio-input"
                  type="radio"
                  name="diseaseOption"
                  id="hasDisease"
                  checked={hasDiseaseOption}
                  onChange={() => setHasDiseaseOption(true)}
                />
                <label className="form-check-label" htmlFor="hasDisease">
                  มีโรคประจำตัว
                </label>
              </div>

              {/* แสดง Select เมื่อเลือก "มีโรค" */}
              {hasDiseaseOption && (
                <div className="mt-2 ms-4">
                  <select
                    className="form-select disease-select"
                    multiple
                    value={[
                      hasDiabetes && "diabetes",
                      hasHypertension && "hypertension",
                      hasKidneyDisease && "kidney",
                    ].filter(Boolean)}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      );
                      setHasDiabetes(values.includes("diabetes"));
                      setHasHypertension(values.includes("hypertension"));
                      setHasKidneyDisease(values.includes("kidney"));

                      if (!values.includes("kidney")) {
                        setKidneyStage("");
                      }
                    }}
                  >
                    <option value="diabetes">โรคเบาหวาน</option>
                    <option value="hypertension">โรคความดันโลหิตสูง</option>
                    <option value="kidney">โรคไตเรื้อรัง</option>
                  </select>
                </div>
              )}

              {hasDiseaseOption && hasKidneyDisease && (
                <div className="mt-2 ms-4">
                  <label className="form-label small mb-2">
                    เลือกระดับโรคไต
                  </label>

                  <div className="ms-3">
                    {[1, 2, 3, 4].map((level) => (
                      <div className="form-check mb-1" key={level}>
                        <input
                          className="form-check-input radio-input"
                          type="radio"
                          name="kidneyStage"
                          id={`kidney-${level}`}
                          value={level}
                          checked={kidneyStage === String(level)}
                          onChange={(e) => setKidneyStage(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`kidney-${level}`}
                        >
                          ระดับ {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ไม่มีโรคประจำตัว */}
              <div className="form-check mt-3">
                <input
                  className="form-check-input radio-input"
                  type="radio"
                  name="diseaseOption"
                  id="noDisease"
                  checked={!hasDiseaseOption}
                  onChange={() => {
                    setHasDiseaseOption(false);
                    setHasDiabetes(false);
                    setHasHypertension(false);
                    setHasKidneyDisease(false);
                    setKidneyStage("");
                  }}
                />
                <label className="form-check-label" htmlFor="noDisease">
                  ไม่มีโรคประจำตัว
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                สูบบุหรี่ <span className="required-star">*</span>
              </label>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ gap: "80px", paddingRight: "20px" }}
              >
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="smoking-yes"
                    name="smoking"
                    value="yes"
                    checked={smoking === "yes"}
                    onChange={(e) => setSmoking(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="smoking-yes">
                    ใช่
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="smoking-no"
                    name="smoking"
                    value="no"
                    checked={smoking === "no"}
                    onChange={(e) => setSmoking(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="smoking-no">
                    ไม่ใช่
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-center d-block fw-semibold mb-3">
                ดื่มแอลกอฮอล์ <span className="required-star">*</span>
              </label>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ gap: "80px", paddingRight: "20px" }}
              >
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="alcohol-yes"
                    name="alcohol"
                    value="yes"
                    checked={alcohol === "yes"}
                    onChange={(e) => setAlcohol(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="alcohol-yes">
                    ใช่
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input radio-input"
                    type="radio"
                    id="alcohol-no"
                    name="alcohol"
                    value="no"
                    checked={alcohol === "no"}
                    onChange={(e) => setAlcohol(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="alcohol-no">
                    ไม่ใช่
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
