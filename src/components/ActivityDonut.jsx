import { useActivities } from "../hooks/useActivities";

export default function ActivityDonut({ monthData }) {
  const activities = useActivities();
  const totals = {};
  activities.forEach((a) => { totals[a.key] = 0; });
  Object.values(monthData).forEach((day) => {
    activities.forEach((a) => {
      if (day[a.key]) totals[a.key] += day[a.key];
    });
  });

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);
  if (grandTotal === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 18,
          padding: "20px 12px",
          maxWidth: 420,
          width: "100%",
          border: "1px solid var(--card-border)",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Activity Distribution
        </div>
        <div style={{ fontSize: 24, marginBottom: 6 }}>📊</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>No activities this month</div>
      </div>
    );
  }

  const cx = 90;
  const cy = 90;
  const r = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * r;

  let offsetAccum = 0;
  const segments = activities.filter((a) => totals[a.key] > 0).map((a) => {
    const pct = totals[a.key] / grandTotal;
    const dashLen = pct * circumference;
    const seg = {
      ...a,
      minutes: totals[a.key],
      pct,
      dashArray: `${dashLen} ${circumference - dashLen}`,
      dashOffset: -offsetAccum,
    };
    offsetAccum += dashLen;
    return seg;
  });

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
        Activity Distribution
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
        <svg viewBox="0 0 180 180" style={{ width: 160, height: 160 }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bar-track)" strokeWidth={strokeWidth} />
          {/* Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.key}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={0.85}
            />
          ))}
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--text-primary)">
            {grandTotal >= 60
              ? `${Math.floor(grandTotal / 60)}h${grandTotal % 60 > 0 ? ` ${grandTotal % 60}m` : ""}`
              : `${grandTotal}m`}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-muted)">
            total
          </text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {segments.map((seg) => (
            <div key={seg.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: seg.color }} />
              <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>
                {seg.emoji} {seg.label}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                {Math.round(seg.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
