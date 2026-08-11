import type { MoveClass } from "@/lib/chess-classify";
import { CLASS_COLOR } from "@/lib/chess-classify";

export type MoveEntry = { san: string; cls?: MoveClass };

// Two-column SAN table (White | Black per row), matching every real chess site's
// move-list convention — the old version was a flat unnumbered list.
export default function MoveList({
  moves,
  currentPly,
  onSelect,
}: {
  moves: MoveEntry[];
  currentPly?: number;
  onSelect?: (ply: number) => void;
}) {
  const rows: { num: number; white?: MoveEntry; black?: MoveEntry; whitePly: number; blackPly?: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      num: i / 2 + 1,
      white: moves[i],
      black: moves[i + 1],
      whitePly: i,
      blackPly: i + 1 < moves.length ? i + 1 : undefined,
    });
  }

  function cell(entry: MoveEntry | undefined, ply: number | undefined) {
    if (!entry || ply === undefined) return <span className="flex-1" />;
    const active = currentPly === ply;
    return (
      <button
        onClick={() => onSelect?.(ply)}
        disabled={!onSelect}
        className="flex-1 text-left px-1.5 py-0.5 rounded text-sm"
        style={{
          background: active ? "#3f6b4f" : "transparent",
          color: entry.cls ? CLASS_COLOR[entry.cls] : "#e0e8e2",
          cursor: onSelect ? "pointer" : "default",
        }}
      >
        {entry.san}
      </button>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto rounded-lg" style={{ background: "#0f1a14", border: "1px solid #24382c" }}>
      {rows.length === 0 ? (
        <p className="text-xs p-3" style={{ color: "#6f8a79" }}>No moves yet.</p>
      ) : (
        rows.map((r) => (
          <div key={r.num} className="flex items-center gap-1 px-2 py-0.5">
            <span className="text-xs w-6 shrink-0" style={{ color: "#5a7a68" }}>{r.num}.</span>
            {cell(r.white, r.whitePly)}
            {cell(r.black, r.blackPly)}
          </div>
        ))
      )}
    </div>
  );
}
