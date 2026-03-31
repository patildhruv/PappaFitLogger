import { ACTIVITIES } from "../data/activities";

export default function TodayLog({ todayData }) {
  const activeActivities = ACTIVITIES.filter((a) => todayData[a.key]);
  const totalMin = activeActivities.reduce((sum, a) => sum + todayData[a.key], 0);
  const notes = todayData.notes || [];

  if (activeActivities.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          padding: "20px 16px",
          maxWidth: 420,
          width: "100%",
          marginBottom: 16,
          border: "1px solid var(--card-border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>🏃‍♂️</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
          No activities yet today
        </div>
        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
          Tap an activity above to get started!
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 16,
        padding: 16,
        maxWidth: 420,
        width: "100%",
        marginBottom: 16,
        border: "1px solid var(--card-border)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
          Today's Log
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
          {Math.floor(totalMin / 60) > 0 && `${Math.floor(totalMin / 60)}h `}
          {totalMin % 60}m total
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {activeActivities.map((a) => (
          <div
            key={a.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: `${a.color}15`,
              border: `1.5px solid ${a.color}30`,
              borderRadius: 10,
              padding: "6px 10px",
            }}
          >
            <span style={{ fontSize: 14 }}>{a.emoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: a.color }}>{a.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{todayData[a.key]} min</div>
            </div>
          </div>
        ))}
      </div>
      {notes.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {notes.map((n, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontStyle: "italic",
                background: "var(--note-bg)",
                borderRadius: 8,
                padding: "5px 10px",
              }}
            >
              📝 {n.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
