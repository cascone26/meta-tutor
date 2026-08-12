import Link from "next/link";
import RcaAssistant from "@/components/rca/RcaAssistant";
import RcaStaleBanner from "@/components/rca/RcaStaleBanner";
import { BirdIcon } from "@/components/rca/NatureIcons";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full overflow-y-auto relative"
      style={{
        background:
          "linear-gradient(180deg, #9fd0f2 0%, #c3e4f7 10%, #e3f1fa 22%, #f8f6ee 36%, #f5f0dd 48%, #eef1d8 60%, #dde8bd 74%, #c3d9a0 88%, #a9c483 100%)",
        color: "#33402c",
      }}
    >
      {/* Atmosphere — soft drifting cloud/foliage blur, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 340, height: 180, top: "4%", left: "8%", background: "radial-gradient(ellipse, #ffffffaa 0%, transparent 70%)", filter: "blur(30px)", animation: "drift 40s linear infinite alternate" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed rounded-full"
        style={{ width: 260, height: 140, top: "9%", right: "12%", background: "radial-gradient(ellipse, #ffffff88 0%, transparent 70%)", filter: "blur(26px)", animation: "drift 55s linear infinite alternate-reverse" }}
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
