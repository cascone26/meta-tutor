import type { MoveClass } from "@/lib/chess-classify";
import { CLASS_LABEL, CLASS_COLOR } from "@/lib/chess-classify";

export type GameReviewData = {
  resultText: string;
  accuracy: number;
  openingName: string | null;
  counts: Partial<Record<MoveClass, number>>;
};

const ORDER: MoveClass[] = ["best", "excellent", "good", "inaccuracy", "mistake", "blunder", "missedMate", "foundMate"];

export default function GameReview({ data }: { data: GameReviewData }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ background: "#182620", border: "1px solid #24382c" }}>
      <h2 className="text-sm font-semibold mb-3" style={{ color: "#e0e8e2" }}>Game review</h2>
      <p className="text-sm mb-1" style={{ color: "#e0e8e2" }}>{data.resultText}</p>
      {data.openingName && (
        <p className="text-xs mb-3" style={{ color: "#8fae9a" }}>Opening: {data.openingName}</p>
      )}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold" style={{ color: data.accuracy >= 80 ? "#7ac48a" : data.accuracy >= 55 ? "#e0c07a" : "#e08a8a" }}>
          {data.accuracy}%
        </span>
        <span className="text-xs" style={{ color: "#8fae9a" }}>accuracy this game</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {ORDER.filter((c) => data.counts[c]).map((c) => (
          <span
            key={c}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#0f1a14", color: CLASS_COLOR[c], border: `1px solid ${CLASS_COLOR[c]}44` }}
          >
            {CLASS_LABEL[c]} × {data.counts[c]}
          </span>
        ))}
      </div>
    </div>
  );
}
