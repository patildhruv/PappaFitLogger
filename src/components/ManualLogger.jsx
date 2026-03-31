import { useState } from "react";
import confetti from "canvas-confetti";
import { useActivities } from "../hooks/useActivities";

export default function ManualLogger({ todayData, onLog }) {
  const activities = useActivities();
  const [values, setValues] = useState({});

  function adjust(key, delta) {
    setValues((prev) => {
      const current = prev[key] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  }

  function handleLog(key) {
    const mins = values[key];
    if (!mins || mins <= 0) return;
    onLog(key, mins);
    setValues((prev) => ({ ...prev, [key]: 0 }));
    confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
  }

  return (
    <div
      style={{
        maxWidth: 420,
        width: "100%",
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {activities.map((a) => {
        const pending = values[a.key] || 0;
        const logged = todayData[a.key] || 0;
        return (
          <div
            key={a.key}
            style={{
              background: "var(--card-bg)",
              borderRadius: 14,
              padding: "10px 14px",
              border: "1px solid var(--card-border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Activity info */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 90 }}>
              <span style={{ fontSize: 20 }}>{a.emoji}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{a.label}</div>
                {logged > 0 && (
                  <div style={{ fontSize: 10, color: a.color, fontWeight: 600 }}>{logged}m today</div>
                )}
              </div>
            </div>

            {/* +/- controls */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <button
                onClick={() => adjust(a.key, -5)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--card-border)",
                  background: "var(--card-bg-strong)",
                  color: "var(--text-primary)",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                -
              </button>
              <div
                style={{
                  minWidth: 44,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: pending > 0 ? a.color : "var(--text-faint)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {pending}m
              </div>
              <button
                onClick={() => adjust(a.key, 5)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--card-border)",
                  background: "var(--card-bg-strong)",
                  color: "var(--text-primary)",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>

            {/* Log button */}
            <button
              onClick={() => handleLog(a.key)}
              disabled={!pending}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: pending > 0 ? a.color : "var(--button-disabled-bg)",
                color: pending > 0 ? "#fff" : "var(--text-faint)",
                fontSize: 11,
                fontWeight: 700,
                cursor: pending > 0 ? "pointer" : "default",
                fontFamily: "'DM Sans', sans-serif",
                opacity: pending > 0 ? 1 : 0.5,
              }}
            >
              Log
            </button>
          </div>
        );
      })}
    </div>
  );
}
