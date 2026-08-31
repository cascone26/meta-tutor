"use client";

// next/dynamic's ssr:false option is only allowed from a Client Component, not directly
// inside the (server) rca/layout.tsx — this file exists purely to satisfy that constraint.
// See the comment in rca/layout.tsx for why RcaNotes needs ssr:false at all.
import dynamic from "next/dynamic";

const RcaNotes = dynamic(() => import("./RcaNotes"), { ssr: false });

export default function RcaNotesLoader() {
  return <RcaNotes />;
}
