export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { key: "today", label: "Today" },
    { key: "history", label: "History" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        maxWidth: 420,
        width: "100%",
        marginBottom: 16,
        background: "var(--card-bg)",
        borderRadius: 14,
        padding: 4,
        border: "1px solid var(--card-border)",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 11,
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            background: activeTab === t.key ? "var(--card-bg-strong)" : "transparent",
            color: activeTab === t.key ? "var(--text-primary)" : "var(--text-muted)",
            transition: "all 0.2s ease",
            boxShadow: activeTab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
