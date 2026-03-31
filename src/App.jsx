import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { useTimer } from "./hooks/useTimer";
import { useLogs } from "./hooks/useLogs";
import { useActivities } from "./hooks/useActivities";
import Timer from "./components/Timer";
import ActivityButtons from "./components/ActivityButtons";
import TodayLog from "./components/TodayLog";
import TabBar from "./components/TabBar";
import History from "./components/History";
import WeeklyBarChart from "./components/WeeklyBarChart";
import ActivityDonut from "./components/ActivityDonut";
import Calendar from "./components/Calendar";
import Summary from "./components/Summary";
import DailySummary from "./components/DailySummary";
import Settings from "./components/Settings";

function SplashScreen({ fading }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "linear-gradient(145deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 40%, var(--bg-gradient-3) 100%)",
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
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 1500);
    const hideTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const activities = useActivities();
  const { logs, addLog, setDayNote, getToday, getMonth, getSortedDays, replaceAllLogs, mergeLogs, clearAllLogs, todayKey } = useLogs();

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
      {showSplash && <SplashScreen fading={splashFading} />}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, maxWidth: 420, width: "100%", position: "relative" }}>
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
            padding: 4,
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
            value: activities.filter((a) => todayData[a.key]).length,
            label: "Activities",
            sub: `/${activities.length}`,
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
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
              {s.value}
              {s.sub && (
                <span style={{ fontSize: 12, color: "var(--text-hint)", fontWeight: 500 }}>{s.sub}</span>
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

          <TodayLog
            todayData={todayData}
            dayNote={todayData.note || ""}
            onNoteChange={(text) => setDayNote(todayDateKey, text)}
          />

          <WeeklyBarChart logs={logs} />
          <ActivityDonut monthData={monthData} />

          <Calendar monthData={monthData} year={year} month={month} />

          <Summary monthData={monthData} daysInMonth={daysInMonth} />
        </>
      ) : activeTab === "summary" ? (
        <DailySummary
          todayData={todayData}
          dateStr={dateStr}
          activeDays={activeDaysThisMonth}
          daysInMonth={daysInMonth}
        />
      ) : (
        <History sortedDays={getSortedDays()} />
      )}

      <div style={{ marginTop: 16, fontSize: 10, color: "var(--text-faint)", textAlign: "center" }}>
        Consistency is the real strength
      </div>
    </div>
  );
}
