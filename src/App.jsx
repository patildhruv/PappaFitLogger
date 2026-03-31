import { useState, useEffect, useCallback } from "react";
import { useTimer } from "./hooks/useTimer";
import { useLogs } from "./hooks/useLogs";
import { ACTIVITIES } from "./data/activities";
import Timer from "./components/Timer";
import ActivityButtons from "./components/ActivityButtons";
import TodayLog from "./components/TodayLog";
import Calendar from "./components/Calendar";
import Summary from "./components/Summary";

function SplashScreen({ fading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(145deg, #fef9f0 0%, #f0ebe3 40%, #e8e0d4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: fading ? "splashFadeOut 0.5s ease forwards" : "none",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 12 }}>💪</div>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 800,
          color: "#1a1a2e",
          margin: "0 0 6px 0",
          textAlign: "center",
        }}
      >
        PappaFit Logger
      </h1>
      <div style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>
        Daily Fitness Tracker
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const { logs, addLog, getToday, getMonth } = useLogs();

  const handleTimerComplete = useCallback(
    (activityKey, minutes) => {
      addLog(activityKey, minutes);
    },
    [addLog]
  );

  const {
    activeTimer, elapsed, isRunning, isPaused,
    startTimer, stopTimer, cancelTimer, pauseTimer, resumeTimer,
  } = useTimer(handleTimerComplete);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthData = getMonth(year, month);
  const todayData = getToday();

  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalMin = Object.values(todayData).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
  const activeDaysThisMonth = Object.keys(monthData).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #fef9f0 0%, #f0ebe3 40%, #e8e0d4 100%)",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {showSplash && <SplashScreen fading={splashFading} />}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, maxWidth: 420, width: "100%" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            color: "#999",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Daily Fitness Log
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 800,
            color: "#1a1a2e",
            margin: "0 0 4px 0",
            lineHeight: 1.1,
          }}
        >
          Swapnil's Tracker
        </h1>
        <div style={{ fontSize: 13, color: "#777", fontWeight: 500 }}>
          {dateStr}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, maxWidth: 420, width: "100%" }}>
        {[
          { value: activeDaysThisMonth, label: "Active Days", sub: `/${daysInMonth}` },
          {
            value:
              totalMin >= 60
                ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`
                : `${totalMin}m`,
            label: "Today",
          },
          {
            value: ACTIVITIES.filter((a) => todayData[a.key]).length,
            label: "Activities",
            sub: `/${ACTIVITIES.length}`,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: 14,
              padding: "12px 8px",
              textAlign: "center",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", lineHeight: 1 }}>
              {s.value}
              {s.sub && (
                <span style={{ fontSize: 12, color: "#999", fontWeight: 500 }}>{s.sub}</span>
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#888",
                fontWeight: 600,
                marginTop: 4,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Timer */}
      <Timer
        activeTimer={activeTimer}
        elapsed={elapsed}
        isPaused={isPaused}
        onStop={stopTimer}
        onCancel={cancelTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
      />

      {/* Activity Buttons */}
      <ActivityButtons
        onStart={startTimer}
        isRunning={isRunning}
        activeActivity={activeTimer?.activity}
      />

      {/* Today's Log */}
      <TodayLog todayData={todayData} />

      {/* Calendar */}
      <Calendar monthData={monthData} year={year} month={month} />

      {/* Monthly Summary */}
      <Summary monthData={monthData} daysInMonth={daysInMonth} />

      <div style={{ marginTop: 16, fontSize: 10, color: "#bbb", textAlign: "center" }}>
        Consistency is the real strength
      </div>
    </div>
  );
}
