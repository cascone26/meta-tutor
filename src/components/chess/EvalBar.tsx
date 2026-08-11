import type { EngineEval } from "@/lib/chess-engine";
import { evalAsWhiteCp, formatEval } from "@/lib/chess-engine";

// Vertical bar showing White's advantage, filling from the bottom — the standard
// eval-bar convention on every serious chess site. Absent here entirely before.
export default function EvalBar({ evaluation, sideToMove }: { evaluation: EngineEval | null; sideToMove: "w" | "b" }) {
  const whiteCp = evaluation ? evalAsWhiteCp(evaluation, sideToMove) : 0;
  // Compress with a soft curve so huge advantages don't instantly peg the bar at 100%.
  const pct = 50 + 50 * Math.tanh(whiteCp / 400);
  const label = evaluation ? formatEval(evaluation, sideToMove) : "0.0";

  return (
    <div className="hidden md:flex flex-col items-center shrink-0" style={{ width: 28 }}>
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{ height: "min(70vh, 420px)", background: "#1a1a1a", border: "1px solid #2a2a2a" }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-300"
          style={{ height: `${pct}%`, background: "#e8e8e8" }}
        />
      </div>
      <span className="text-[10px] mt-1.5 font-mono" style={{ color: "#8fae9a" }}>{label}</span>
    </div>
  );
}
