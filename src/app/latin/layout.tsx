import Link from "next/link";

export default function LatinLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#1c1712", color: "#f0e9df" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#332619", background: "#1c1712" }}
      >
        <Link href="/hub" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#d99a5c", opacity: 0.8 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide">Latin</span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
