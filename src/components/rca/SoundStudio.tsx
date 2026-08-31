"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { phonograms } from "@/lib/rca-content/phonogram-sounds";
import {
  latinNouns, sumConjugation, amoConjugation, latinAdjectives,
  latinPrepositions, latinNumbers, latinSayings, pronunciationRules,
  type LatinItem,
} from "@/lib/rca-content/latin-core";
import { slugify } from "@/lib/audio-slug";
import { saveResult, logWrongAnswer } from "@/lib/subject-progress";
import { toEcclesiasticalTtsSpelling } from "@/lib/latin-ecclesiastical-spelling";
import { useCustomVocab, type CustomVocabItem } from "@/lib/rca-custom-vocab";
import { FlameIcon } from "./NatureIcons";

type SoundOption = { label: string; audioSrc: string; note?: string };
type SoundCard = { front: string; category: string; sounds: SoundOption[]; custom?: boolean };

// Custom (Jacob-typed) words have no pre-generated/verified mp3 — there's
// nothing to point at, so their audioSrc is this sentinel + the real Latin
// text instead of a file path. playAudio() below reads it and falls back to
// the browser's own speech synthesis (Web Speech API) rather than trying to
// fetch a file that doesn't exist. Lower fidelity than the real edge-tts +
// Whisper-verified pipeline (scripts/gen-latin-audio.mjs) — that's still the
// only way to get a genuinely verified file — but it's instant, needs no
// backend, and works for literally anything typed in.
const SPEECH_PREFIX = "speech:";

function playAudio(src: string) {
  if (src.startsWith(SPEECH_PREFIX)) {
    const text = decodeURIComponent(src.slice(SPEECH_PREFIX.length));
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "it-IT"; // closest built-in voice family to ecclesiastical Latin's sound rules
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
    return;
  }
  const el = new Audio(src);
  el.play().catch(() => {});
}

function customVocabToCards(items: CustomVocabItem[]): SoundCard[] {
  return items.map((it) => ({
    front: it.latin,
    category: it.category,
    custom: true,
    sounds: [{
      label: it.english,
      audioSrc: SPEECH_PREFIX + encodeURIComponent(toEcclesiasticalTtsSpelling(it.latin)),
      note: it.note,
    }],
  }));
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
  const customVocab = useCustomVocab();
  const baseCards = useMemo(() => (isLatin ? buildLatinCards() : buildPhonogramCards()), [isLatin]);
  const cards = useMemo(
    () => (isLatin ? [...baseCards, ...customVocabToCards(customVocab.items)] : baseCards),
    [isLatin, baseCards, customVocab.items]
  );
  const categories = useMemo(() => [...new Set(cards.map((c) => c.category))], [cards]);

  const [tab, setTab] = useState<"study" | "quiz" | "reverse">("study");
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
          ? "Ecclesiastical (Church) Latin pronunciation — a real Italian neural voice reads each word, verified by speech-recognition round-trip so it's actually checked, not just assumed."
          : "Every phonogram sound, read aloud via its real keyword word — the way LOE actually teaches them."}
      </p>

      <div className="flex gap-1.5 mb-3 flex-wrap">
        {(["study", "quiz", "reverse"] as const).map((t) => (
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
            {t === "study" ? "Study (browse + listen)" : t === "quiz" ? "Class quiz (oral testing)" : "Audio quiz (guess the phonogram)"}
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
      {isLatin && <VocabAdder onAdd={customVocab.addItem} />}

      {tab === "study" && <StudyMode pool={pool} />}
      {tab === "quiz" && <QuizMode pool={pool} subjectName={subjectName} progressKey={progressKey} />}
      {tab === "reverse" && <ReverseQuizMode pool={pool} subjectName={subjectName} progressKey={progressKey} />}
    </div>
  );
}

// The audio quiz Jacob actually asked for (2026-08-24): "an audio test where
// it tests me like i test them where it gives me phonogram sounds then i say
// or write what phonogram it is then i reveal if i got it" — the REVERSE
// direction from QuizMode above (which shows the spelling and has a student
// say the sound). Here: play the real sound(s), Jacob types the spelling,
// reveal to self-check. Built on the exact same real pre-generated audio as
// the rest of Sound Studio — no separate content source to drift out of sync.
function ReverseQuizMode({ pool, subjectName, progressKey }: { pool: SoundCard[]; subjectName: string; progressKey: string }) {
  const orderRef = useRef<SoundCard[]>(shuffle(pool));
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const order = orderRef.current;
  const card = order[index];

  function playCard(c: SoundCard | undefined) {
    if (!c) return;
    let i = 0;
    function next() {
      if (i >= c!.sounds.length) return;
      const s = c!.sounds[i];
      i++;
      const el = new Audio(s.audioSrc);
      el.onended = () => setTimeout(next, 350);
      el.play().catch(() => setTimeout(next, 350));
    }
    next();
  }

  function restart() {
    orderRef.current = shuffle(pool);
    setIndex(0);
    setGuess("");
    setRevealed(false);
    setRight(0);
    setWrong(0);
    setTimeout(() => playCard(orderRef.current[0]), 150);
    setTimeout(() => inputRef.current?.focus(), 200);
  }

  useEffect(() => {
    playCard(order[0]);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (order.length !== pool.length) orderRef.current = shuffle(pool); // category changed mid-session

  if (!card) return <p className="text-sm" style={{ color: "#8a9a7c" }}>No cards in this category.</p>;
  const done = index >= order.length;

  function grade(gotIt: boolean) {
    if (gotIt) setRight((r) => r + 1);
    else {
      setWrong((w) => w + 1);
      logWrongAnswer(progressKey, card.sounds.map((s) => s.label).join("; "), card.front, subjectName, "sound-reverse-quiz");
    }
    if (index + 1 < order.length) {
      const nextI = index + 1;
      setIndex(nextI);
      setGuess("");
      setRevealed(false);
      setTimeout(() => playCard(order[nextI]), 150);
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      saveResult(progressKey, {
        mode: "sound-reverse-quiz",
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

  const guessIsCorrect = guess.trim().toLowerCase() === card.front.toLowerCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs" style={{ color: "#8a9a7c" }}>
        <span>Item {index + 1} of {order.length}</span>
        <span>✓ {right} · ✗ {wrong}</span>
      </div>
      <div className="rounded-xl p-4 mb-3 text-center" style={{ background: "#fff", border: "1px solid #d9e4d3", minHeight: 120 }}>
        <button
          onClick={() => playCard(card)}
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
          style={{ background: "#6b8e5a", color: "#fff" }}
          aria-label="Play sounds again"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" /></svg>
        </button>
        <p className="text-[11px]" style={{ color: "#8a9a7c" }}>{card.sounds.length} sound{card.sounds.length > 1 ? "s" : ""} — tap to replay</p>
        {revealed && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e6e0d0" }}>
            <p className="text-2xl font-bold" style={{ color: "#33402c" }}>{card.front}</p>
            <p className="text-xs mt-1" style={{ color: "#8a9a7c" }}>{card.sounds.map((s) => s.label).join(" · ")}</p>
          </div>
        )}
      </div>
      {!revealed ? (
        <>
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setRevealed(true); }}
            placeholder="Type what you heard"
            className="w-full text-center text-lg font-semibold px-4 py-2.5 rounded-lg mb-3"
            style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#33402c" }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button onClick={() => setRevealed(true)} className="w-full px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#3f7ea6", color: "#fff" }}>
            Reveal
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => grade(false)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: guessIsCorrect ? "#dcecd4" : "#f0dede", color: guessIsCorrect ? "#4a6a3a" : "#a04a4a" }}>
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

function PronunciationNote() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 rounded-xl p-3" style={{ background: "#fff", border: "1px solid #d9e4d3" }}>
      <button onClick={() => setOpen((o) => !o)} className="text-xs font-medium" style={{ color: "#3f7ea6" }}>
        {open ? "Hide" : "Show"} ecclesiastical vs. classical pronunciation rules
      </button>
      {open && (
        <div className="mt-2 overflow-x-auto">
          <table className="text-xs w-full" style={{ color: "#3a4a34" }}>
            <thead>
              <tr style={{ color: "#8a9a7c" }}>
                <th className="text-left pr-3 pb-1">Letter</th>
                <th className="text-left pr-3 pb-1">Ecclesiastical (used below)</th>
                <th className="text-left pr-3 pb-1">Classical</th>
                <th className="text-left pb-1">Example</th>
              </tr>
            </thead>
            <tbody>
              {pronunciationRules.map((r) => (
                <tr key={r.letter} style={{ borderTop: "1px solid #e6e0d0" }}>
                  <td className="pr-3 py-1 font-medium">{r.letter}</td>
                  <td className="pr-3 py-1">{r.ecclesiastical}</td>
                  <td className="pr-3 py-1">{r.classical}</td>
                  <td className="py-1" style={{ color: "#8a9a7c" }}>{r.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] mt-2" style={{ color: "#8a9a7c" }}>
            Audio below is ecclesiastical (Church Latin, what RCA teaches) — the classical column above
            is a reference only, for cross-checking other resources that use it instead.
          </p>
        </div>
      )}
    </div>
  );
}

type VocabCheckResult = {
  valid: boolean;
  corrected: string;
  wasCorrected: boolean;
  english: string;
  category: string;
  explanation: string;
};

// Jacob's ask (2026-08-30): type in a word/phrase, have it fact-checked and
// spell-corrected with an explanation, hear it said correctly, and — if he
// wants it — sort it into a real flashcard. This is the input surface for
// that; the actual check hits /api/rca-vocab-check (Claude), and accepted
// words get saved via useCustomVocab so they show up as real cards in
// Study/Quiz/Reverse above, same as any built-in word.
function VocabAdder({ onAdd }: { onAdd: (item: { latin: string; english: string; category: string; note?: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VocabCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  async function check() {
    if (!input.trim() || checking) return;
    setChecking(true);
    setError(null);
    setResult(null);
    setAdded(false);
    try {
      const res = await fetch("/api/rca-vocab-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong — try again.");
    } finally {
      setChecking(false);
    }
  }

  function addCard() {
    if (!result) return;
    onAdd({ latin: result.corrected, english: result.english, category: result.category, note: result.wasCorrected ? `you typed "${input.trim()}"` : undefined });
    setAdded(true);
  }

  function listen(text: string) {
    playAudio(SPEECH_PREFIX + encodeURIComponent(toEcclesiasticalTtsSpelling(text)));
  }

  return (
    <div className="mb-3 rounded-xl p-3" style={{ background: "#fff", border: "1px solid #d9e4d3" }}>
      <button onClick={() => setOpen((o) => !o)} className="text-xs font-medium" style={{ color: "#3f7ea6" }}>
        {open ? "Hide" : "+ Add your own word or phrase"}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <p className="text-[11px]" style={{ color: "#8a9a7c" }}>
            Type any Latin word or phrase — it gets fact-checked and spell-corrected, then you can save it as a real flashcard. Audio here is instant browser speech, not the verified edge-tts pipeline the built-in words use.
          </p>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult(null); setError(null); setAdded(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") check(); }}
              placeholder="e.g. in choro recitemus"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
              disabled={checking}
            />
            <button
              onClick={check}
              disabled={checking || !input.trim()}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "#3f7ea6", color: "#fff" }}
            >
              {checking ? "…" : "Check"}
            </button>
          </div>

          {error && <p className="text-xs" style={{ color: "#a04a4a" }}>{error}</p>}

          {result && !result.valid && (
            <p className="text-xs" style={{ color: "#a04a4a" }}>{result.explanation || "That doesn't look like real Latin."}</p>
          )}

          {result && result.valid && (
            <div className="rounded-lg p-3 text-sm" style={{ background: "#f4f7ef", border: "1px solid #e6e0d0" }}>
              <p className="font-semibold" style={{ color: "#2f5e7a" }}>
                {result.corrected}
                {result.wasCorrected && (
                  <span className="ml-2 text-[11px] font-normal" style={{ color: "#c9843a" }}>
                    (corrected from &quot;{input.trim()}&quot;)
                  </span>
                )}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#3a5a3a" }}>{result.english}</p>
              <p className="text-[11px] mt-1" style={{ color: "#8a9a7c" }}>{result.explanation}</p>
              <p className="text-[11px] mt-1" style={{ color: "#8a9a7c" }}>Category: {result.category}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => listen(result.corrected)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: "#eef2e2", color: "#3f7ea6" }}
                >
                  ▶ Listen
                </button>
                <button
                  onClick={addCard}
                  disabled={added}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium disabled:opacity-50"
                  style={{ background: added ? "#eef2e2" : "#6b8e5a", color: added ? "#5a7a4a" : "#fff" }}
                >
                  {added ? "Added ✓" : "Add as flashcard"}
                </button>
              </div>
            </div>
          )}
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
