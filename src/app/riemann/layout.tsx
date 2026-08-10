import Link from "next/link";
import RiemannAssistant from "@/components/riemann/RiemannAssistant";
import { ZeroLineIcon } from "@/components/riemann/ZeroLineIcon";

export default function RiemannLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#141a2e", color: "#e6e6f0" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#2a3358", background: "#141a2e" }}
      >
        <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#e0c07a", opacity: 0.85 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide flex items-center gap-2" style={{ color: "#e0c07a" }}>
          <ZeroLineIcon size={16} />
          Riemann Hypothesis
        </span>
        <span className="w-10" />
      </header>
      {children}
      <RiemannAssistant />
    </div>
  );
}
