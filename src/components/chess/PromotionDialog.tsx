const OPTIONS: { code: "q" | "r" | "b" | "n"; label: string }[] = [
  { code: "q", label: "Queen" },
  { code: "r", label: "Rook" },
  { code: "b", label: "Bishop" },
  { code: "n", label: "Knight" },
];

// Real promotion picker — the old version silently auto-queened every promotion,
// which is wrong often enough (underpromotion to avoid stalemate, knight for a fork)
// that it belongs in a "very customizable" chess app as an actual choice.
export default function PromotionDialog({ color, onPick }: { color: "w" | "b"; onPick: (piece: "q" | "r" | "b" | "n") => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="rounded-2xl p-5" style={{ background: "#182620", border: "1px solid #24382c" }}>
        <p className="text-sm font-semibold mb-3 text-center" style={{ color: "#e0e8e2" }}>Promote to</p>
        <div className="flex gap-3">
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              onClick={() => onPick(o.code)}
              className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-transform hover:scale-105"
              style={{ background: "#0f1a14", border: "1px solid #24382c" }}
            >
              <span
                className="flex items-center justify-center rounded-full text-sm font-bold"
                style={{
                  width: 40, height: 40,
                  background: color === "w" ? "#e8f0ea" : "#0f1a14",
                  color: color === "w" ? "#0f1a14" : "#e8f0ea",
                  border: `2px solid ${color === "w" ? "#0f1a14" : "#e8f0ea"}`,
                }}
              >
                {o.code.toUpperCase()}
              </span>
              <span className="text-xs" style={{ color: "#8fae9a" }}>{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
