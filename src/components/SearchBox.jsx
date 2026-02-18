import { useState } from "react";

/**
 * SearchBox - ช่องค้นหาสำหรับหน้าบันทึกอาหาร
 * @param {string} value - ค่าปัจจุบันในช่องค้นหา
 * @param {function} onChange - callback เมื่อค่าเปลี่ยน (รับ string)
 * @param {string} placeholder - placeholder text (default: "ค้นหา...")
 */
export default function SearchBox({ value, onChange, placeholder = "ค้นหา..." }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          border: isFocused ? "2px solid #667eea" : "2px solid #e2e8f0",
          borderRadius: "12px",
          padding: "10px 14px",
          background: "white",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* 🔍 Icon */}
        <span
          style={{
            fontSize: "1.1rem",
            marginRight: "8px",
            color: isFocused ? "#667eea" : "#9ca3af",
            transition: "color 0.2s ease",
          }}
        >
          🔍
        </span>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "0.95rem",
            color: "#2d3748",
            background: "transparent",
            fontFamily: "inherit",
          }}
        />

        {/* Clear button (แสดงเมื่อมีข้อความ) */}
        {value && (
          <button
            onClick={() => onChange("")}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              border: "none",
              background: "#e2e8f0",
              color: "#718096",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
            onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}