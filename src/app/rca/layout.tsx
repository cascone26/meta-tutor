import Link from "next/link";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#12182a", color: "#eee6cf" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#2a3350", background: "#12182a" }}
      >
        <Link href="/hub" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#c9a227", opacity: 0.8 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide">Regina Caeli · KSC</span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
