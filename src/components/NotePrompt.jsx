import { useState } from "react";
import { ACTIVITIES } from "../data/activities";

export default function NotePrompt({ session, onSave, onSkip }) {
  const [note, setNote] = useState("");
  const activity = ACTIVITIES.find((a) => a.key === session.activity);
  if (!activity) return null;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${activity.color}18, ${activity.color}08)`,
        border: `2px solid ${activity.color}40`,
        borderRadius: 20,
        padding: "20px 16px",
        maxWidth: 420,
        width: "100%",
        marginBottom: 16,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: activity.color, textTransform: "uppercase", marginBottom: 6 }}>
        Session Complete
      </div>
      <div style={{ fontSize: 36, marginBottom: 4 }}>{activity.emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
        {activity.label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: activity.color, marginBottom: 14 }}>
        {session.minutes} min
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)..."
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 12,
          border: "1.5px solid var(--input-border)",
          background: "var(--input-bg)",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          color: "var(--text-primary)",
          outline: "none",
          marginBottom: 12,
        }}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(note.trim());
        }}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={() => onSave(note.trim())}
          style={{
            background: activity.color,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 28px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Save
        </button>
        <button
          onClick={onSkip}
          style={{
            background: "var(--button-muted-bg)",
            color: "var(--button-muted-color)",
            border: "none",
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
