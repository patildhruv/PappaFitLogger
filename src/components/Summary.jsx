import { useActivities } from "../hooks/useActivities";

export default function Summary({ monthData, daysInMonth }) {
  const activities = useActivities();
  const actCounts = {};
  const totalMinByAct = {};
  activities.forEach((a) => {
    actCounts[a.key] = 0;
    totalMinByAct[a.key] = 0;
  });

  Object.values(monthData).forEach((d) => {
    activities.forEach((a) => {
      if (d[a.key]) {
        actCounts[a.key]++;
        totalMinByAct[a.key] += d[a.key];
      }
    });
  });

  return (
    <div
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(12px)",
        borderRadius: 18,
        padding: 16,
        maxWidth: 420,
        width: "100%",
        border: "1px solid var(--card-border)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 12,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        Monthly Summary
      </div>
      {activities.map((a) => {
        const count = actCounts[a.key];
        const mins = totalMinByAct[a.key];
        const pct = daysInMonth > 0 ? (count / daysInMonth) * 100 : 0;
        return (
          <div key={a.key} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                {a.emoji} {a.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ fontWeight: 700, color: a.color }}>{count}</span>
                <span style={{ color: "var(--text-faint)" }}>/{daysInMonth} days</span>
                {mins > 0 && (
                  <span style={{ marginLeft: 6, color: "var(--text-faint)" }}>
                    ({Math.floor(mins / 60) > 0 ? `${Math.floor(mins / 60)}h` : ""}
                    {mins % 60 > 0 ? ` ${mins % 60}m` : ""})
                  </span>
                )}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--bar-track)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(pct, 100)}%`,
                  background: `linear-gradient(90deg, ${a.color}, ${a.color}cc)`,
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
