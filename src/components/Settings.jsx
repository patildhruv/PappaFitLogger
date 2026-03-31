import { useRef, useState } from "react";

export default function Settings({ logs, onReplace, onMerge }) {
  const fileRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      logs,
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
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const importedLogs = parsed.logs || parsed;
        if (typeof importedLogs !== "object" || Array.isArray(importedLogs)) {
          setImportMsg("Invalid file format");
          return;
        }
        const choice = window.confirm(
          "Merge with existing data?\n\nOK = Merge\nCancel = Replace all"
        );
        if (choice) {
          onMerge(importedLogs);
          setImportMsg("Data merged successfully!");
        } else {
          onReplace(importedLogs);
          setImportMsg("Data replaced successfully!");
        }
      } catch {
        setImportMsg("Failed to read file");
      }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  }

  return (
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
        Data Management
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleExport}
          style={{
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
          }}
        >
          📤 Export Data
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
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
          }}
        >
          📥 Import Data
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
      </div>
      {importMsg && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
          {importMsg}
        </div>
      )}
    </div>
  );
}
