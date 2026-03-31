import { useState } from "react";
import { useActivitiesManager } from "../hooks/useActivities";

export default function ActivityManager() {
  const { activities, addActivity, removeActivity, resetToDefaults } = useActivitiesManager();
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#2D9CDB");

  function handleAdd() {
    const trimLabel = label.trim();
    const trimEmoji = emoji.trim();
    if (!trimLabel) return;
    addActivity(trimLabel, trimEmoji || "🏋️", color);
    setLabel("");
    setEmoji("");
    setColor("#2D9CDB");
  }

  function handleRemove(act) {
    if (window.confirm(`Remove "${act.label}"? Logged data will be kept in history.`)) {
      removeActivity(act.key);
    }
  }

  function handleReset() {
    if (window.confirm("Reset to default activities? (Walking, Pranayam, Yoga, Workout, Shavasan)")) {
      resetToDefaults();
    }
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
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
        Manage Activities
      </div>

      {/* Current activities */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {activities.map((a) => (
          <div
            key={a.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 10,
              background: `${a.color}12`,
              border: `1px solid ${a.color}25`,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
            <span style={{ fontSize: 16 }}>{a.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{a.label}</span>
            <button
              onClick={() => handleRemove(a)}
              style={{
                background: "none",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                color: "var(--text-faint)",
                padding: "2px 6px",
                borderRadius: 6,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add new activity */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Add New Activity
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="😀"
          style={{
            width: 42,
            padding: "8px 4px",
            borderRadius: 10,
            border: "1.5px solid var(--input-border)",
            background: "var(--input-bg)",
            fontSize: 16,
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Activity name"
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 10,
            border: "1.5px solid var(--input-border)",
            background: "var(--input-bg)",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "var(--text-primary)",
            outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1.5px solid var(--input-border)",
            cursor: "pointer",
            padding: 2,
            background: "var(--input-bg)",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "none",
            background: "#2D9CDB",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Add
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 10,
          border: "1px solid var(--card-border)",
          background: "transparent",
          color: "var(--text-muted)",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Reset to Defaults
      </button>
    </div>
  );
}
