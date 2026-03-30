import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Background from "../components/Background";
import Header from "../components/Header";
import Footer from "../components/Footer";

const QUESTIONS = [
  { key: "firefoot", label: "ปวดแสบร้อน", emoji: "🔥" },
  { key: "icefoot", label: "ปวดเหมือนถูกน้ำแข็ง", emoji: "🧊" },
  { key: "electricfoot", label: "ปวดเหมือนถูกไฟช็อต", emoji: "⚡" },
  { key: "tuckfoot", label: "ซู่ซ่าเหมือนเป็นเหน็บ", emoji: "😖" },
  { key: "needlefoot", label: "แปลบปลายคล้ายเข็มตำ", emoji: "📍" },
  { key: "numpfoot", label: "ชาไร้ความรู้สึก", emoji: "😶" },
  { key: "itchfoot", label: "คัน", emoji: "🤚" },
  { key: "lessfoot", label: "รับรู้สัมผัสได้น้อยกว่าปกติ", emoji: "👆" },
  {
    key: "lessneedlefoot",
    label: "รับรู้เมื่อถูกเข็มตำได้น้อยกว่าปกติ",
    emoji: "💉",
  },
  { key: "cottonfoot", label: "ถูกลูบด้วยสำลี", emoji: "🫧" },
];

function getLevel(yesCount) {
  if (yesCount === 0)
    return {
      label: "ปกติ",
      color: "#22c55e",
      bg: "#f0fdf4",
      border: "#86efac",
    };
  if (yesCount <= 3)
    return {
      label: "ต่ำ",
      color: "#ff9419",
      bg: "#fffbeb",
      border: "#fde68a",
    };
//   if (yesCount <= 5)
//     return {
//       label: "ปานกลาง",
//       color: "#f97316",
//       bg: "#fff7ed",
//       border: "#fed7aa",
//     };
  return {
    label: "สูง",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  };
}

// ─── History List Page ────────────────────────

export default function HistoryFootPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData =
    location.state || JSON.parse(localStorage.getItem("userData") || "null");
  const currentUser = localStorage.getItem("currentUser") || "default";

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(`footExam_${currentUser}`) || "[]",
    );
    setHistory(saved);
  }, [currentUser]);

  return (
    <Background>
      <div style={s.wrapper}>
        <div style={s.outerCard}>
          <Header title="ประวัติการตรวจเท้า" backTo="/menu" />

          <div style={s.inner}>
            {history.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🦶</div>
                <div style={s.emptyText}>ยังไม่มีประวัติการตรวจ</div>
                <button
                  onClick={() => navigate("/foot-exam", { state: userData })}
                  style={s.startBtn}
                >
                  เริ่มตรวจเท้าเลย →
                </button>
              </div>
            ) : (
              <>
                <div style={s.countBar}>ทั้งหมด {history.length} ครั้ง</div>
                {history.map((record, i) => {
                  const level = getLevel(record.yesCount);
                  return (
                    <HistoryCard
                      key={i}
                      record={record}
                      level={level}
                      onView={() =>
                        navigate("/foot-exam/detail", {
                          state: { record, userData },
                        })
                      }
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer userData={userData} />
    </Background>
  );
}

function HistoryCard({ record, level, onView }) {
  const yesKeys = QUESTIONS.filter((q) => record.answers?.[q.key] === true);
  return (
    <div style={s.card}>
      <div style={s.cardTop}>
        <div style={s.cardLeft}>
          <div style={{ ...s.levelDot, background: level.color }} />
          <div>
            <div style={s.cardDate}>📅 {record.date}</div>
            <div style={{ ...s.levelLabel, color: level.color }}>
              ระดับ: {level.label}
            </div>
          </div>
        </div>
        <div
          style={{
            ...s.scoreBadge,
            background: level.bg,
            border: `1px solid ${level.border}`,
            color: level.color,
          }}
        >
          {record.yesCount}/{QUESTIONS.length} อาการ
        </div>
      </div>

      {/* mini symptom preview */}
      {yesKeys.length > 0 && (
        <div style={s.previewRow}>
          {yesKeys.slice(0, 4).map((q) => (
            <span key={q.key} style={s.previewChip}>
              {q.emoji} {q.label}
            </span>
          ))}
          {yesKeys.length > 4 && (
            <span
              style={{
                ...s.previewChip,
                background: "#f1f5f9",
                color: "#64748b",
              }}
            >
              +{yesKeys.length - 4} อื่นๆ
            </span>
          )}
        </div>
      )}

      {yesKeys.length === 0 && (
        <div style={s.noSymptom}>✅ ไม่พบอาการผิดปกติ</div>
      )}

      <button onClick={onView} style={s.viewBtn}>
        ดูผลประเมิน
      </button>
    </div>
  );
}

// ─── Detail Page ──────────────────────────────

export function FootExamDetailPage() {
  const location = useLocation();
  const { record, userData } = location.state || {};
  const level = getLevel(record?.yesCount || 0);
  const yesKeys = QUESTIONS.filter((q) => record?.answers?.[q.key] === true);
  const noKeys = QUESTIONS.filter((q) => record?.answers?.[q.key] === false);

  // score bar (filled squares)
  const total = QUESTIONS.length;
  const yes = record?.yesCount || 0;

  return (
    <Background>
      <div style={s.wrapper}>
        <div style={s.outerCard}>
          <Header title="ผลการประเมิน" backTo="/foot-exam/history" />

          <div style={s.inner}>
            {/* Date + level */}
            <div style={s.detailHeader}>
              <div style={s.detailTitle}>ผลการประเมิน</div>
              <div style={s.detailDate}>{record?.date}</div>
            </div>

            {/* Score bar */}
            <div style={s.scoreCard}>
              <div style={s.scoreLabel}>ระดับความเสี่ยง</div>
              <div style={s.scoreBarRow}>
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...s.scoreSquare,
                      background: i < yes ? level.color : "#e2e8f0",
                    }}
                  />
                ))}
              </div>
              <div style={{ ...s.scoreFraction, color: level.color }}>
                ({yes}/{total} อาการ)
              </div>
              <div style={{ ...s.levelBadge, background: level.color }}>
                {level.label}
              </div>
            </div>

            {/* Yes symptoms */}
            <div style={s.sectionCard}>
              <div style={s.sectionTitle}>อาการที่คุณมี</div>
              {yesKeys.length === 0 ? (
                <div
                  style={{ color: "#22c55e", fontWeight: 600, fontSize: 14 }}
                >
                  ✅ ไม่พบอาการใดเลย
                </div>
              ) : (
                <div style={s.symptomGrid}>
                  {yesKeys.map((q) => (
                    <div key={q.key} style={s.symptomItem}>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>
                        ✓
                      </span>
                      <span style={s.symptomLabel}>
                        {q.emoji} {q.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* No symptoms */}
            {noKeys.length > 0 && (
              <div style={s.sectionCard}>
                <div style={{ ...s.sectionTitle, color: "#64748b" }}>
                  อาการที่คุณไม่มี
                </div>
                <div style={s.symptomGrid}>
                  {noKeys.map((q) => (
                    <div key={q.key} style={s.symptomItem}>
                      <span style={{ color: "#ef4444", fontWeight: 700 }}>
                        ✕
                      </span>
                      <span style={{ ...s.symptomLabel, color: "#94a3b8" }}>
                        {q.emoji} {q.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div
              style={{
                ...s.sectionCard,
                background: "#fffbeb",
                border: "1px solid #fde68a",
              }}
            >
              <div style={{ ...s.sectionTitle, color: "#92400e" }}>
                💡 คำแนะนำเบื้องต้น
              </div>
              {[
                "หลีกเลี่ยงการสัมผัสของร้อนจัดหรือเย็นจัด",
                "หมั่นดูแลและตรวจสอบเท้าทุกวัน",
                "หากอาการไม่ดีขึ้น ควรพบแพทย์",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{ fontSize: 13, color: "#78350f", marginBottom: 4 }}
                >
                  • {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer userData={userData} />
    </Background>
  );
}

// ─── Styles ───────────────────────────────────

const s = {
  wrapper: { maxWidth: 480, width: "100%", paddingBottom: 80 },
  outerCard: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  inner: { padding: "16px 16px 8px" },
  countBar: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: 600,
    marginBottom: 12,
  },

  // empty
  empty: { textAlign: "center", padding: "40px 0" },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: 600,
    marginBottom: 20,
  },
  startBtn: {
    padding: "12px 32px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#64C5D7,#17BCBC)",
    color: "white",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },

  // history card
  card: {
    background: "#f8fffe",
    borderRadius: 14,
    border: "1.5px solid #E0F2F0",
    marginBottom: 12,
    overflow: "hidden",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 14px 10px",
  },
  cardLeft: { display: "flex", alignItems: "center", gap: 10 },
  levelDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  cardDate: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a3a38",
    marginBottom: 2,
  },
  levelLabel: { fontSize: 12, fontWeight: 600 },
  scoreBadge: {
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  previewRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "0 14px 10px",
  },
  previewChip: {
    background: "#E0F2F0",
    color: "#17BCBC",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
  },
  noSymptom: {
    padding: "0 14px 10px",
    fontSize: 13,
    color: "#22c55e",
    fontWeight: 600,
  },
  viewBtn: {
    width: "100%",
    padding: "11px 0",
    background: "linear-gradient(135deg,#64C5D7,#17BCBC)",
    border: "none",
    color: "white",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },

  // detail
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  detailTitle: { fontSize: 18, fontWeight: 800, color: "#1a3a38" },
  detailDate: { fontSize: 13, color: "#9CA3AF", fontWeight: 600 },
  scoreCard: {
    background: "#f8fffe",
    border: "1.5px solid #E0F2F0",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 12,
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 600,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  scoreBarRow: {
    display: "flex",
    gap: 5,
    justifyContent: "center",
    marginBottom: 8,
  },
  scoreSquare: { width: 22, height: 22, borderRadius: 4 },
  scoreFraction: { fontSize: 13, fontWeight: 700, marginBottom: 8 },
  levelBadge: {
    display: "inline-block",
    color: "white",
    borderRadius: 99,
    padding: "5px 18px",
    fontSize: 13,
    fontWeight: 700,
  },
  sectionCard: {
    background: "#f8fffe",
    border: "1px solid #E0F2F0",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#17BCBC",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  symptomGrid: {
    display: "flex",
    flexDirection: "column", // ❌ เดิม grid 2 col → ✅ เปลี่ยนเป็น column
    gap: 8,
  },
  symptomItem: {
    display: "flex",
    alignItems: "flex-start", // ❌ เดิม center → ✅ flex-start
    gap: 8,
  },
  symptomLabel: {
    fontSize: 13,
    color: "#2d3748",
    fontWeight: 500,
    lineHeight: 1.5, // เพิ่ม line-height
    flex: 1, // เพิ่ม flex: 1 ให้ text wrap ได้สวย
  },
};
