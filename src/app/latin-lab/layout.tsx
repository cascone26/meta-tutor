import Link from "next/link";

export default function LatinLabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#1a1410", color: "#f0e6d8" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#3a2d1f", background: "#1a1410" }}
      >
        <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#c17a3a", opacity: 0.85 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "#c17a3a" }}>
          Latin Lab
        </span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
