"use client";

import { usePathname } from "next/navigation";
import BackLink from "@/components/rca/BackLink";

// The RCA header's back button always said "Hub" (going all the way out of
// RCA), even while already inside a specific class page — which then ALSO
// shows its own "Back to RCA"/"All RCA classes" pill in the body (see
// [slug]/page.tsx, today/page.tsx, week/page.tsx, substitute/page.tsx), so
// most RCA pages show two back buttons doing almost the same thing. Jacob,
// 2026-08-24: "the '< Hub' button is not needed and should only say that if
// im not in one of the class sections, if i am in a class section, that
// button should be replaced with the 'all rca classes' button." On the bare
// /rca hub itself, going further up (out to the main app Hub) is the only
// sensible "back"; anywhere deeper, "All RCA classes" — one level up — is
// the useful one.
export default function HeaderBackLink() {
  const pathname = usePathname();
  const atHub = pathname === "/rca";
  return atHub ? (
    <BackLink href="/">Hub</BackLink>
  ) : (
    <BackLink href="/rca">All RCA classes</BackLink>
  );
}
