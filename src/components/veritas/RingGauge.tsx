"use client";

import { useEffect, useRef, useState } from "react";

export default function RingGauge({ value, size = 132, label }: { value: number; size?: number; label: string }) {
  const [drawn, setDrawn] = useState(false);
  const [display, setDisplay] = useState(0);
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    const duration = 1200;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(step);
    };
    const raf2 = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [value]);

  const round = (n: number) => Math.round(n * 10) / 10;
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * 2 * Math.PI - Math.PI / 2;
    const len = i % 2 === 0 ? 5 : 3;
    const x1 = round(cx + (r + 6) * Math.cos(a));
    const y1 = round(cy + (r + 6) * Math.sin(a));
    const x2 = round(cx + (r + 6 + len) * Math.cos(a));
    const y2 = round(cy + (r + 6 + len) * Math.sin(a));
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={1.4} opacity={0.35} className="text-stone-600" />;
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ticks}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth={8} className="text-stone-800" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--vg-accent)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            filter: "drop-shadow(0 0 8px var(--vg-accent-soft))",
            transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)",
            strokeDashoffset: drawn ? 0 : circ,
          }}
        />
        <text x={cx} y={cy + 7} textAnchor="middle" className="vg-mono" fontSize={size * 0.26} fontWeight={700} fill="var(--vg-accent)">
          {display}
        </text>
      </svg>
      <span className="vg-mono text-[10px] uppercase tracking-wider text-stone-500">{label}</span>
    </div>
  );
}
