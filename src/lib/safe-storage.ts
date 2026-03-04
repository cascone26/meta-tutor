// Safe localStorage wrapper that shows user-visible warnings on failure

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function showStorageWarning(message: string) {
  if (typeof window === "undefined") return;

  // Debounce to avoid spamming
  if (toastTimeout) clearTimeout(toastTimeout);

  // Remove existing toast
  const existing = document.getElementById("storage-warning-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "storage-warning-toast";
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #d32f2f; color: white; padding: 12px 20px; border-radius: 12px;
    font-size: 13px; z-index: 10000; max-width: 400px; text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: system-ui, sans-serif;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.style.transition = "opacity 0.3s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    const msg = e instanceof DOMException && e.name === "QuotaExceededError"
      ? "Storage full! Your data may not be saving. Export your data from the dashboard."
      : "Failed to save data. Your progress may not persist.";
    showStorageWarning(msg);
    console.error(`localStorage.setItem failed for key "${key}":`, e);
    return false;
  }
}

export function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Get all meta-tutor localStorage data for export
export function exportAllData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("meta-tutor-")) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || "null");
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return data;
}

export function importAllData(data: Record<string, unknown>): { imported: number; errors: string[] } {
  const errors: string[] = [];
  let imported = 0;

  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith("meta-tutor-")) {
      errors.push(`Skipped non-meta-tutor key: ${key}`);
      continue;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      imported++;
    } catch (e) {
      errors.push(`Failed to import ${key}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }

  return { imported, errors };
}

export function downloadExport() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meta-tutor-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
