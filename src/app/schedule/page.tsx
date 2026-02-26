"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSchedule, addScheduleItem, removeScheduleItem,
  typeLabels, typeColors, dayNames, formatTime12, getTodayItems, getUpcomingItem,
  type ScheduleItem,
} from "@/lib/schedule";

type ItemType = "nap" | "eat" | "study" | "class" | "quiz" | "custom";

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [todayItems, setTodayItems] = useState<ScheduleItem[]>([]);
  const [upcoming, setUpcoming] = useState<ScheduleItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<"today" | "all">("today");

  // Form
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("12:00");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]); // Weekdays default
  const [type, setType] = useState<ItemType>("study");
  const [notify, setNotify] = useState(true);

  const reload = useCallback(() => {
    setItems(getSchedule());
    setTodayItems(getTodayItems());
    setUpcoming(getUpcomingItem());
  }, []);

  useEffect(() => {
    reload();
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [reload]);

  // Check for upcoming reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      const today = now.getDay();
      const schedule = getSchedule();

      for (const item of schedule) {
        if (item.notify && item.days.includes(today) && item.time === currentTime) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`Meta Tutor — ${typeLabels[item.type]}`, {
              body: item.title || typeLabels[item.type],
              icon: "/favicon.ico",
            });
          }
        }
      }
      setUpcoming(getUpcomingItem());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function handleAdd() {
    addScheduleItem({
      title: title || typeLabels[type],
      time,
      days,
      color: typeColors[type],
      notify,
      type,
    });
    setTitle("");
    setTime("12:00");
    setDays([1, 2, 3, 4, 5]);
    setType("study");
    setNotify(true);
    setAdding(false);
    reload();
  }

  function handleRemove(id: string) {
    removeScheduleItem(id);
    reload();
  }

  function toggleDay(day: number) {
    setDays((d) => d.includes(day) ? d.filter((x) => x !== day) : [...d, day].sort());
  }

  const groupedByDay = (() => {
    const groups: Record<number, ScheduleItem[]> = {};
    for (const item of items) {
      for (const day of item.days) {
        if (!groups[day]) groups[day] = [];
        groups[day].push(item);
      }
    }
    // Sort each day's items by time
    for (const day in groups) {
      groups[day].sort((a, b) => a.time.localeCompare(b.time));
    }
    return groups;
  })();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Schedule</h1>
          <button
            onClick={() => setAdding(!adding)}
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {adding ? "Cancel" : "+ Add"}
          </button>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          Set times for naps, meals, study, class, and more. Get browser notifications.
        </p>

        {/* Upcoming */}
        {upcoming && (
          <div className="rounded-xl p-4 mb-4" style={{ background: upcoming.color + "15", border: `1px solid ${upcoming.color}30` }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: upcoming.color }}>Coming up</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{upcoming.title}</p>
              <p className="text-sm font-mono" style={{ color: upcoming.color }}>{formatTime12(upcoming.time)}</p>
            </div>
          </div>
        )}

        {/* Add form */}
        {adding && (
          <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>New item</h3>

            {/* Type */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {(Object.keys(typeLabels) as ItemType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: type === t ? typeColors[t] + "20" : "var(--background)",
                    color: type === t ? typeColors[t] : "var(--muted)",
                    border: `1px solid ${type === t ? typeColors[t] + "40" : "var(--border)"}`,
                  }}
                >{typeLabels[t]}</button>
              ))}
            </div>

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={typeLabels[type]}
              className="w-full rounded-lg px-3 py-2 text-sm mb-3"
              style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />

            {/* Time */}
            <div className="flex items-center gap-3 mb-3">
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-sm"
                style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>

            {/* Days */}
            <div className="flex items-center gap-1.5 mb-3">
              <label className="text-xs font-medium mr-1" style={{ color: "var(--muted)" }}>Days:</label>
              {dayNames.map((name, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className="w-8 h-8 rounded-full text-xs font-medium"
                  style={{
                    background: days.includes(i) ? typeColors[type] : "var(--background)",
                    color: days.includes(i) ? "#fff" : "var(--muted)",
                    border: `1px solid ${days.includes(i) ? typeColors[type] : "var(--border)"}`,
                  }}
                >{name.charAt(0)}</button>
              ))}
            </div>

            {/* Notify */}
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="rounded"
              />
              <span className="text-xs" style={{ color: "var(--foreground)" }}>Browser notification at this time</span>
            </label>

            <button
              onClick={handleAdd}
              disabled={days.length === 0}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: days.length > 0 ? "var(--accent)" : "var(--border)", color: days.length > 0 ? "#fff" : "var(--muted)" }}
            >Add to schedule</button>
          </div>
        )}

        {/* View toggle */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => setView("today")}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: view === "today" ? "var(--accent)" : "var(--surface)",
              color: view === "today" ? "#fff" : "var(--muted)",
              border: `1px solid ${view === "today" ? "var(--accent)" : "var(--border)"}`,
            }}
          >Today</button>
          <button
            onClick={() => setView("all")}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: view === "all" ? "var(--accent)" : "var(--surface)",
              color: view === "all" ? "#fff" : "var(--muted)",
              border: `1px solid ${view === "all" ? "var(--accent)" : "var(--border)"}`,
            }}
          >Full week</button>
        </div>

        {/* Today view */}
        {view === "today" && (
          todayItems.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {todayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="w-1 h-8 rounded-full shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{typeLabels[item.type]}</p>
                  </div>
                  <p className="text-sm font-mono shrink-0" style={{ color: item.color }}>{formatTime12(item.time)}</p>
                  <button onClick={() => handleRemove(item.id)} className="text-xs shrink-0" style={{ color: "var(--muted)" }}>x</button>
                </div>
              ))}
            </div>
          )
        )}

        {/* Week view */}
        {view === "all" && (
          items.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="text-sm" style={{ color: "var(--muted)" }}>No items scheduled yet. Tap + Add to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const dayItems = groupedByDay[day];
                if (!dayItems || dayItems.length === 0) return null;
                return (
                  <div key={day}>
                    <h3 className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                      {dayNames[day]}
                    </h3>
                    <div className="space-y-1">
                      {dayItems.map((item) => (
                        <div
                          key={item.id + "-" + day}
                          className="flex items-center gap-3 rounded-lg p-2.5"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                          <div className="w-1 h-6 rounded-full shrink-0" style={{ background: item.color }} />
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                          </div>
                          <p className="text-xs font-mono shrink-0" style={{ color: item.color }}>{formatTime12(item.time)}</p>
                          <button onClick={() => handleRemove(item.id)} className="text-xs shrink-0" style={{ color: "var(--muted)" }}>x</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
