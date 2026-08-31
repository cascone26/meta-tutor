import Link from "next/link";

export default function LearnerProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto" style={{ background: "#12141c", color: "#e8e6f0" }}>
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#2a2d3d", background: "#12141c" }}
      >
        <Link href="/" className="text-sm transition-opacity hover:opacity-100" style={{ color: "#8a9bd8", opacity: 0.85 }}>
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "#8a9bd8" }}>
          Learning Profile
        </span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
