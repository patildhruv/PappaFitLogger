import { useState, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { useTimer } from "./hooks/useTimer";
import { useLogs } from "./hooks/useLogs";
import { useActivities } from "./hooks/useActivities";
import Timer from "./components/Timer";
import ActivityButtons from "./components/ActivityButtons";
import TodayLog from "./components/TodayLog";
import TabBar from "./components/TabBar";
import MonthlyView from "./components/MonthlyView";
import History from "./components/History";
import WeeklyBarChart from "./components/WeeklyBarChart";
import ManualLogger from "./components/ManualLogger";
import Settings from "./components/Settings";

function SplashScreen({ fading, onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(145deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 40%, var(--bg-gradient-3) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        animation: fading ? "splashFadeOut 0.5s ease forwards" : "none",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 12 }}>💪</div>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 30,
          fontWeight: 800,
          color: "var(--text-primary)",
          margin: "0 0 6px 0",
          textAlign: "center",
        }}
      >
        PappaFit Logger
      </h1>
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
        Daily Fitness Tracker
      </div>
      <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 16 }}>
        Tap to continue
      </div>
    </div>
  );
}

function calcStreak(logs, activities) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayData = logs[key];
    if (dayData && activities.some((a) => dayData[a.key])) {
      streak++;
    } else if (i === 0) {
      // today might not have activity yet, skip
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [showSettings, setShowSettings] = useState(false);
  const [inputMode, setInputMode] = useState(() => localStorage.getItem("pappa-fit-input-mode") || "timer");

  function toggleInputMode() {
    setInputMode((m) => {
      const next = m === "timer" ? "manual" : "timer";
      try { localStorage.setItem("pappa-fit-input-mode", next); } catch {}
      return next;
    });
  }

  function dismissSplash() {
    setSplashFading(true);
    setTimeout(() => setShowSplash(false), 500);
  }

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const activities = useActivities();
  const { logs, addLog, editLog, setDayNote, getToday, getMonth, getSortedDays, replaceAllLogs, mergeLogs, clearAllLogs, todayKey } = useLogs();

  const handleTimerComplete = useCallback(
    (activityKey, minutes) => {
      addLog(activityKey, minutes);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    },
    [addLog]
  );

  const {
    activeTimer, elapsed, isRunning, isPaused,
    startTimer, stopTimer, cancelTimer, pauseTimer, resumeTimer,
  } = useTimer(activities, handleTimerComplete);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthData = getMonth(year, month);
  const todayData = getToday();
  const todayDateKey = todayKey();

  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalMin = Object.values(todayData).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
  const activeDaysThisMonth = Object.keys(monthData).length;
  const streak = useMemo(() => calcStreak(logs, activities), [logs, activities]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 40%, var(--bg-gradient-3) 100%)",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {showSplash && <SplashScreen fading={splashFading} onDismiss={dismissSplash} />}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, maxWidth: 420, width: "100%", position: "relative" }}>
        {/* Mode toggle - left */}
        <button
          onClick={toggleInputMode}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 10px",
            color: "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          aria-label={inputMode === "timer" ? "Switch to manual mode" : "Switch to timer mode"}
        >
          {inputMode === "timer" ? "⏱️" : "✏️"}
          <span style={{ fontSize: 10 }}>{inputMode === "timer" ? "Timer" : "Manual"}</span>
        </button>
        {/* Settings - right */}
        <button
          onClick={() => setShowSettings((s) => !s)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            padding: 8,
            opacity: 0.5,
          }}
          aria-label="Settings"
        >
          ⚙️
        </button>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 3,
            color: "var(--text-hint)",
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
            color: "var(--text-primary)",
            margin: "0 0 4px 0",
            lineHeight: 1.1,
          }}
        >
          Pappa's Tracker
        </h1>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
          {dateStr}
        </div>
      </div>

      {showSettings && (
        <Settings logs={logs} onReplace={replaceAllLogs} onMerge={mergeLogs} onClearAll={clearAllLogs} />
      )}

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
            value: streak,
            label: "Streak",
            isStreak: true,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: "var(--card-bg-strong)",
              backdropFilter: "blur(10px)",
              borderRadius: 14,
              padding: "12px 8px",
              textAlign: "center",
              border: "1px solid var(--card-border-strong)",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
              {s.value}
              {s.sub && (
                <span style={{ fontSize: 12, color: "var(--text-hint)", fontWeight: 500 }}>{s.sub}</span>
              )}
              {s.isStreak && streak > 0 && (
                <span
                  style={{
                    fontSize: 20,
                    display: "inline-block",
                    animation: "flicker 0.8s ease-in-out infinite",
                    transformOrigin: "bottom center",
                  }}
                >
                  🔥
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
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

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "today" ? (
        <>
          {inputMode === "timer" ? (
            <>
              <Timer
                activeTimer={activeTimer}
                elapsed={elapsed}
                isPaused={isPaused}
                onStop={stopTimer}
                onCancel={cancelTimer}
                onPause={pauseTimer}
                onResume={resumeTimer}
              />
              <ActivityButtons
                onStart={startTimer}
                isRunning={isRunning}
                activeActivity={activeTimer?.activity}
              />
            </>
          ) : (
            <ManualLogger todayData={todayData} onLog={addLog} />
          )}

          <TodayLog
            todayData={todayData}
            dayNote={todayData.note || ""}
            onNoteChange={(text) => setDayNote(todayDateKey, text)}
            onEditLog={editLog}
            todayDateKey={todayDateKey}
            dateStr={dateStr}
            activeDays={activeDaysThisMonth}
            daysInMonth={daysInMonth}
          />

          <WeeklyBarChart logs={logs} />
        </>
      ) : activeTab === "monthly" ? (
        <MonthlyView />
      ) : (
        <History sortedDays={getSortedDays()} />
      )}

      <div style={{ marginTop: 16, fontSize: 10, color: "var(--text-faint)", textAlign: "center" }}>
        Consistency is the real strength
      </div>
    </div>
  );
}
