import Link from "next/link";

export default function VeritasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-stone-950 text-stone-200">
      <header className="flex items-center justify-between px-5 py-3 border-b border-stone-800 bg-stone-950 sticky top-0 z-10">
        <Link href="/" className="text-sm text-amber-600/85 hover:text-amber-500 transition-colors">
          ← Hub
        </Link>
        <span className="text-sm font-semibold tracking-wide text-amber-500">Veritas</span>
        <span className="w-10" />
      </header>
      {children}
    </div>
  );
}
