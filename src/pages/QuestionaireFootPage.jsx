import { useState } from "react";
import { useLocation } from "react-router-dom";
import Background from "../components/Background";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ─── Config ───────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    key: "firefoot",
    label: "ปวดแสบร้อน",
    emoji: "🔥",
    image: "/firefoot.png",
  },
  {
    id: 2,
    key: "icefoot",
    label: "ปวดเหมือนถูกน้ำแข็ง",
    emoji: "🧊",
    image: "/icefoot.jpg",
  },
  {
    id: 3,
    key: "electricfoot",
    label: "ปวดเหมือนถูกไฟช็อต",
    emoji: "⚡",
    image: "/electricfoot.jpg",
  },
  {
    id: 4,
    key: "tuckfoot",
    label: "ซู่ซ่าเหมือนเป็นเหน็บ",
    emoji: "😖",
    image: "/tuckfoot.jpg",
  },
  {
    id: 5,
    key: "needlefoot",
    label: "แปลบปลายคล้ายเข็มตำ",
    emoji: "📍",
    image: "/needlefoot.jpg",
  },
  {
    id: 6,
    key: "numpfoot",
    label: "ชาไร้ความรู้สึก",
    emoji: "😶",
    image: "/numpfoot.jpg",
  },
  { id: 7, key: "itchfoot", label: "คัน", emoji: "🤚", image: "/itchfoot.jpg" },
  {
    id: 8,
    key: "lessfoot",
    label: "รับรู้สัมผัสได้น้อยกว่าปกติ",
    emoji: "👆",
    image: "/lessfoot.jpg",
  },
  {
    id: 9,
    key: "lessneedlefoot",
    label: "รับรู้เมื่อถูกเข็มตำได้น้อยกว่าปกติ",
    emoji: "💉",
    image: "/lessneedlefoot.jpg",
  },
  {
    id: 10,
    key: "cottonfoot",
    label: "ถูกลูบด้วยสำลี",
    emoji: "🫧",
    image: "/cottonfoot.jpg",
  },
];

// ─── Helper ───────────────────────────────────

function getTodayThai() {
  return new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getLevel(yesCount) {
  if (yesCount === 0)
    return {
      label: "ไม่พบความเสี่ยง",
      color: "#22c55e",
      icon: "✅",
      desc: "ไม่พบอาการของ Neuropathic Pain",
    };
  //   if (yesCount <= 3)   return { label: "ต่ำ",           color: "#64C5D7", icon: "🟡", desc: "อาการน้อย ควรสังเกตอาการต่อเนื่อง" };
  if (yesCount <= 3)
    return {
      label: "ต่ำ",
      color: "#f59e0b",
      icon: "⚠️",
      desc: "ใกล้เกณฑ์ ควรพบแพทย์เพื่อประเมินเพิ่มเติม",
    };
  return {
    label: "สูง",
    color: "#ef4444",
    icon: "🚨",
    desc: "คะแนน ≥ 4 บ่งชี้ Neuropathic Pain ควรพบแพทย์",
  };
}

// ─── Sub-components ───────────────────────────

function ProgressBar({ current, total }) {
  return (
    <div style={{ padding: "0 20px 16px", marginTop: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={s.progressText}>
          ข้อที่ {current} จาก {total}
        </span>
        <span style={s.progressText}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div style={s.progressTrack}>
        <div
          style={{ ...s.progressFill, width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function QuestionCard({ q, answer, onAnswer }) {
  return (
    <div style={s.card}>
      {/* Image */}
      <div style={s.imageWrap}>
        <img
          src={q.image}
          alt={q.label}
          style={s.image}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Label */}
      <div style={s.labelWrap}>
        <span style={s.emoji}>{q.emoji}</span>
        <span style={s.labelText}>{q.label}</span>
      </div>

      {/* Yes / No buttons */}
      <div style={s.answerRow}>
        <button
          onClick={() => onAnswer(false)}
          style={{
            ...s.answerBtn,
            background: answer === false ? "#ef4444" : "white",
            color: answer === false ? "white" : "#ef4444",
            border: `2px solid ${answer === false ? "#ef4444" : "#fca5a5"}`,
            boxShadow:
              answer === false ? "0 4px 14px rgba(239,68,68,0.35)" : "none",
          }}
        >
          ไม่ใช่
        </button>
        <button
          onClick={() => onAnswer(true)}
          style={{
            ...s.answerBtn,
            background: answer === true ? "#22c55e" : "white",
            color: answer === true ? "white" : "#22c55e",
            border: `2px solid ${answer === true ? "#22c55e" : "#86efac"}`,
            boxShadow:
              answer === true ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
          }}
        >
          ใช่
        </button>
      </div>
    </div>
  );
}

function ResultCard({ answers, onReset, userData }) {
  const yesKeys = QUESTIONS.filter((q) => answers[q.key] === true);
  const level = getLevel(yesKeys.length);
  const tips = [
    "หลีกเลี่ยงการสัมผัสของร้อนจัดหรือเย็นจัด",
    "หมั่นดูแลและตรวจสอบเท้าทุกวัน",
    "หากอาการไม่ดีขึ้นควรพบแพทย์",
  ];

  return (
    <div style={s.card}>
      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <div style={s.resultTitle}>ผลการประเมิน</div>
        <div style={{ ...s.levelBadge, background: level.color }}>
          {yesKeys.length === 0
            ? "ไม่พบความเสี่ยง"
            : `${level.icon} ความเสี่ยงระดับ: ${level.label}`}
        </div>
        {userData && (
          <div style={s.resultSub}>
            คุณมีอาการที่คุณรู้สึก {yesKeys.length} รายการ
          </div>
        )}

        {/* {level.desc} */}
      </div>

      {/* Yes answers */}
      {yesKeys.length > 0 && (
        <div style={s.resultSection}>
          <div style={s.resultSectionTitle}>อาการที่ตอบ "ใช่"</div>
          {yesKeys.map((q) => (
            <div key={q.key} style={s.resultItem}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>
              <span style={s.resultLabel}>
                {q.emoji} {q.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {yesKeys.length === 0 && (
        <div
          style={{ ...s.resultSection, textAlign: "center", color: "#22c55e" }}
        >
          <div style={{ fontWeight: 600 }}>ไม่พบอาการผิดปกติ</div>
        </div>
      )}

      {/* Tips */}
      <div
        style={{
          ...s.resultSection,
          background: "#fefce8",
          border: "1px solid #fde68a",
        }}
      >
        <div style={{ ...s.resultSectionTitle, color: "#92400e" }}>
          💡 คำแนะนำเบื้องต้น
        </div>
        {tips.map((t, i) => (
          <div
            key={i}
            style={{ fontSize: 13, color: "#78350f", marginBottom: 4 }}
          >
            • {t}
          </div>
        ))}
      </div>

      <button onClick={onReset} style={s.resetBtn}>
        ทำแบบประเมินใหม่
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────

export default function FootExamPage() {
  const location = useLocation();
  const userData =
    location.state || JSON.parse(localStorage.getItem("userData") || "null");

  const currentUser = localStorage.getItem("currentUser") || "default";
  const STORAGE_KEY = `footExam_${currentUser}`;

  const [current, setCurrent] = useState(0); // 0 = intro, 1-10 = questions, 11 = result
  const [answers, setAnswers] = useState({});

  const today = getTodayThai();
  const q = QUESTIONS[current - 1];
  const isDone = current > QUESTIONS.length;
  const isIntro = current === 0;

  const handleAnswer = (val) => {
    setAnswers((prev) => ({ ...prev, [q.key]: val }));
  };

  const handleNext = () => {
    if (current === QUESTIONS.length) {
      // save to localStorage
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const record = {
        date: today,
        answers: { ...answers },
        yesCount: Object.values(answers).filter(Boolean).length,
      };
      history.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30))); // เก็บ 30 ครั้ง
      setCurrent(current + 1);
    } else {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => setCurrent((p) => Math.max(1, p - 1));
  const handleReset = () => {
    setAnswers({});
    setCurrent(0);
  };
  const handleStart = () => setCurrent(1);

  const canNext = isDone
    ? false
    : isIntro
      ? true
      : answers[q?.key] !== undefined;

  return (
    <>
      <Background>
        <div style={s.wrapper}>
          <div style={s.outerCard}>
            <Header title="บันทึกการตรวจเท้า" backTo="/menu" />

            <div style={s.inner}>
              {/* Intro */}
              {isIntro && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>🦶</div>
                  <div style={s.introTitle}>แบบประเมินอาการเท้า</div>
                  <div style={s.introSub}>วันที่ {today}</div>
                  <div style={s.introDesc}>
                    มีทั้งหมด {QUESTIONS.length} ข้อ
                    <br />
                    กรุณาตอบตามอาการที่รู้สึกจริง
                  </div>
                  <button onClick={handleStart} style={s.startBtn}>
                    เริ่มการประเมิน
                  </button>
                </div>
              )}

              {/* Question */}
              {!isIntro && !isDone && q && (
                <>
                  <ProgressBar current={current} total={QUESTIONS.length} />
                  <div
                    style={{
                      padding: "0 16px",
                      marginBottom: 6,
                      color: "#5C7C7A",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    คุณมีอาการแบบนี้ไหม?
                  </div>
                  <QuestionCard
                    q={q}
                    answer={answers[q.key]}
                    onAnswer={handleAnswer}
                  />
                </>
              )}

              {/* Result */}
              {isDone && (
                <div style={{ padding: "0 16px" }}>
                  <ResultCard
                    answers={answers}
                    onReset={handleReset}
                    userData={userData}
                  />
                </div>
              )}

              {/* Navigation buttons */}
              {!isIntro && !isDone && (
                <div style={s.navRow}>
                  {current > 1 && (
                    <button onClick={handlePrev} style={s.prevBtn}>
                      ย้อนกลับ
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!canNext}
                    style={{
                      ...s.nextBtn,
                      opacity: canNext ? 1 : 0.4,
                      cursor: canNext ? "pointer" : "not-allowed",
                      marginLeft: current === 1 ? "auto" : 0,
                    }}
                  >
                    {current === QUESTIONS.length ? "ดูผลลัพธ์" : "ถัดไป"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer userData={userData} />
      </Background>
    </>
  );
}

// ─── Styles ───────────────────────────────────

const s = {
  wrapper: {
    maxWidth: 480,
    width: "100%",
    paddingBottom: 80,
  },
  outerCard: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  inner: { padding: "0 0 16px" },

  // progress
  progressText: { fontSize: 13, color: "#5C7C7A", fontWeight: 600 },
  progressTrack: {
    height: 8,
    background: "#E0F2F0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #64C5D7, #17BCBC)",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },

  // card
  card: {
    margin: "20px 16px",
    background: "white",
    borderRadius: 16,
    border: "1.5px solid #E0F2F0",
    boxShadow: "0 2px 12px rgba(23,188,188,0.08)",
    overflow: "hidden",
    marginBottom: 12,
  },
  imageWrap: {
    width: "100%",
    height: 220,
    background: "#f8fffe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  labelWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px 10px",
    borderBottom: "1px solid #E0F2F0",
  },
  emoji: { fontSize: 24 },
  labelText: { fontSize: 16, fontWeight: 700, color: "#1a3a38" },

  // answer buttons
  answerRow: { display: "flex", gap: 10, padding: "14px 16px" },
  answerBtn: {
    flex: 1,
    padding: "12px 0",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  // nav
  navRow: { display: "flex", gap: 10, padding: "8px 16px 0" },
  prevBtn: {
    flex: 1,
    padding: "13px 0",
    borderRadius: 12,
    border: "2px solid #E0F2F0",
    background: "white",
    color: "#5C7C7A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  nextBtn: {
    flex: 1,
    padding: "13px 0",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #64C5D7, #17BCBC)",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
  },

  // intro
  introTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#1a3a38",
    marginBottom: 6,
  },
  introSub: {
    fontSize: 13,
    color: "#5C7C7A",
    marginBottom: 16,
    fontWeight: 600,
  },
  introDesc: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
    lineHeight: 1.8,
  },
  startBtn: {
    padding: "14px 40px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #64C5D7, #17BCBC)",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(23,188,188,0.35)",
  },

  // result
  resultTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1a3a38",
    marginBottom: 10,
  },
  levelBadge: {
    display: "inline-block",
    color: "white",
    borderRadius: 99,
    padding: "6px 18px",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  resultSub: { fontSize: 13, color: "#9CA3AF", marginBottom: 4 },
  resultSection: {
    background: "#f8fffe",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 10,
    border: "1px solid #E0F2F0",
  },
  resultSectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#17BCBC",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  resultItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  resultLabel: { fontSize: 14, color: "#2d3748", fontWeight: 500 },
  resetBtn: {
    width: "100%",
    padding: "13px 0",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #64C5D7, #17BCBC)",
    color: "white",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
  },
};
