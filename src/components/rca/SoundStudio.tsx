"use client";

import { useMemo, useRef, useState } from "react";
import { phonograms } from "@/lib/rca-content/phonogram-sounds";
import {
  latinNouns, sumConjugation, amoConjugation, latinAdjectives,
  latinPrepositions, latinNumbers, latinSayings, pronunciationRules,
  type LatinItem,
} from "@/lib/rca-content/latin-core";
import { slugify } from "@/lib/audio-slug";
import { saveResult, logWrongAnswer } from "@/lib/subject-progress";
import { FlameIcon } from "./NatureIcons";

type SoundOption = { label: string; audioSrc: string; note?: string };
type SoundCard = { front: string; category: string; sounds: SoundOption[] };

function playAudio(src: string) {
  const el = new Audio(src);
  el.play().catch(() => {});
}

// amō/amāre-style entries never have commas; only the adjectives list does
// (bonus, bona, bonum) — split those into one card per gendered form so
// every card maps to exactly one pre-generated audio file.
function latinItemsToCards(items: LatinItem[], category: string): SoundCard[] {
  const cards: SoundCard[] = [];
  for (const it of items) {
    const latinForms = it.latin.split(",").map((s) => s.trim());
    for (const form of latinForms) {
      cards.push({
        front: form,
        category,
        sounds: [{ label: it.english, audioSrc: `/audio/latin/${slugify(form)}.mp3` }],
      });
    }
  }
  return cards;
}

function buildPhonogramCards(): SoundCard[] {
  return phonograms.map((p) => ({
    front: p.spelling,
    category: p.category,
    sounds: p.sounds.map((s) => ({
      label: `${s.ipa} — as in "${s.keyword}"`,
      audioSrc: `/audio/phonograms/${slugify(s.keyword)}.mp3`,
      note: s.note,
    })),
  }));
}

function buildLatinCards(): SoundCard[] {
  return [
    ...latinItemsToCards(latinNouns, "Nouns"),
    ...latinItemsToCards(sumConjugation, "sum — to be"),
    ...latinItemsToCards(amoConjugation, "amō — to love"),
    ...latinItemsToCards(latinAdjectives, "Adjectives"),
    ...latinItemsToCards(latinPrepositions, "Prepositions"),
    ...latinItemsToCards(latinNumbers, "Numbers"),
    ...latinItemsToCards(latinSayings, "Sayings"),
  ];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SoundStudio({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const isLatin = subjectId === "first-form-latin-6";
  const progressKey = `rca-${subjectId}`;
  const cards = useMemo(() => (isLatin ? buildLatinCards() : buildPhonogramCards()), [isLatin]);
  const categories = useMemo(() => [...new Set(cards.map((c) => c.category))], [cards]);

  const [tab, setTab] = useState<"study" | "quiz">("study");
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const pool = catFilter ? cards.filter((c) => c.category === catFilter) : cards;

  return (
    <div className="rounded-2xl p-4 mb-6" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3" }}>
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: "#2f5e7a" }}>
        <FlameIcon size={14} />
        Sound studio
      </h2>
      <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>
        {isLatin
          ? "Classical Latin pronunciation — words read aloud from a hand-built phonetic respelling, not raw text-to-speech guessing at Latin."
          : "Every phonogram sound, read aloud via its real keyword word — the way LOE actually teaches them."}
      </p>

      <div className="flex gap-1.5 mb-3">
        {(["study", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: tab === t ? "#6b8e5a" : "#fff",
              color: tab === t ? "#fff" : "#5a7a4a",
              border: `1px solid ${tab === t ? "#6b8e5a" : "#d9e4d3"}`,
            }}
          >
            {t === "study" ? "Study (browse + listen)" : "Class quiz (oral testing)"}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <button
          onClick={() => setCatFilter(null)}
          className="px-2.5 py-1 rounded-full text-[11px]"
          style={{
            background: catFilter === null ? "#3f7ea6" : "#fff",
            color: catFilter === null ? "#fff" : "#3f7ea6",
            border: "1px solid #bcd6e6",
          }}
        >
          All ({cards.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className="px-2.5 py-1 rounded-full text-[11px]"
            style={{
              background: catFilter === c ? "#3f7ea6" : "#fff",
              color: catFilter === c ? "#fff" : "#3f7ea6",
              border: "1px solid #bcd6e6",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {isLatin && <PronunciationNote />}

      {tab === "study" ? (
        <StudyMode pool={pool} />
      ) : (
        <QuizMode pool={pool} subjectName={subjectName} progressKey={progressKey} />
      )}
    </div>
  );
}

function PronunciationNote() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 rounded-xl p-3" style={{ background: "#fff", border: "1px solid #d9e4d3" }}>
      <button onClick={() => setOpen((o) => !o)} className="text-xs font-medium" style={{ color: "#3f7ea6" }}>
        {open ? "Hide" : "Show"} classical vs. ecclesiastical pronunciation rules
      </button>
      {open && (
        <div className="mt-2 overflow-x-auto">
          <table className="text-xs w-full" style={{ color: "#3a4a34" }}>
            <thead>
              <tr style={{ color: "#8a9a7c" }}>
                <th className="text-left pr-3 pb-1">Letter</th>
                <th className="text-left pr-3 pb-1">Classical</th>
                <th className="text-left pr-3 pb-1">Ecclesiastical</th>
                <th className="text-left pb-1">Example</th>
              </tr>
            </thead>
            <tbody>
              {pronunciationRules.map((r) => (
                <tr key={r.letter} style={{ borderTop: "1px solid #e6e0d0" }}>
                  <td className="pr-3 py-1 font-medium">{r.letter}</td>
                  <td className="pr-3 py-1">{r.classical}</td>
                  <td className="pr-3 py-1">{r.ecclesiastical}</td>
                  <td className="py-1" style={{ color: "#8a9a7c" }}>{r.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] mt-2" style={{ color: "#8a9a7c" }}>
            Audio below is generated in the classical system (most common for Memoria Press) — check
            your First Form Latin pronunciation guide page to confirm which system RCA actually teaches.
          </p>
        </div>
      )}
    </div>
  );
}

function StudyMode({ pool }: { pool: SoundCard[] }) {
  const [index, setIndex] = useState(0);
  const card = pool[Math.min(index, pool.length - 1)];
  if (!card) return <p className="text-sm" style={{ color: "#8a9a7c" }}>No cards in this category.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
        <span>Card {index + 1} of {pool.length}</span>
      </div>
      <div className="rounded-xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #d9e4d3", minHeight: 120 }}>
        <p className="text-2xl font-semibold mb-3" style={{ color: "#33402c" }}>{card.front}</p>
        <div className="space-y-2">
          {card.sounds.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => playAudio(s.audioSrc)}
                className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                style={{ background: "#dcecd4", color: "#4a6a3a" }}
              >
                ▶ Play
              </button>
              <span className="text-sm" style={{ color: "#3a4a34" }}>{s.label}</span>
              {s.note && <span className="text-[11px]" style={{ color: "#8a9a7c" }}>({s.note})</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          style={{ background: "#fff", color: "#3f7ea6", border: "1px solid #bcd6e6" }}
        >
          ← Back
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(pool.length - 1, i + 1))}
          disabled={index >= pool.length - 1}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          style={{ background: "#3f7ea6", color: "#fff" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// In-class oral testing: shows the item, tutor listens to the student say it
// out loud, THEN reveals the correct sound(s) to compare/play back, then
// tallies right/wrong. Grading is Jacob's ear, not speech recognition —
// browser speech-to-text can't reliably judge isolated phonemes/Latin, so
// this keeps the human as the judge and the tool as the prompt+reference+tally.
function QuizMode({ pool, subjectName, progressKey }: { pool: SoundCard[]; subjectName: string; progressKey: string }) {
  const orderRef = useRef<SoundCard[]>(shuffle(pool));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const order = orderRef.current;
  const card = order[index];

  function restart() {
    orderRef.current = shuffle(pool);
    setIndex(0);
    setRevealed(false);
    setRight(0);
    setWrong(0);
  }

  function grade(gotIt: boolean) {
    if (!card) return;
    if (gotIt) setRight((r) => r + 1);
    else {
      setWrong((w) => w + 1);
      logWrongAnswer(progressKey, card.front, card.sounds.map((s) => s.label).join("; "), subjectName, "sound-quiz");
    }
    if (index + 1 < order.length) {
      setIndex(index + 1);
      setRevealed(false);
    } else {
      saveResult(progressKey, {
        mode: "sound-quiz",
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        score: gotIt ? right + 1 : right,
        total: order.length,
        percentage: Math.round(((gotIt ? right + 1 : right) / order.length) * 100),
        weakTerms: [],
        weakCategories: [],
      });
    }
  }

  if (order.length !== pool.length) orderRef.current = shuffle(pool); // category changed mid-session

  if (!card) return <p className="text-sm" style={{ color: "#8a9a7c" }}>No cards in this category.</p>;
  const done = index >= order.length;

  if (done) {
    return (
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#2f5e7a" }}>{right} / {order.length} correct</p>
        <p className="text-xs mb-3" style={{ color: "#8a9a7c" }}>{wrong} to review next round.</p>
        <button onClick={restart} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#c9843a", color: "#fff" }}>
          Run it again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
        <span>Item {index + 1} of {order.length}</span>
        <span>✓ {right} · ✗ {wrong}</span>
      </div>
      <div className="rounded-xl p-4 mb-3 text-center" style={{ background: "#fff", border: "1px solid #d9e4d3", minHeight: 120 }}>
        <p className="text-3xl font-semibold" style={{ color: "#33402c" }}>{card.front}</p>
        <p className="text-[11px] mt-1" style={{ color: "#8a9a7c" }}>Have the student say it out loud — then reveal to check.</p>
        {revealed && (
          <div className="mt-3 pt-3 space-y-1.5 text-left" style={{ borderTop: "1px solid #e6e0d0" }}>
            {card.sounds.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  onClick={() => playAudio(s.audioSrc)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                  style={{ background: "#dcecd4", color: "#4a6a3a" }}
                >
                  ▶ Play
                </button>
                <span className="text-sm" style={{ color: "#3a4a34" }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="px-4 py-2 rounded-lg text-sm font-medium w-full" style={{ background: "#3f7ea6", color: "#fff" }}>
          Reveal correct sound
        </button>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => grade(false)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#f0dede", color: "#a04a4a" }}>
            Missed it
          </button>
          <button onClick={() => grade(true)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#dcecd4", color: "#4a6a3a" }}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
