import { useState, useEffect, useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import { captureAndShare } from "../utils/shareCard";
import ShareableCard from "./ShareableCard";

export default function TodayLog({ todayData, dayNote, onNoteChange, onEditLog, dateStr, activeDays, daysInMonth, todayDateKey }) {
  const activities = useActivities();
  const activeActivities = activities.filter((a) => todayData[a.key]);
  const totalMin = activeActivities.reduce((sum, a) => sum + todayData[a.key], 0);
  const [note, setNote] = useState(dayNote);
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(null); // activity key being edited
  const [editValue, setEditValue] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    setNote(dayNote);
  }, [dayNote]);

  function handleNoteBlur() {
    const trimmed = note.trim();
    if (trimmed !== dayNote) {
      onNoteChange(trimmed);
      showToast("Note saved");
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  }

  function startEdit(a) {
    setEditing(a.key);
    setEditValue(String(todayData[a.key]));
  }

  function saveEdit(activityKey) {
    const newMin = parseInt(editValue) || 0;
    if (onEditLog) {
      onEditLog(todayDateKey, activityKey, newMin);
    }
    setEditing(null);
    showToast(newMin <= 0 ? "Activity removed" : "Updated");
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
                  fontSize: 18,
                  cursor: sharing ? "wait" : "pointer",
                  padding: "4px 6px",
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
                onClick={() => !editing && startEdit(a)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: `${a.color}15`,
                  border: editing === a.key ? `2px solid ${a.color}` : `1.5px solid ${a.color}30`,
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14 }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: a.color }}>{a.label}</div>
                  {editing === a.key ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(a.key);
                          if (e.key === "Escape") setEditing(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: 45,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          border: "1px solid var(--input-border)",
                          borderRadius: 4,
                          background: "var(--input-bg)",
                          padding: "2px 4px",
                          outline: "none",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); saveEdit(a.key); }}
                        style={{
                          background: a.color,
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "2px 6px",
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditing(null); }}
                        style={{
                          background: "none",
                          color: "var(--text-faint)",
                          border: "none",
                          padding: "2px 4px",
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{todayData[a.key]} min</div>
                  )}
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
          {toast}
        </div>
      )}
    </div>
  );
}
