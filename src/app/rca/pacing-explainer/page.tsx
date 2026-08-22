import BackLink from "@/components/rca/BackLink";
import { LeafIcon } from "@/components/rca/NatureIcons";
import CopyTextButton from "@/components/rca/CopyTextButton";

// A copyable explainer for the "why is my kid on lesson X" question — pasted
// into an email, not a shareable link, since everything under /rca requires
// Jacob's own RCA login and parents can't get in here. Describes the REAL
// mechanics (pacing estimate + his own manual corrections), nothing invented.
export default function PacingExplainerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-8">
        <BackLink href="/rca" size="xs">Back to RCA</BackLink>

        <div style={{ animation: "fadeUpIn 0.6s cubic-bezier(0.16,1,0.3,1) both" }} className="mt-4 mb-6 flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
              <LeafIcon size={24} style={{ color: "#6b8e5a" }} />
              Explaining pacing to a parent
            </h1>
            <p className="text-sm" style={{ color: "#5c6b52" }}>
              Copy this into an email if a parent asks "why is my child on lesson X" — describes how you actually track pacing, not a guess.
            </p>
          </div>
          <CopyTextButton targetId="pacing-explainer-text" />
        </div>

        <div id="pacing-explainer-text" className="rounded-2xl p-5 text-sm space-y-3" style={{ background: "#fbf8f0", border: "1px solid #d9e4d3", color: "#3a4a34" }}>
          <p>
            I keep a running estimate of which lesson each subject should be on, based on our real
            class calendar (accounting for breaks and closures). After every class, I can confirm the
            actual lesson we covered, so the estimate stays accurate to what really happened in the
            room — not just a fixed formula that assumes nothing ever changes pace.
          </p>
          <p>
            If a lesson number looks off from what you expect, it&apos;s worth asking me directly — it
            could mean we spent extra time on a topic, had a shorter class that week, or I simply
            haven&apos;t confirmed the latest session yet. I&apos;m always happy to clarify exactly where
            we are.
          </p>
        </div>
      </div>
    </div>
  );
}
