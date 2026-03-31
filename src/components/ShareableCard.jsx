import { forwardRef } from "react";
import { useActivities } from "../hooks/useActivities";

const ShareableCard = forwardRef(function ShareableCard({ dayData, dateStr, activeDays, daysInMonth }, ref) {
  const activities = useActivities();
  const activeActs = activities.filter((a) => dayData[a.key]);
  const totalMin = activeActs.reduce((s, a) => s + dayData[a.key], 0);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: 24,
        padding: "28px 20px 24px",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(45,156,219,0.12)" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(242,153,74,0.1)" }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 4 }}>
          Daily Fitness Summary
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, marginBottom: 2 }}>
          {dateStr}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
          Pappa's Tracker
        </div>
      </div>

      {/* Big total time */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>
          {totalMin > 0 ? timeStr : "Rest Day"}
        </div>
        {totalMin > 0 && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            Total workout time
          </div>
        )}
      </div>

      {/* Activity pills */}
      {activeActs.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 18 }}>
          {activeActs.map((a) => (
            <div
              key={a.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: `${a.color}25`,
                border: `1px solid ${a.color}40`,
                borderRadius: 12,
                padding: "8px 12px",
              }}
            >
              <span style={{ fontSize: 18 }}>{a.emoji}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: a.color, opacity: 0.9 }}>{a.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{dayData[a.key]}m</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", marginBottom: 18, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          No activities logged
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "flex", gap: 8, marginBottom: dayData.note ? 14 : 0 }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{activeActs.length}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>Activities</div>
        </div>
        {activeDays != null && daysInMonth != null && (
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{activeDays}<span style={{ fontSize: 11, fontWeight: 500, opacity: 0.5 }}>/{daysInMonth}</span></div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>This Month</div>
          </div>
        )}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{timeStr}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>Total</div>
        </div>
      </div>

      {/* Note */}
      {dayData.note && (
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
            📝 {dayData.note}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>
        PappaFit Logger — Consistency is the real strength 💪
      </div>
    </div>
  );
});

export default ShareableCard;
