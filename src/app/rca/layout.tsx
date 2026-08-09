import Link from "next/link";
import RcaAssistant from "@/components/rca/RcaAssistant";
import { BirdIcon } from "@/components/rca/NatureIcons";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "linear-gradient(180deg, #dceefc 0%, #f4f1e6 55%, #eef2e2 100%)", color: "#33402c" }}
    >
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10 backdrop-blur"
        style={{ borderColor: "#d9e4d3", background: "rgba(232,242,248,0.9)" }}
      >
        <Link href="/hub" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#3f7ea6", opacity: 0.85 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide flex items-center gap-2" style={{ color: "#2f5e7a" }}>
          <BirdIcon size={16} />
          Regina Caeli · KSC
        </span>
        <span className="w-10" />
      </header>
      {children}
      <RcaAssistant />
    </div>
  );
}
