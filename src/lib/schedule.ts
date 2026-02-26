export type ScheduleItem = {
  id: string;
  title: string;
  time: string; // HH:MM
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  color: string;
  notify: boolean;
  type: "nap" | "eat" | "study" | "class" | "quiz" | "custom";
};

const KEY = "meta-tutor-schedule";

const typeLabels: Record<string, string> = {
  nap: "Power Nap",
  eat: "Meal",
  study: "Study / HW",
  class: "Class",
  quiz: "Quiz",
  custom: "Custom",
};

const typeColors: Record<string, string> = {
  nap: "#6b8fbf",
  eat: "#6ab070",
  study: "#7c6b9a",
  class: "#e07c4f",
  quiz: "#c96b6b",
  custom: "#d4a843",
};

export { typeLabels, typeColors };

export function getSchedule(): ScheduleItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveSchedule(items: ScheduleItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addScheduleItem(item: Omit<ScheduleItem, "id">): ScheduleItem {
  const items = getSchedule();
  const newItem = { ...item, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
  items.push(newItem);
  saveSchedule(items);
  return newItem;
}

export function removeScheduleItem(id: string) {
  const items = getSchedule().filter((i) => i.id !== id);
  saveSchedule(items);
}

export function updateScheduleItem(id: string, updates: Partial<ScheduleItem>) {
  const items = getSchedule();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates };
    saveSchedule(items);
  }
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export { dayNames };

export function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function getTodayItems(): ScheduleItem[] {
  const today = new Date().getDay();
  return getSchedule()
    .filter((item) => item.days.includes(today))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getUpcomingItem(): ScheduleItem | null {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const todayItems = getTodayItems();
  return todayItems.find((item) => item.time > currentTime) || null;
}
