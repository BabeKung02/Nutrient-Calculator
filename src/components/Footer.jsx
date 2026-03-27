import { useNavigate, useLocation } from "react-router-dom";

// ─── Icons ────────────────────────────────────

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24"
    fill={active ? "white" : "none"}
    stroke={active ? "white" : "#4A4A4A"}
    strokeWidth="2.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PersonIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24"
    fill={active ? "white" : "none"}
    stroke={active ? "white" : "#4A4A4A"}
    strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Config ───────────────────────────────────

const NAV_ITEMS = [
  { label: "หน้าหลัก",      path: "/menu",     Icon: HomeIcon   },
  { label: "ข้อมูลส่วนตัว", path: "/personal", Icon: PersonIcon },
];

// ─── Helper ───────────────────────────────────

function resolveUserData(userData) {
  return userData
    || JSON.parse(localStorage.getItem("userData") || "null");
}

// ─── Main Component ───────────────────────────

export default function Footer({ userData }) {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (path) => {
    const data = resolveUserData(userData);
    navigate(path, { state: data });
  };

  return (
    <div style={styles.outerWrapper}>
      <nav style={styles.innerCard}>
        {NAV_ITEMS.map(({ label, path, Icon }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              style={{
                ...styles.navBtn,
                backgroundColor: isActive ? "#2E5BFF" : "#D1F2EB",
                boxShadow: isActive ? "0 4px 10px rgba(46,91,255,0.3)" : "none",
                transform: isActive ? "scale(1.02)" : "scale(1)",
              }}
            >
              <Icon active={isActive} />
              <span style={{
                ...styles.label,
                color:      isActive ? "#FFFFFF" : "#4A4A4A",
                fontWeight: isActive ? 700 : 500,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Styles ───────────────────────────────────

const styles = {
  outerWrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
    padding: "10px 0",
    paddingBottom: "env(safe-area-inset-bottom, 10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 1000,
    pointerEvents: "none",
  },
  innerCard: {
    width: "93%",
    maxWidth: "500px",
    height: "65px",
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    display: "flex",
    padding: "5px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
    gap: "8px",
    pointerEvents: "auto",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  navBtn: {
    flex: 1,
    border: "none",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    gap: "2px",
  },
  label: {
    fontSize: "11px",
  },
};