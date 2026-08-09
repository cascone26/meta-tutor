import Link from "next/link";

export default function ChessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#0f1a14", color: "#e8f0ea" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#1f3327", background: "#0f1a14" }}
      >
        <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#6fae82", opacity: 0.8 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide">Chess</span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
