import { useState, useEffect, useCallback, useRef } from "react";
import { ACTIVITIES } from "../data/activities";

const STORAGE_KEY = "pappa-fit-active-timer";
const DEFAULT_TITLE = "PappaFit Logger - Daily Fitness Tracker";

function loadTimer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTimer(timer) {
  if (timer) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  } else {
    localStorage.removeItem(STORAGE_KEY);
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

export function useTimer(onComplete) {
  const [activeTimer, setActiveTimer] = useState(loadTimer);
  const [elapsed, setElapsed] = useState(() => computeElapsed(loadTimer()));
  const intervalRef = useRef(null);

  const isPaused = !!activeTimer?.pausedAt;

  useEffect(() => {
    if (activeTimer && !activeTimer.pausedAt) {
      setElapsed(computeElapsed(activeTimer));
      intervalRef.current = setInterval(() => {
        const el = computeElapsed(activeTimer);
        setElapsed(el);
        const act = ACTIVITIES.find((a) => a.key === activeTimer.activity);
        document.title = `${act?.emoji || ""} ${formatTimeShort(el)} - PappaFit`;
      }, 1000);
    } else if (activeTimer && activeTimer.pausedAt) {
      setElapsed(computeElapsed(activeTimer));
      const act = ACTIVITIES.find((a) => a.key === activeTimer.activity);
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
    const minutes = Math.round(elapsedMs / 60000);
    if (onComplete) {
      onComplete(activeTimer.activity, Math.max(1, minutes));
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
