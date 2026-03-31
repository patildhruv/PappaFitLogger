import { useState } from "react";
import confetti from "canvas-confetti";
import { useActivities } from "../hooks/useActivities";

const PRESETS = [15, 30, 45, 60];

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

  function setDirect(key, val) {
    const num = Math.max(0, Math.min(999, parseInt(val) || 0));
    setValues((prev) => ({ ...prev, [key]: num }));
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
              padding: "12px 14px",
              border: "1px solid var(--card-border)",
            }}
          >
            {/* Top row: activity info + +/- controls + log */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 85 }}>
                <span style={{ fontSize: 22 }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{a.label}</div>
                  {logged > 0 && (
                    <div style={{ fontSize: 10, color: a.color, fontWeight: 600 }}>{logged}m today</div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <button
                  onClick={() => adjust(a.key, -5)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid var(--card-border)",
                    background: "var(--card-bg-strong)",
                    color: "var(--text-primary)",
                    fontSize: 20,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={pending || ""}
                  onChange={(e) => setDirect(a.key, e.target.value)}
                  placeholder="0"
                  style={{
                    width: 50,
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: pending > 0 ? a.color : "var(--text-faint)",
                    fontFamily: "'DM Sans', sans-serif",
                    border: "1px solid var(--input-border)",
                    borderRadius: 8,
                    background: "var(--input-bg)",
                    padding: "6px 4px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => adjust(a.key, 5)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: "1px solid var(--card-border)",
                    background: "var(--card-bg-strong)",
                    color: "var(--text-primary)",
                    fontSize: 20,
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

              <button
                onClick={() => handleLog(a.key)}
                disabled={!pending}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: pending > 0 ? a.color : "var(--button-disabled-bg)",
                  color: pending > 0 ? "#fff" : "var(--text-faint)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: pending > 0 ? "pointer" : "default",
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: pending > 0 ? 1 : 0.5,
                  minWidth: 44,
                }}
              >
                Log
              </button>
            </div>

            {/* Presets row */}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setValues((prev) => ({ ...prev, [a.key]: p }))}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 8,
                    border: pending === p ? `1.5px solid ${a.color}` : "1px solid var(--card-border)",
                    background: pending === p ? `${a.color}15` : "var(--card-bg-strong)",
                    color: pending === p ? a.color : "var(--text-muted)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {p}m
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
