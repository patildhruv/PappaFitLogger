import { useRef, useState, createRef } from "react";
import { useActivities } from "../hooks/useActivities";
import { captureAndShare } from "../utils/shareCard";
import ShareableCard from "./ShareableCard";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function History({ sortedDays }) {
  const activities = useActivities();
  const [sharingDay, setSharingDay] = useState(null);
  const cardRef = useRef(null);

  async function handleShare(day) {
    setSharingDay(day.date);
    // Wait for the card to render
    await new Promise((r) => setTimeout(r, 100));
    if (!cardRef.current) { setSharingDay(null); return; }
    try {
      await captureAndShare(cardRef.current, {
        text: `My fitness summary for ${formatDate(day.date)}!`,
        filename: `pappafit-summary-${day.date}.png`,
      });
    } catch {}
    setSharingDay(null);
  }

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

  const sharingDayData = sharingDay ? sortedDays.find((d) => d.date === sharingDay) : null;

  return (
    <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Off-screen shareable card for capture */}
      {sharingDayData && (
        <div style={{ position: "absolute", left: -9999, top: 0, width: 420 }}>
          <ShareableCard
            ref={cardRef}
            dayData={sharingDayData}
            dateStr={formatDateLong(sharingDayData.date)}
          />
        </div>
      )}

      {sortedDays.map((day) => {
        const activeActs = activities.filter((a) => day[a.key]);
        const totalMin = activeActs.reduce((s, a) => s + day[a.key], 0);
        const isSharing = sharingDay === day.date;
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {totalMin > 0 && (
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                    {Math.floor(totalMin / 60) > 0 && `${Math.floor(totalMin / 60)}h `}
                    {totalMin % 60}m
                  </span>
                )}
                <button
                  onClick={() => handleShare(day)}
                  disabled={isSharing}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 16,
                    cursor: isSharing ? "wait" : "pointer",
                    padding: "2px 4px",
                    opacity: isSharing ? 0.4 : 0.6,
                    lineHeight: 1,
                  }}
                  title="Share this day's summary"
                >
                  📤
                </button>
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
            {day.note && (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  background: "var(--note-bg)",
                  borderRadius: 6,
                  padding: "3px 8px",
                }}
              >
                📝 {day.note}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
