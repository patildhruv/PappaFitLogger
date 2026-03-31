import { useActivities } from "../hooks/useActivities";

function getLast7Days(logs, activities) {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const data = logs[key] || {};
    const segments = activities.filter((a) => data[a.key]).map((a) => ({
      key: a.key,
      color: a.color,
      minutes: data[a.key],
    }));
    const total = segments.reduce((s, seg) => s + seg.minutes, 0);
    days.push({ key, dayName, segments, total, dayNum: d.getDate() });
  }
  return days;
}

export default function WeeklyBarChart({ logs }) {
  const activities = useActivities();
  const days = getLast7Days(logs, activities);
  const maxTotal = Math.max(...days.map((d) => d.total), 1);

  const chartW = 380;
  const chartH = 140;
  const barW = 36;
  const gap = (chartW - barW * 7) / 8;
  const topPad = 10;

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: 18,
        padding: "14px 12px",
        maxWidth: 420,
        width: "100%",
        border: "1px solid var(--card-border)",
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
        Last 7 Days
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH + 24}`} style={{ width: "100%", height: "auto" }}>
        {days.map((day, i) => {
          const x = gap + i * (barW + gap);
          const barMaxH = chartH - topPad;
          let yOffset = chartH;

          return (
            <g key={day.key}>
              {/* Background track */}
              <rect
                x={x}
                y={topPad}
                width={barW}
                height={barMaxH}
                rx={6}
                fill="var(--bar-track)"
              />
              {/* Stacked segments */}
              {day.segments.map((seg) => {
                const segH = (seg.minutes / maxTotal) * barMaxH;
                yOffset -= segH;
                return (
                  <rect
                    key={seg.key}
                    x={x}
                    y={yOffset}
                    width={barW}
                    height={segH}
                    rx={segH === (day.total / maxTotal) * barMaxH ? 6 : 0}
                    fill={seg.color}
                    opacity={0.85}
                  />
                );
              })}
              {/* Total on top */}
              {day.total > 0 && (
                <text
                  x={x + barW / 2}
                  y={chartH - (day.total / maxTotal) * (chartH - topPad) - 3}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="var(--text-muted)"
                >
                  {day.total}m
                </text>
              )}
              {/* Day label */}
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--text-muted)"
              >
                {day.dayName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
