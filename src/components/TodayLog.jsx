import { useState, useEffect, useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import { captureAndShare } from "../utils/shareCard";
import ShareableCard from "./ShareableCard";

export default function TodayLog({ todayData, dayNote, onNoteChange, dateStr, activeDays, daysInMonth }) {
  const activities = useActivities();
  const activeActivities = activities.filter((a) => todayData[a.key]);
  const totalMin = activeActivities.reduce((sum, a) => sum + todayData[a.key], 0);
  const [note, setNote] = useState(dayNote);
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setNote(dayNote);
  }, [dayNote]);

  function handleNoteBlur() {
    const trimmed = note.trim();
    if (trimmed !== dayNote) {
      onNoteChange(trimmed);
      setToast(true);
      setTimeout(() => setToast(false), 1500);
    }
  }

  async function handleShare() {
    if (sharing) return;
    setSharing(true);
    await new Promise((r) => setTimeout(r, 100));
    if (cardRef.current) {
      try {
        await captureAndShare(cardRef.current, {
          text: "My fitness summary for today!",
        });
      } catch {}
    }
    setSharing(false);
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
      {/* Off-screen shareable card */}
      <div style={{ position: "absolute", left: -9999, top: 0, width: 420 }}>
        <ShareableCard
          ref={cardRef}
          dayData={todayData}
          dateStr={dateStr}
          activeDays={activeDays}
          daysInMonth={daysInMonth}
        />
      </div>

      {activeActivities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🏃‍♂️</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
            No activities yet today
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
            Tap an activity above to get started!
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 0.5, textTransform: "uppercase" }}>
              Today's Log
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                {Math.floor(totalMin / 60) > 0 && `${Math.floor(totalMin / 60)}h `}
                {totalMin % 60}m total
              </div>
              <button
                onClick={handleShare}
                disabled={sharing}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 16,
                  cursor: sharing ? "wait" : "pointer",
                  padding: "2px 4px",
                  opacity: sharing ? 0.4 : 0.6,
                  lineHeight: 1,
                }}
                title="Share today's summary"
              >
                📤
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
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
        </>
      )}

      {/* Day note */}
      <div style={{ marginTop: activeActivities.length === 0 ? 8 : 0 }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleNoteBlur}
          placeholder="Add a note for today..."
          rows={2}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 10,
            border: "1.5px solid var(--input-border)",
            background: "var(--input-bg)",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text-primary)",
            outline: "none",
            resize: "vertical",
            minHeight: 40,
          }}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            marginTop: 8,
            padding: "6px 12px",
            borderRadius: 8,
            background: "#27AE60",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Note saved
        </div>
      )}
    </div>
  );
}
