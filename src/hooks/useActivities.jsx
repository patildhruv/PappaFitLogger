import { createContext, useContext, useState, useCallback } from "react";
import { DEFAULT_ACTIVITIES } from "../data/activities";

const STORAGE_KEY = "pappa-fit-activities";

const ActivitiesContext = createContext(DEFAULT_ACTIVITIES);

function loadActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_ACTIVITIES;
}

function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {}
}

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState(loadActivities);

  const addActivity = useCallback((label, emoji, color) => {
    const key = label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setActivities((prev) => {
      if (prev.some((a) => a.key === key)) return prev;
      const updated = [...prev, { key, label, emoji, color }];
      saveActivities(updated);
      return updated;
    });
  }, []);

  const removeActivity = useCallback((key) => {
    setActivities((prev) => {
      const updated = prev.filter((a) => a.key !== key);
      saveActivities(updated);
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setActivities(DEFAULT_ACTIVITIES);
    saveActivities(DEFAULT_ACTIVITIES);
  }, []);

  const setAllActivities = useCallback((newActivities) => {
    if (Array.isArray(newActivities) && newActivities.length > 0) {
      setActivities(newActivities);
      saveActivities(newActivities);
    }
  }, []);

  return (
    <ActivitiesContext.Provider value={{ activities, addActivity, removeActivity, resetToDefaults, setAllActivities }}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext);
  return ctx.activities || ctx;
}

export function useActivitiesManager() {
  return useContext(ActivitiesContext);
}
