import Link from "next/link";
import { subjects } from "@/lib/subjects";

export default function HubPage() {
  return (
    <div
      className="h-full overflow-y-auto flex items-center justify-center px-4 py-10"
      style={{ background: "#111114", color: "#eceae6" }}
    >
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-center" style={{ color: "#8a8580" }}>
          Meta Tutor
        </p>
        <h1 className="text-2xl font-semibold text-center mb-1">Where to today?</h1>
        <p className="text-sm text-center mb-8" style={{ color: "#8a8580" }}>
          Pick a subject. Each one tracks your progress and tells you what to work on.
        </p>

        <div className="grid gap-3">
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group flex items-center justify-between rounded-2xl px-5 py-4 transition-transform hover:scale-[1.01]"
              style={{
                background: "#1a1a1e",
                border: "1px solid #2a2a30",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: s.accentDark }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{s.name}</span>
                    {s.status === "building" && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide"
                        style={{ background: "#2a2a30", color: "#8a8580" }}
                      >
                        Building
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#8a8580" }}>{s.tagline}</p>
                </div>
              </div>
              <span
                className="text-sm opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ color: s.accentDark }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
