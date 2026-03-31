import { useState, useEffect, useCallback, useRef } from "react";

const TIMER_KEY = "pappa-fit-active-timer";
const PENDING_KEY = "pappa-fit-pending-session";
const DEFAULT_TITLE = "PappaFit Logger - Daily Fitness Tracker";

function loadTimer() {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTimer(timer) {
  if (timer) {
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
  } else {
    localStorage.removeItem(TIMER_KEY);
  }
}

function loadPendingSession() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePendingSession(session) {
  if (session) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(PENDING_KEY);
  }
}

function computeElapsed(timer) {
  if (!timer) return 0;
  const now = timer.pausedAt || Date.now();
  return Math.max(0, now - timer.startedAt - (timer.totalPausedMs || 0));
}

function formatTimeShort(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useTimer(activities) {
  const [activeTimer, setActiveTimer] = useState(loadTimer);
  const [elapsed, setElapsed] = useState(() => computeElapsed(loadTimer()));
  const [pendingSession, setPendingSession] = useState(loadPendingSession);
  const intervalRef = useRef(null);
  const activitiesRef = useRef(activities);
  activitiesRef.current = activities;

  const isPaused = !!activeTimer?.pausedAt;

  useEffect(() => {
    if (activeTimer && !activeTimer.pausedAt) {
      setElapsed(computeElapsed(activeTimer));
      intervalRef.current = setInterval(() => {
        const el = computeElapsed(activeTimer);
        setElapsed(el);
        const act = activitiesRef.current?.find((a) => a.key === activeTimer.activity);
        document.title = `${act?.emoji || ""} ${formatTimeShort(el)} - PappaFit`;
      }, 1000);
    } else if (activeTimer && activeTimer.pausedAt) {
      setElapsed(computeElapsed(activeTimer));
      const act = activitiesRef.current?.find((a) => a.key === activeTimer.activity);
      document.title = `⏸ ${act?.label || ""} Paused - PappaFit`;
    } else if (!pendingSession) {
      setElapsed(0);
      document.title = DEFAULT_TITLE;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer, pendingSession]);

  const startTimer = useCallback((activityKey) => {
    const timer = {
      activity: activityKey,
      startedAt: Date.now(),
      pausedAt: null,
      totalPausedMs: 0,
    };
    setActiveTimer(timer);
    saveTimer(timer);
  }, []);

  const pauseTimer = useCallback(() => {
    if (!activeTimer || activeTimer.pausedAt) return;
    const updated = { ...activeTimer, pausedAt: Date.now() };
    setActiveTimer(updated);
    saveTimer(updated);
  }, [activeTimer]);

  const resumeTimer = useCallback(() => {
    if (!activeTimer || !activeTimer.pausedAt) return;
    const pauseDuration = Date.now() - activeTimer.pausedAt;
    const updated = {
      ...activeTimer,
      pausedAt: null,
      totalPausedMs: (activeTimer.totalPausedMs || 0) + pauseDuration,
    };
    setActiveTimer(updated);
    saveTimer(updated);
  }, [activeTimer]);

  const stopTimer = useCallback(() => {
    if (!activeTimer) return;
    const elapsedMs = computeElapsed(activeTimer);
    const minutes = Math.max(1, Math.round(elapsedMs / 60000));
    const session = { activity: activeTimer.activity, minutes };
    setPendingSession(session);
    savePendingSession(session);
    setActiveTimer(null);
    saveTimer(null);
    document.title = DEFAULT_TITLE;
  }, [activeTimer]);

  const finalizePendingSession = useCallback(() => {
    setPendingSession(null);
    savePendingSession(null);
  }, []);

  const cancelTimer = useCallback(() => {
    setActiveTimer(null);
    saveTimer(null);
    document.title = DEFAULT_TITLE;
  }, []);

  return {
    activeTimer,
    elapsed,
    isRunning: !!activeTimer,
    isPaused,
    pendingSession,
    startTimer,
    stopTimer,
    cancelTimer,
    pauseTimer,
    resumeTimer,
    finalizePendingSession,
  };
}
