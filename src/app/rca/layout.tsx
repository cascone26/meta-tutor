import Link from "next/link";
import RcaAssistant from "@/components/rca/RcaAssistant";
import RcaStaleBanner from "@/components/rca/RcaStaleBanner";
import { BirdIcon } from "@/components/rca/NatureIcons";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full overflow-y-auto relative"
      style={{
        // backgroundAttachment: "local" is the actual fix here — without it, the
        // gradient is pinned to the visible viewport frame of this scrolling box
        // (CSS's default "scroll" attachment) and never visibly progresses as you
        // scroll. "local" makes it scroll WITH the content across its full height,
        // so you genuinely travel from sky-blue to earthy-green as you scroll down.
        //
        // Stops are banded on purpose, not evenly spaced — real horizons don't
        // fade sky into ground across the whole scene, sky holds its color for a
        // stretch, then there's a genuinely quick crossover band, then ground
        // holds its color. This mimics that instead of one long even blend.
        background:
          "linear-gradient(180deg, #8ec8ef 0%, #9fd0f2 20%, #a8d4f0 40%, #bfe0e6 48%, #ddeadb 54%, #e8edc6 60%, #d3dfa6 66%, #b3cc84 78%, #96b56a 90%, #82a259 100%)",
        backgroundAttachment: "local",
        color: "#33402c",
      }}
    >
      {/* Atmosphere — soft drifting cloud/foliage blur, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 340, height: 180, top: "4%", left: "8%", background: "radial-gradient(ellipse, #ffffffaa 0%, transparent 70%)", filter: "blur(30px)", animation: "drift 40s linear infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 260, height: 140, top: "9%", right: "12%", background: "radial-gradient(ellipse, #ffffff88 0%, transparent 70%)", filter: "blur(26px)", animation: "drift 55s linear infinite reverse" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 420, height: 420, bottom: "-8%", left: "-6%", background: "radial-gradient(circle, #6b8e5a3a 0%, transparent 70%)", filter: "blur(70px)", animation: "floatSlow 22s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 360, height: 360, bottom: "2%", right: "-4%", background: "radial-gradient(circle, #8a6a3a2e 0%, transparent 70%)", filter: "blur(70px)", animation: "floatSlower 26s ease-in-out infinite" }}
      />

      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10 backdrop-blur"
        style={{ borderColor: "#d9e4d3", background: "rgba(232,242,248,0.75)" }}
      >
        <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#3f7ea6", opacity: 0.85 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <BirdIcon size={16} />
          Regina Caeli · KSC
        </span>
        <span className="w-10" />
      </header>
      <RcaStaleBanner />
      <div className="relative z-[1]">{children}</div>
      <RcaAssistant />
    </div>
  );
}
