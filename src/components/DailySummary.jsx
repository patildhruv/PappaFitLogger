import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useActivities } from "../hooks/useActivities";

export default function DailySummary({ todayData, dateStr, activeDays, daysInMonth }) {
  const activities = useActivities();
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  const activeActs = activities.filter((a) => todayData[a.key]);
  const totalMin = activeActs.reduce((s, a) => s + todayData[a.key], 0);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  async function handleShare() {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (navigator.share && blob) {
        const file = new File([blob], "pappafit-daily-summary.png", { type: "image/png" });
        try {
          await navigator.share({
            title: "My Fitness Summary",
            text: `Today's workout: ${timeStr} across ${activeActs.length} activities!`,
            files: [file],
          });
        } catch (err) {
          if (err.name !== "AbortError") {
            downloadFallback(canvas);
          }
        }
      } else {
        downloadFallback(canvas);
      }
    } catch {
      alert("Could not capture summary. Please try again.");
    }

    setSharing(false);
  }

  function downloadFallback(canvas) {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `pappafit-summary-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
  }

  return (
    <div style={{ maxWidth: 420, width: "100%" }}>
      {/* Shareable Card */}
      <div
        ref={cardRef}
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
            Swapnil's Tracker
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
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{todayData[a.key]}m</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 18, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            No activities logged yet
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 8, marginBottom: todayData.note ? 14 : 0 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{activeActs.length}</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>Activities</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{activeDays}<span style={{ fontSize: 11, fontWeight: 500, opacity: 0.5 }}>/{daysInMonth}</span></div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>This Month</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{timeStr}</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>Today</div>
          </div>
        </div>

        {/* Note */}
        {todayData.note && (
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
              📝 {todayData.note}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>
          PappaFit Logger — Consistency is the real strength 💪
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={sharing}
        style={{
          width: "100%",
          marginTop: 14,
          padding: "14px 0",
          borderRadius: 14,
          border: "none",
          background: sharing ? "var(--button-muted-bg)" : "linear-gradient(135deg, #2D9CDB, #56CCF2)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: sharing ? "wait" : "pointer",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {sharing ? "Preparing..." : "📤 Share Summary"}
      </button>
    </div>
  );
}
