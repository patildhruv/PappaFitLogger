import { useActivities } from "../hooks/useActivities";

export default function DayCell({ day, data, selected, onSelect, isSunday }) {
  const activities = useActivities();
  if (day === null) return <div style={{ width: 44, height: 52 }} />;

  const hasActivity = data && activities.some((a) => data[a.key]);
  const activeActs = activities.filter((a) => data?.[a.key]);

  const bgColor =
    selected === day
      ? "rgba(45,156,219,0.15)"
      : isSunday && !hasActivity
      ? "rgba(155,81,224,0.06)"
      : hasActivity
      ? "var(--card-bg-strong)"
      : "var(--card-bg)";

  return (
    <div
      onClick={() => onSelect(day)}
      style={{
        width: 44,
        height: 52,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: bgColor,
        border:
          selected === day
            ? "2px solid #2D9CDB"
            : isSunday
            ? "1.5px dashed rgba(155,81,224,0.25)"
            : "1.5px solid var(--card-border)",
        transition: "all 0.2s ease",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: isSunday && !hasActivity ? "var(--sunday-color)" : "var(--text-primary)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {day}
      </span>
      <div
        style={{
          display: "flex",
          gap: 1.5,
          marginTop: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 36,
        }}
      >
        {activeActs.map((a) => (
          <div
            key={a.key}
            style={{
              width: 5.5,
              height: 5.5,
              borderRadius: "50%",
              background: a.color,
            }}
          />
        ))}
        {isSunday && !hasActivity && (
          <span style={{ fontSize: 8, color: "var(--sunday-color)" }}>rest</span>
        )}
      </div>
    </div>
  );
}
