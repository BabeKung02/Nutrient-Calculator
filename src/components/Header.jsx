import { useNavigate } from "react-router-dom";

const Header = ({ title, backTo = -1 }) => {
  const navigate = useNavigate();

  const styles = {
    header: {
      position: "relative",
      padding: "20px 16px 28px",
      background: "linear-gradient(135deg, #eef2ff, #f8f9ff)",
      borderRadius: "16px",
    },
    backBtn: {
      position: "absolute",
      top: "12px",
      left: "12px",

      width: "44px", // 👈 Apple HIG แนะนำขั้นต่ำ
      height: "44px",

      borderRadius: "50% ",
      border: "none",
      background: "white",
      color: "#4c51bf",

      fontSize: "20px",
      fontWeight: 600,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      cursor: "pointer",
      zIndex: 10, // 👈 สำคัญมาก
      WebkitTapHighlightColor: "transparent",
    },

    title: {
      textAlign: "center",
      fontSize: "20px",
      fontWeight: 700,
      color: "#4c51bf",
      margin: 0,
      position: "relative",
      top: "6px",
    },
  };

  return (
    <div style={styles.header}>
      <button
        style={styles.backBtn}
        onClick={() => navigate(backTo)}
        aria-label="ย้อนกลับ"
      >
        ❮
      </button>
      <h2 style={styles.title}>{title}</h2>
    </div>
  );
};

export default Header;
