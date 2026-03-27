function Background({ children }) {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "40px 15px",
        // background: "linear-gradient(135deg, #CEEAE5 100%)",
        // background: "linear-gradient(180deg, #E0F2F1 0%, #B2EBF2 100%)",
        background: "linear-gradient(180deg, #D1F2EB 0%, #A9CCE3 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <style>{`
        * { outline: none !important; }
        *:focus { outline: none !important; }
        svg { outline: none !important; }
        .recharts-surface { outline: none !important; }
      `}</style>
      {children}
    </div>
  );
}

export default Background;