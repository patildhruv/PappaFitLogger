import { useRef, useState } from "react";
import { captureAndShare } from "../utils/shareCard";
import ShareableCard from "./ShareableCard";

export default function DailySummary({ todayData, dateStr, activeDays, daysInMonth }) {
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);

  async function handleShare() {
    if (!cardRef.current || sharing) return;
    setSharing(true);
    try {
      await captureAndShare(cardRef.current, {
        text: `My fitness summary for today!`,
      });
    } catch {
      alert("Could not capture summary. Please try again.");
    }
    setSharing(false);
  }

  return (
    <div style={{ maxWidth: 420, width: "100%" }}>
      <ShareableCard
        ref={cardRef}
        dayData={todayData}
        dateStr={dateStr}
        activeDays={activeDays}
        daysInMonth={daysInMonth}
      />
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
