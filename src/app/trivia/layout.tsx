import Link from "next/link";

export default function TriviaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: "#1a0f1f", color: "#f3e8ff" }}
    >
      <header
        className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: "#4a1872", background: "#1a0f1f" }}
      >
        <Link
          href="/"
          className="text-sm transition-opacity hover:opacity-100"
          style={{ color: "#f472b6", opacity: 0.8 }}
        >
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide">Trivia</span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
