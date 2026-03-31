import { useRef, useState } from "react";
import { useActivitiesManager } from "../hooks/useActivities";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import ActivityManager from "./ActivityManager";

export default function Settings({ logs, onReplace, onMerge, onClearAll }) {
  const { activities, setAllActivities } = useActivitiesManager();
  const { canInstall, isInstalled, isIOS, install } = useInstallPrompt();
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);
  const [showActivities, setShowActivities] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  function handleExport() {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      logs,
      activities,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pappafit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileRef.current) fileRef.current.value = "";

    const reader = new FileReader();
    reader.onerror = () => {
      setImportMsg("Could not read file. Try again.");
    };
    reader.onload = (ev) => {
      let parsed;
      try {
        parsed = JSON.parse(ev.target.result);
      } catch {
        setImportMsg("Invalid JSON file. Check the file format.");
        return;
      }

      const importedLogs = parsed.logs || parsed;
      if (typeof importedLogs !== "object" || Array.isArray(importedLogs)) {
        setImportMsg("Invalid file format — expected logs object.");
        return;
      }

      // Use setTimeout to ensure confirm dialog works on mobile
      setTimeout(() => {
        const choice = window.confirm(
          "Merge with existing data?\n\nOK = Merge\nCancel = Replace all"
        );
        try {
          if (choice) {
            onMerge(importedLogs);
          } else {
            onReplace(importedLogs);
          }
          if (parsed.activities && Array.isArray(parsed.activities)) {
            setAllActivities(parsed.activities);
          }
          setImportMsg("Data imported successfully!");
        } catch (err) {
          setImportMsg("Import failed: " + (err.message || "Unknown error"));
        }
      }, 100);
    };
    reader.readAsText(file);
  }

  function handleExportAndClear() {
    handleExport();
    setTimeout(() => {
      onClearAll();
      setConfirmClear(false);
    }, 500);
  }

  function handleClearNow() {
    if (window.confirm("Are you sure? ALL activity logs will be permanently deleted.")) {
      onClearAll();
      setConfirmClear(false);
    }
  }

  const btnStyle = {
    flex: 1,
    minWidth: 120,
    padding: "10px 16px",
    borderRadius: 12,
    border: "1.5px solid var(--card-border)",
    background: "var(--card-bg-strong)",
    color: "var(--text-primary)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      {/* Install App */}
      {!isInstalled && (
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: 16,
            padding: 16,
            maxWidth: 420,
            width: "100%",
            marginBottom: 16,
            border: "1px solid var(--card-border)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Install App
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
            Install PappaFit on your phone for quick access, offline support, and a full-screen experience.
          </div>

          {canInstall ? (
            <button
              onClick={install}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                background: "#2D9CDB",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              📲 Install PappaFit App
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowInstallHelp((s) => !s)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1.5px solid var(--card-border)",
                  background: "var(--card-bg-strong)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                📲 {showInstallHelp ? "Hide" : "How to"} Install
              </button>
              {showInstallHelp && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 12,
                    background: "var(--note-bg)",
                  }}
                >
                  {isIOS ? (
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>iPhone / iPad (Safari):</div>
                      <div>1. Tap the <strong>Share</strong> button (square with arrow)</div>
                      <div>2. Scroll down and tap <strong>"Add to Home Screen"</strong></div>
                      <div>3. Tap <strong>"Add"</strong></div>
                      <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
                        Note: Must use Safari. Chrome/Firefox on iOS don't support this.
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Android (Chrome):</div>
                      <div>1. Tap the <strong>3-dot menu</strong> (top right)</div>
                      <div>2. Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></div>
                      <div>3. Tap <strong>"Install"</strong></div>
                      <div style={{ marginTop: 10, fontWeight: 700, marginBottom: 6 }}>iPhone / iPad (Safari):</div>
                      <div>1. Open in <strong>Safari</strong> (not Chrome)</div>
                      <div>2. Tap the <strong>Share</strong> button (square with arrow)</div>
                      <div>3. Tap <strong>"Add to Home Screen"</strong></div>
                      <div>4. Tap <strong>"Add"</strong></div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Settings */}
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: 16,
          padding: 16,
          maxWidth: 420,
          width: "100%",
          marginBottom: 16,
          border: "1px solid var(--card-border)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Settings
        </div>

        {/* Export / Import */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <button onClick={handleExport} style={btnStyle}>
            📤 Export
          </button>
          <button onClick={() => fileRef.current?.click()} style={btnStyle}>
            📥 Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowActivities((s) => !s)}
            style={{ ...btnStyle, minWidth: 0 }}
          >
            🎯 {showActivities ? "Hide" : "Manage"} Activities
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            style={{
              ...btnStyle,
              minWidth: 0,
              color: "#EB5757",
              border: "1.5px solid rgba(235,87,87,0.2)",
            }}
          >
            🗑️ Clear All Data
          </button>
        </div>

        {importMsg && (
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
            {importMsg}
          </div>
        )}

        {/* Clear confirmation */}
        {confirmClear && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: "rgba(235,87,87,0.08)",
              border: "1px solid rgba(235,87,87,0.2)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EB5757", marginBottom: 8 }}>
              This will permanently delete all activity logs.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={handleExportAndClear}
                style={{
                  ...btnStyle,
                  minWidth: 0,
                  background: "#F2994A",
                  color: "#fff",
                  border: "none",
                }}
              >
                📤 Backup & Clear
              </button>
              <button
                onClick={handleClearNow}
                style={{
                  ...btnStyle,
                  minWidth: 0,
                  background: "#EB5757",
                  color: "#fff",
                  border: "none",
                }}
              >
                🗑️ Clear Now
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{ ...btnStyle, minWidth: 0 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Manager */}
      {showActivities && <ActivityManager />}
    </>
  );
}
