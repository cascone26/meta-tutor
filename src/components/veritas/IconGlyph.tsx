const SHAPES: Record<string, string> = {
  frame: "M5 5h14v14H5z",
  bars: "M6 18v-6M12 18V8M18 18v-10",
  hex: "M12 3l7.79 4.5v9L12 21l-7.79-4.5v-9z",
  rings: "M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
  triangle: "M12 4.5l8 14H4z",
  diamond: "M12 3l9 9-9 9-9-9z",
  chevrons: "M7 8l5 4-5 4M12 8l5 4-5 4",
  brackets: "M8 4H5v16h3M16 4h3v16h-3",
  venn: "M9.5 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0 M14.5 12m-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0",
  card: "M3 6h18v12H3zM3 10.5h18",
  bolt: "M13 3L5 14h6l-1 7 8-11h-6l1-7z",
  cross: "M12 2v9M8 7h8M7 11h10l-1 11H8z",
  book: "M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z",
  shield: "M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
  dot: "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0",
};

export type GlyphName = keyof typeof SHAPES;

export default function IconGlyph({ name, className }: { name: string; className?: string }) {
  const d = SHAPES[name] ?? SHAPES.dot;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
