import { useState } from "react";
import { ACTIVITIES } from "../data/activities";
import DayCell from "./DayCell";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getSundays(year, month) {
  const sundays = new Set();
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() === 0) sundays.add(d);
  }
  return sundays;
}

function buildWeeks(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  let startOffset = (firstDay.getDay() + 6) % 7;
  const weeks = [];
  let currentDay = 1 - startOffset;

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (currentDay < 1 || currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
      }
      currentDay++;
    }
    if (week.some((d) => d !== null)) weeks.push(week);
  }
  return weeks;
}

export default function Calendar({ monthData, year, month }) {
  const [selected, setSelected] = useState(null);
  const weeks = buildWeeks(year, month);
  const sundays = getSundays(year, month);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const selectedData = selected ? monthData[selected] : null;
  const isSundaySelected = sundays.has(selected);

  return (
    <>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 12px",
          marginBottom: 14,
          maxWidth: 420,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {ACTIVITIES.map((a) => (
          <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
            <span style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 500 }}>
              {a.emoji} {a.label}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          borderRadius: 18,
          padding: "14px 12px",
          maxWidth: 420,
          width: "100%",
          border: "1px solid var(--card-border)",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: 10 }}>
          {monthNames[month - 1]} {year}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
          {DAYS_OF_WEEK.map((d) => (
            <div
              key={d}
              style={{
                width: 44,
                textAlign: "center",
                fontSize: 10,
                fontWeight: 700,
                color: d === "Sun" ? "var(--sunday-color)" : "var(--text-faint)",
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", justifyContent: "space-around", marginBottom: 4 }}>
            {week.map((day, di) => (
              <DayCell
                key={di}
                day={day}
                data={monthData[day]}
                selected={selected}
                onSelect={setSelected}
                isSunday={sundays.has(day)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Selected Day Detail */}
      {selectedData && (
        <div
          style={{
            background: "var(--card-bg-strong)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            padding: 16,
            maxWidth: 420,
            width: "100%",
            border: "1px solid var(--card-border)",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              {monthNames[month - 1]} {selected}, {year}
            </div>
            {isSundaySelected && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#9B51E0",
                  background: "rgba(155,81,224,0.1)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                Sunday
              </span>
            )}
          </div>
          {ACTIVITIES.some((a) => selectedData[a.key]) ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ACTIVITIES.filter((a) => selectedData[a.key]).map((a) => (
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
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{selectedData[a.key]} min</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              {isSundaySelected ? "Rest day" : "No exercises logged"}
            </div>
          )}
          {selectedData.notes && selectedData.notes.length > 0 && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {selectedData.notes.map((n, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    background: "var(--note-bg)",
                    borderRadius: 8,
                    padding: "5px 10px",
                  }}
                >
                  📝 {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
