import Link from "next/link";
import { ChevronIcon } from "@/components/rca/NatureIcons";

// Shared "back" pill button — used by the header Hub link, the class-page
// "All RCA classes" link, and the Today page's "Back to RCA" link. Pure
// Tailwind hover (no onMouseEnter/Leave) so it works from both server and
// client components without forcing a "use client" boundary just for a
// hover glow.
export default function BackLink({ href, children, size = "sm" }: { href: string; children: React.ReactNode; size?: "sm" | "xs" }) {
  const isSm = size === "sm";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1 font-medium rounded-full border border-[#bcd6e6] text-[#2f5e7a] bg-white/55 hover:bg-white/85 hover:border-[#3f7ea6] shadow-[0_1px_2px_rgba(63,126,166,0.12)] hover:shadow-[0_2px_10px_rgba(63,126,166,0.28)] transition-all duration-200 ${
        isSm ? "text-sm pl-2 pr-3 py-1.5" : "text-xs pl-2 pr-2.5 py-1"
      }`}
    >
      <ChevronIcon size={isSm ? 13 : 12} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}
