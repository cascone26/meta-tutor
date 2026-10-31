"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ReaderSettingsData {
  fontSize: number;
  theme: "dark" | "sepia" | "light";
  lineWidth: number;
}

const STORAGE_KEY = "veritas-reader-settings";

const DEFAULTS: ReaderSettingsData = {
  fontSize: 16,
  theme: "dark",
  lineWidth: 680,
};

const FONT_SIZES = [14, 16, 18, 20, 22];
const THEMES: { key: ReaderSettingsData["theme"]; label: string; bg: string; border: string }[] = [
  { key: "dark", label: "Dark", bg: "bg-stone-950", border: "border-stone-600" },
  { key: "sepia", label: "Sepia", bg: "bg-amber-900", border: "border-amber-700" },
  { key: "light", label: "Light", bg: "bg-stone-200", border: "border-stone-400" },
];
const LINE_WIDTHS = [
  { value: 560, label: "Narrow" },
  { value: 680, label: "Medium" },
  { value: 800, label: "Wide" },
];

export function useReaderSettings() {
  const [settings, setSettings] = useState<ReaderSettingsData>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback((partial: Partial<ReaderSettingsData>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, update };
}

export function themeClasses(theme: ReaderSettingsData["theme"]) {
  switch (theme) {
    case "sepia":
      return { bg: "bg-amber-50", text: "text-amber-950", mutedText: "text-amber-900/70" };
    case "light":
      return { bg: "bg-white", text: "text-stone-900", mutedText: "text-stone-500" };
    default:
      return { bg: "", text: "", mutedText: "" };
  }
}

export default function ReaderSettings({
  settings,
  onUpdate,
}: {
  settings: ReaderSettingsData;
  onUpdate: (partial: Partial<ReaderSettingsData>) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-12 right-0 w-64 rounded-lg border border-stone-700 bg-stone-900 p-4 shadow-xl">
          {/* Font size */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">
              Font Size
            </p>
            <div className="flex gap-1">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdate({ fontSize: size })}
                  className={`flex-1 rounded py-1.5 text-center transition-colors ${
                    settings.fontSize === size
                      ? "bg-amber-600/30 text-amber-400"
                      : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                  }`}
                  style={{ fontSize: `${Math.max(10, size - 4)}px` }}
                >
                  Aa
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">
              Theme
            </p>
            <div className="flex items-center gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => onUpdate({ theme: t.key })}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`h-7 w-7 rounded-full border-2 ${t.bg} ${
                      settings.theme === t.key
                        ? "border-amber-500 ring-2 ring-amber-500/30"
                        : t.border
                    }`}
                  />
                  <span className="text-[10px] text-stone-500">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line width */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">
              Line Width
            </p>
            <div className="flex gap-1">
              {LINE_WIDTHS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => onUpdate({ lineWidth: w.value })}
                  className={`flex-1 rounded py-1.5 text-xs text-center transition-colors ${
                    settings.lineWidth === w.value
                      ? "bg-amber-600/30 text-amber-400"
                      : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-stone-400 shadow-lg transition-colors hover:bg-stone-800 hover:text-stone-200"
        aria-label="Reader settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </div>
  );
}
