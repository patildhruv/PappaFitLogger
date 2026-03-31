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

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useLogs() {
  const [logs, setLogs] = useState(loadLogs);

  const addLog = useCallback((activityKey, minutes, noteText) => {
    const key = todayKey();
    setLogs((prev) => {
      const dayLog = prev[key] || {};
      const notes = dayLog.notes || [];
      const updatedDay = {
        ...dayLog,
        [activityKey]: (dayLog[activityKey] || 0) + minutes,
      };
      if (noteText) {
        updatedDay.notes = [...notes, { activity: activityKey, text: noteText, minutes }];
      } else if (notes.length > 0) {
        updatedDay.notes = notes;
      }
      const updated = { ...prev, [key]: updatedDay };
      saveLogs(updated);
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
    saveLogs(newLogs);
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
            if (k === "notes") {
              const existingNotes = mergedDay.notes || [];
              mergedDay.notes = [...existingNotes, ...(v || [])];
            } else if (typeof v === "number") {
              mergedDay[k] = Math.max(mergedDay[k] || 0, v);
            }
          });
          merged[dateKey] = mergedDay;
        }
      });
      saveLogs(merged);
      return merged;
    });
  }, []);

  const clearAllLogs = useCallback(() => {
    setLogs({});
    saveLogs({});
  }, []);

  return { logs, addLog, getToday, getMonth, getSortedDays, replaceAllLogs, mergeLogs, clearAllLogs, todayKey };
}
