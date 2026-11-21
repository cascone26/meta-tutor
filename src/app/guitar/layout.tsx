import GuitarNav from "@/components/guitar/GuitarNav";

// Scoped warm "wood & strings" theme for the whole Guitar subject — deliberately distinct
// from the generic --surface/--accent tokens used elsewhere, so this feels like a dedicated
// instrument-practice app rather than another flat utility page. Lives entirely in this
// layout (not globals.css) so it never touches Cris's or any other subject's styling.
export default function GuitarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="guitar-scope w-full h-full overflow-y-auto relative">
      <style>{`
        .guitar-scope {
          --g-bg: #fdf7ee;
          --g-bg2: #f3e2c4;
          --g-nav-bg: rgba(253,247,238,0.82);
          --g-surface: #fffaf1;
          --g-surface-2: #fbf0da;
          --g-border: #e8d6ae;
          --g-accent: #b8793a;
          --g-accent-dark: #8a5a28;
          --g-accent-wash: rgba(184,121,58,0.12);
          --g-text: #2b2015;
          --g-muted: #8a7a5f;
          --g-success: #5f8f55;
          --g-success-wash: rgba(95,143,85,0.14);
          --g-danger: #b8503f;
          --g-danger-wash: rgba(184,80,63,0.12);
          --g-shadow: 0 10px 30px -12px rgba(120,80,30,0.25);
          background: radial-gradient(ellipse 130% 60% at 50% -10%, var(--g-bg2) 0%, var(--g-bg) 65%);
          color: var(--g-text);
        }
        html.dark .guitar-scope {
          --g-bg: #18120c;
          --g-bg2: #251a0f;
          --g-nav-bg: rgba(24,18,12,0.82);
          --g-surface: #231a11;
          --g-surface-2: #2c2015;
          --g-border: #3d2d1a;
          --g-accent: #d9a05c;
          --g-accent-dark: #eec289;
          --g-accent-wash: rgba(217,160,92,0.16);
          --g-text: #f3e8d8;
          --g-muted: #a8937a;
          --g-success: #7fae6f;
          --g-success-wash: rgba(127,174,111,0.18);
          --g-danger: #d97a68;
          --g-danger-wash: rgba(217,122,104,0.16);
          --g-shadow: 0 10px 30px -12px rgba(0,0,0,0.5);
        }
        .guitar-scope .g-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9999px;
          color: var(--g-muted); transition: background 0.15s ease, color 0.15s ease;
        }
        .guitar-scope .g-icon-btn:hover { background: var(--g-accent-wash); color: var(--g-accent-dark); }
        .guitar-scope .g-card {
          background: var(--g-surface);
          border: 1px solid var(--g-border);
          border-radius: 1rem;
        }
        .guitar-scope .g-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
          border-radius: 9999px; font-weight: 600; font-size: 0.875rem;
          padding: 0.65rem 1.4rem; color: #fff;
          background: linear-gradient(135deg, var(--g-accent) 0%, var(--g-accent-dark) 100%);
          box-shadow: var(--g-shadow); transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .guitar-scope .g-btn:hover { transform: translateY(-1px); }
        .guitar-scope .g-btn:active { transform: translateY(0); }
        .guitar-scope .g-btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
          border-radius: 9999px; font-weight: 600; font-size: 0.8rem;
          padding: 0.5rem 1.1rem; color: var(--g-accent-dark);
          background: var(--g-accent-wash); border: 1px solid var(--g-border);
          transition: transform 0.15s ease;
        }
        .guitar-scope .g-btn-ghost:hover { transform: translateY(-1px); }
        .guitar-scope input[type="range"] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 6px; border-radius: 9999px;
          background: var(--g-border); outline: none; accent-color: var(--g-accent);
        }
        .guitar-scope input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--g-accent); border: 2px solid var(--g-surface);
          box-shadow: var(--g-shadow); cursor: pointer;
        }
        .guitar-scope input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%; border: none;
          background: var(--g-accent); box-shadow: var(--g-shadow); cursor: pointer;
        }
        .guitar-scope input[type="range"]::-moz-range-track {
          height: 6px; border-radius: 9999px; background: var(--g-border);
        }
      `}</style>

      {/* Ambient warm glow — subtle, matches the hub's floating-orb motif at low opacity */}
      <div aria-hidden className="pointer-events-none fixed rounded-full" style={{ width: 360, height: 360, top: "-6%", left: "4%", background: "radial-gradient(circle, var(--g-accent-wash) 0%, transparent 70%)", filter: "blur(50px)", animation: "floatSlow 16s ease-in-out infinite" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full" style={{ width: 300, height: 300, bottom: "-4%", right: "6%", background: "radial-gradient(circle, var(--g-accent-wash) 0%, transparent 70%)", filter: "blur(55px)", animation: "floatSlower 20s ease-in-out infinite" }} />

      <GuitarNav />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
