"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { GLOSSARY_ENTRIES, type GlossaryEntry } from "@/data/veritas/glossary";

interface GlossaryTooltipProps {
  text: string;
  className?: string;
}

// Terms too common/generic to highlight as standalone words
const SKIP_TERMS = new Set([
  "faith",
  "grace",
  "form",
  "merit",
  "charity",
  "hope",
  "prudence",
  "person",
  "substance",
  "participation",
  "privation",
  "subsistence",
  "predestination",
  "providence",
  "sacrament",
  "eschatology",
  "ecclesiology",
  "justification",
  "purgatory",
  "indulgence",
  "contrition",
  "attrition",
  "transcendence",
  "immanence",
  "incarnation",
  "omnipotence",
  "omniscience",
  "omnipresence",
  "immutability",
  "subsidiarity",
  "solidarity",
]);

// Build lookup and regex once
function buildGlossaryData() {
  const lookup = new Map<string, GlossaryEntry>();
  const matchTerms: string[] = [];

  for (const entry of GLOSSARY_ENTRIES) {
    const termLower = entry.term.toLowerCase();
    // Skip common single words
    const isMultiWord = entry.term.includes(" ") || entry.term.includes("/");
    if (!isMultiWord && SKIP_TERMS.has(termLower)) continue;

    lookup.set(termLower, entry);
    matchTerms.push(entry.term);

    // Also add the part before parenthetical, e.g. "Causa Efficiens (Efficient Cause)" -> "Causa Efficiens" and "Efficient Cause"
    const parenMatch = entry.term.match(/^(.+?)\s*\((.+?)\)$/);
    if (parenMatch) {
      const main = parenMatch[1].trim();
      const alt = parenMatch[2].trim();
      lookup.set(main.toLowerCase(), entry);
      lookup.set(alt.toLowerCase(), entry);
      matchTerms.push(main);
      matchTerms.push(alt);
    }
  }

  // Sort by length descending so longer phrases match first
  matchTerms.sort((a, b) => b.length - a.length);

  // Escape regex special chars
  const escaped = matchTerms.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  return { lookup, pattern };
}

const { lookup: GLOSSARY_LOOKUP, pattern: GLOSSARY_PATTERN } =
  buildGlossaryData();

function getFirstSentence(text: string): string {
  // Get first sentence, up to ~200 chars
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match && match[0].length <= 200) return match[0];
  if (text.length <= 200) return text;
  return text.slice(0, 197) + "...";
}

interface TooltipData {
  entry: GlossaryEntry;
  x: number;
  y: number;
}

export default function GlossaryTooltip({ text, className }: GlossaryTooltipProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse text into segments
  const segments = useMemo(() => {
    const parts: { text: string; entry?: GlossaryEntry }[] = [];
    let lastIndex = 0;
    // Reset regex
    GLOSSARY_PATTERN.lastIndex = 0;

    // Track which terms we've already matched to avoid duplicates
    const matched = new Set<string>();
    const matches: { index: number; length: number; matched: string; entry: GlossaryEntry }[] = [];

    let m;
    while ((m = GLOSSARY_PATTERN.exec(text)) !== null) {
      const termLower = m[1].toLowerCase();
      const entry = GLOSSARY_LOOKUP.get(termLower);
      if (!entry) continue;

      // Only highlight first occurrence of each term
      const entryKey = entry.term.toLowerCase();
      if (matched.has(entryKey)) continue;
      matched.add(entryKey);

      matches.push({
        index: m.index,
        length: m[1].length,
        matched: m[1],
        entry,
      });
    }

    // Sort by position
    matches.sort((a, b) => a.index - b.index);

    for (const match of matches) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index) });
      }
      parts.push({ text: match.matched, entry: match.entry });
      lastIndex = match.index + match.length;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex) });
    }

    return parts;
  }, [text]);

  const handleTermClick = useCallback(
    (e: React.MouseEvent, entry: GlossaryEntry) => {
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltip({
        entry,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      });
    },
    []
  );

  // Dismiss on outside click
  useEffect(() => {
    if (!tooltip) return;

    const handleClick = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setTooltip(null);
      }
    };

    // Delay to avoid immediate dismissal from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [tooltip]);

  // Adjust tooltip position to stay on screen
  useEffect(() => {
    if (!tooltip || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: keep within viewport with 12px padding
    if (rect.right > vw - 12) {
      el.style.left = `${vw - rect.width - 12}px`;
    }
    if (rect.left < 12) {
      el.style.left = "12px";
    }

    // Vertical: if tooltip goes below viewport, show above the word
    if (rect.bottom > vh - 12) {
      el.style.top = `${tooltip.y - rect.height - 40}px`;
    }
  }, [tooltip]);

  return (
    <span ref={containerRef} className={className}>
      {segments.map((seg, i) =>
        seg.entry ? (
          <span
            key={i}
            onClick={(e) => handleTermClick(e, seg.entry!)}
            className="cursor-pointer text-amber-400/70 border-b border-dotted border-amber-700/40 hover:text-amber-400 hover:border-amber-600/60 transition-colors"
          >
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}

      {tooltip && (
        <span
          ref={tooltipRef}
          className="fixed z-50 max-w-xs rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 shadow-xl shadow-black/50"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translateX(-50%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="block text-xs font-semibold text-amber-400 mb-1">
            {tooltip.entry.term}
          </span>
          {tooltip.entry.latin && (
            <span className="block text-[10px] italic text-stone-500 mb-1.5">
              {tooltip.entry.latin}
            </span>
          )}
          <span className="block text-xs leading-relaxed text-stone-300">
            {getFirstSentence(tooltip.entry.definition)}
          </span>
          <a
            href="/veritas/glossary"
            className="mt-2 block text-[10px] font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            Full definition →
          </a>
        </span>
      )}
    </span>
  );
}
