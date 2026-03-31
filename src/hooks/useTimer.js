import { useState, useEffect, useCallback, useRef } from "react";

const TIMER_KEY = "pappa-fit-active-timer";
const DEFAULT_TITLE = "PappaFit Logger - Daily Fitness Tracker";
const MAX_MINUTES = 480; // 8 hours

function loadTimer() {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTimer(timer) {
  try {
    if (timer) {
      localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
    } else {
      localStorage.removeItem(TIMER_KEY);
    }
  } catch {}
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

export function useTimer(activities, onComplete) {
  const [activeTimer, setActiveTimer] = useState(loadTimer);
  const [elapsed, setElapsed] = useState(() => computeElapsed(loadTimer()));
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
    } else {
      setElapsed(0);
      document.title = DEFAULT_TITLE;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTimer]);

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
    let minutes = Math.max(1, Math.round(elapsedMs / 60000));
    if (minutes > MAX_MINUTES) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (!window.confirm(`Timer ran for ${h}h ${m}m. Log this amount?`)) {
        setActiveTimer(null);
        saveTimer(null);
        document.title = DEFAULT_TITLE;
        return;
      }
    }
    if (onComplete) {
      onComplete(activeTimer.activity, minutes);
    }
    setActiveTimer(null);
    saveTimer(null);
    document.title = DEFAULT_TITLE;
  }, [activeTimer, onComplete]);

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
    startTimer,
    stopTimer,
    cancelTimer,
    pauseTimer,
    resumeTimer,
  };
}
