"use client";

import { useEffect, useRef, useState } from "react";
import { fetchShortCards, type ShortCard } from "@/lib/rca-short-cards";
import { saveResult } from "@/lib/subject-progress";
import { FlameIcon } from "../NatureIcons";

type Tile = { id: string; text: string; pairId: string; side: "term" | "answer" };
type Phase = "idle" | "loading" | "playing" | "done" | "error";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchGame({ subjectId, subjectName, lessonN }: { subjectId: string; subjectName: string; lessonN?: number }) {
  const progressKey = `rca-${subjectId}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrongFlash, setWrongFlash] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startRef.current), 100);
    return () => clearInterval(interval);
  }, [phase]);

  async function start() {
    setPhase("loading");
    setErrorMsg("");
    const { cards, error } = await fetchShortCards(subjectId, lessonN);
    if (error || cards.length === 0) {
      setErrorMsg(error || "Couldn't load cards.");
      setPhase("error");
      return;
    }
    const pairs = cards.slice(0, 6) as ShortCard[];
    const termTiles: Tile[] = pairs.map((c, i) => ({ id: `t${i}`, text: c.term, pairId: `p${i}`, side: "term" }));
    const answerTiles: Tile[] = pairs.map((c, i) => ({ id: `a${i}`, text: c.answer, pairId: `p${i}`, side: "answer" }));
    setTiles([...shuffle(termTiles), ...shuffle(answerTiles)]);
    setMatched(new Set());
    setSelected(null);
    setMistakes(0);
    startRef.current = Date.now();
    setElapsedMs(0);
    setPhase("playing");
  }

  function click(tile: Tile) {
    if (matched.has(tile.pairId) || wrongFlash) return;
    if (!selected) {
      setSelected(tile);
      return;
    }
    if (selected.id === tile.id) {
      setSelected(null);
      return;
    }
    if (selected.pairId === tile.pairId && selected.side !== tile.side) {
      const next = new Set(matched).add(tile.pairId);
      setMatched(next);
      setSelected(null);
      if (next.size === tiles.length / 2) finish();
    } else {
      setMistakes((m) => m + 1);
      setWrongFlash([selected.id, tile.id]);
      setTimeout(() => {
        setWrongFlash(null);
        setSelected(null);
      }, 500);
    }
  }

  function finish() {
    const total = tiles.length / 2;
    const score = Math.max(0, total - mistakes);
    saveResult(progressKey, {
      mode: "match",
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      weakTerms: [],
      weakCategories: mistakes > 0 ? [subjectName] : [],
    });
    setPhase("done");
  }

  const terms = tiles.filter((t) => t.side === "term");
  const answers = tiles.filter((t) => t.side === "answer");

  function tileStyle(tile: Tile) {
    const isMatched = matched.has(tile.pairId);
    const isSelected = selected?.id === tile.id;
    const isWrong = wrongFlash?.includes(tile.id);
    return {
      background: isMatched ? "#dcecd4" : isWrong ? "#f0dede" : isSelected ? "#e0eef7" : "#fff",
      border: `1px solid ${isMatched ? "#8ab87a" : isWrong ? "#d09a9a" : isSelected ? "#3f7ea6" : "#d9e4d3"}`,
      opacity: isMatched ? 0.55 : 1,
      color: "#2f3a2a",
      cursor: isMatched ? "default" : "pointer",
    };
  }

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <FlameIcon size={14} />
        Match
      </h2>

      {phase === "idle" && (
        <>
          <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>Click a term, then its match — clear the board as fast as you can.</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#7a5a8a", color: "#fff" }}>
            Start match
          </button>
        </>
      )}

      {phase === "loading" && <p className="text-sm" style={{ color: "#8a9a7c" }}>Shuffling the board…</p>}

      {phase === "error" && (
        <div>
          <p className="text-sm mb-3" style={{ color: "#a04a4a" }}>{errorMsg}</p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#7a5a8a", color: "#fff" }}>
            Try again
          </button>
        </div>
      )}

      {phase === "playing" && (
        <div>
          <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
            <span>{matched.size} / {tiles.length / 2} matched</span>
            <span className="font-mono">{(elapsedMs / 1000).toFixed(1)}s</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1.5">
              {terms.map((t) => (
                <button key={t.id} onClick={() => click(t)} className="text-left px-2.5 py-2 rounded-lg text-sm transition-colors" style={tileStyle(t)}>
                  {t.text}
                </button>
              ))}
            </div>
            <div className="grid gap-1.5">
              {answers.map((t) => (
                <button key={t.id} onClick={() => click(t)} className="text-left px-2.5 py-2 rounded-lg text-sm transition-colors" style={tileStyle(t)}>
                  {t.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#2f5e7a" }}>
            Cleared in {(elapsedMs / 1000).toFixed(1)}s — {mistakes} miss{mistakes === 1 ? "" : "es"}
          </p>
          <button onClick={start} className="px-4 py-2 rounded-lg text-sm font-medium mt-2" style={{ background: "#7a5a8a", color: "#fff" }}>
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
