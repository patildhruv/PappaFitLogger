import { useState, useCallback } from "react";

const STORAGE_KEY = "pappa-fit-logs";

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded — silently fail, data is still in React state
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useLogs() {
  const [logs, setLogs] = useState(loadLogs);

  const addLog = useCallback((activityKey, minutes) => {
    const key = todayKey();
    setLogs((prev) => {
      const dayLog = prev[key] || {};
      const updated = {
        ...prev,
        [key]: {
          ...dayLog,
          [activityKey]: (dayLog[activityKey] || 0) + minutes,
        },
      };
      safeSave(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const editLog = useCallback((dateKey, activityKey, newMinutes) => {
    setLogs((prev) => {
      const dayLog = prev[dateKey];
      if (!dayLog) return prev;
      const updatedDay = { ...dayLog };
      if (newMinutes <= 0) {
        delete updatedDay[activityKey];
      } else {
        updatedDay[activityKey] = newMinutes;
      }
      const updated = { ...prev, [dateKey]: updatedDay };
      safeSave(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const setDayNote = useCallback((dateKey, text) => {
    setLogs((prev) => {
      const dayLog = prev[dateKey] || {};
      const updatedDay = { ...dayLog };
      if (text) {
        updatedDay.note = text;
      } else {
        delete updatedDay.note;
      }
      const updated = { ...prev, [dateKey]: updatedDay };
      safeSave(STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const getToday = useCallback(() => {
    return logs[todayKey()] || {};
  }, [logs]);

  const getMonth = useCallback(
    (year, month) => {
      const result = {};
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (logs[key]) {
          result[d] = logs[key];
        }
      }
      return result;
    },
    [logs]
  );

  const getSortedDays = useCallback(() => {
    return Object.entries(logs)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({ date, ...data }));
  }, [logs]);

  const replaceAllLogs = useCallback((newLogs) => {
    setLogs(newLogs);
    safeSave(STORAGE_KEY, newLogs);
  }, []);

  const mergeLogs = useCallback((importedLogs) => {
    setLogs((prev) => {
      const merged = { ...prev };
      Object.entries(importedLogs).forEach(([dateKey, dayData]) => {
        if (!merged[dateKey]) {
          merged[dateKey] = dayData;
        } else {
          const existing = merged[dateKey];
          const mergedDay = { ...existing };
          Object.entries(dayData).forEach(([k, v]) => {
            if (k === "note") {
              if (v && !mergedDay.note) mergedDay.note = v;
            } else if (k === "notes") {
              // backward compat: ignore old per-activity notes array
            } else if (typeof v === "number") {
              mergedDay[k] = (mergedDay[k] || 0) + v;
            }
          });
          merged[dateKey] = mergedDay;
        }
      });
      safeSave(STORAGE_KEY, merged);
      return merged;
    });
  }, []);

  const clearAllLogs = useCallback(() => {
    setLogs({});
    safeSave(STORAGE_KEY, {});
  }, []);

  return { logs, addLog, editLog, setDayNote, getToday, getMonth, getSortedDays, replaceAllLogs, mergeLogs, clearAllLogs, todayKey };
}
