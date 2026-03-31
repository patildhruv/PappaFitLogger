import { useActivities } from "../hooks/useActivities";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function History({ sortedDays }) {
  const activities = useActivities();
  if (sortedDays.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          padding: "24px 16px",
          maxWidth: 420,
          width: "100%",
          marginBottom: 16,
          border: "1px solid var(--card-border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
          No history yet. Start tracking today!
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      {sortedDays.map((day) => {
        const activeActs = activities.filter((a) => day[a.key]);
        const totalMin = activeActs.reduce((s, a) => s + day[a.key], 0);
        const notes = day.notes || [];

        return (
          <div
            key={day.date}
            style={{
              background: "var(--card-bg)",
              borderRadius: 16,
              padding: 14,
              border: "1px solid var(--card-border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                {formatDate(day.date)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                {totalMin > 0 && (
                  <>
                    {Math.floor(totalMin / 60) > 0 && `${Math.floor(totalMin / 60)}h `}
                    {totalMin % 60}m
                  </>
                )}
              </div>
            </div>
            {activeActs.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {activeActs.map((a) => (
                  <div
                    key={a.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: `${a.color}15`,
                      border: `1px solid ${a.color}25`,
                      borderRadius: 8,
                      padding: "4px 8px",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{a.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: a.color }}>{day[a.key]}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic" }}>
                No activities
              </div>
            )}
            {notes.length > 0 && (
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                {notes.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      background: "var(--note-bg)",
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    📝 {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
