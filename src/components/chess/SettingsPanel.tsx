import { BOARD_THEMES, PIECE_SETS, type ChessPrefs } from "@/lib/chess-prefs";

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full py-1.5 text-sm"
      style={{ color: "#e0e8e2" }}
    >
      <span>{label}</span>
      <span
        className="relative rounded-full transition-colors"
        style={{ width: 34, height: 18, background: value ? "#3f6b4f" : "#24382c" }}
      >
        <span
          className="absolute rounded-full transition-transform"
          style={{
            width: 14, height: 14, top: 2, left: 2, background: "#e8f0ea",
            transform: value ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </span>
    </button>
  );
}

export default function SettingsPanel({ prefs, update }: { prefs: ChessPrefs; update: (patch: Partial<ChessPrefs>) => void }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
      <h2 className="text-sm font-semibold mb-3" style={{ color: "#e0e8e2" }}>Customize</h2>

      <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Board theme</p>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {BOARD_THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => update({ boardTheme: t.id })}
            title={t.name}
            className="w-7 h-7 rounded-md overflow-hidden shrink-0"
            style={{
              border: prefs.boardTheme === t.id ? "2px solid #7ac48a" : "1px solid #24382c",
              background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)`,
            }}
          />
        ))}
      </div>

      <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Piece set</p>
      <div className="flex gap-1.5 mb-3">
        {PIECE_SETS.map((p) => (
          <button
            key={p.id}
            onClick={() => update({ pieceSet: p.id })}
            className="px-2.5 py-1 rounded-lg text-xs"
            style={{
              background: prefs.pieceSet === p.id ? "#3f6b4f" : "#0f1a14",
              border: "1px solid #24382c",
              color: "#e0e8e2",
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="text-xs mb-1.5" style={{ color: "#8fae9a" }}>Board size</p>
      <input
        type="range"
        min={60}
        max={100}
        value={prefs.boardSizePct}
        onChange={(e) => update({ boardSizePct: Number(e.target.value) })}
        className="w-full mb-3"
      />

      <div style={{ borderTop: "1px solid #24382c" }} className="pt-2">
        <Toggle label="Sound effects" value={prefs.soundOn} onChange={(v) => update({ soundOn: v })} />
        <Toggle label="Coordinates" value={prefs.showCoordinates} onChange={(v) => update({ showCoordinates: v })} />
        <Toggle label="Legal move hints" value={prefs.showLegalMoves} onChange={(v) => update({ showLegalMoves: v })} />
        <Toggle label="Highlight last move" value={prefs.showLastMove} onChange={(v) => update({ showLastMove: v })} />
        <Toggle label="Auto-queen promotions" value={prefs.autoQueen} onChange={(v) => update({ autoQueen: v })} />
      </div>

      <div style={{ borderTop: "1px solid #24382c" }} className="pt-2 mt-2">
        <p className="text-xs mb-1" style={{ color: "#8fae9a" }}>What to show while playing</p>
        <Toggle label="Advantage bar" value={prefs.showEvalBar} onChange={(v) => update({ showEvalBar: v })} />
        <Toggle label="Captured material" value={prefs.showMaterialDiff} onChange={(v) => update({ showMaterialDiff: v })} />
        <Toggle label="Move list" value={prefs.showMoveList} onChange={(v) => update({ showMoveList: v })} />
        <Toggle label="Recent weak areas panel" value={prefs.showWeakAreas} onChange={(v) => update({ showWeakAreas: v })} />
        <Toggle label="Offer coach after mistakes" value={prefs.autoOfferCoach} onChange={(v) => update({ autoOfferCoach: v })} />
      </div>
    </div>
  );
}
