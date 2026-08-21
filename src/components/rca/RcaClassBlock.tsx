import Link from "next/link";
import { rcaContent } from "@/lib/rca-content";
import PacedLesson from "@/components/rca/PacedLesson";

// The "key points" block is the whole point of /rca/today and /rca/week —
// deliberately the most visually distinct section on each card, since it's what
// Jacob said he'd copy straight onto a physical whiteboard before students
// arrive. Shared between both pages (today = just today, week = Monday +
// Thursday together) so a pacing fix in one place doesn't drift from the other.
export default function RcaClassBlock({ classId, name, block, room, weekday }: { classId: string; name: string; block?: string; room?: string; weekday: string }) {
  const content = rcaContent[classId];

  return (
    <div className="rounded-2xl p-4" style={{ background: "rgba(251,248,240,0.75)", border: "1px solid #d9e4d3" }}>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold" style={{ color: "#33402c" }}>{name}</h3>
        <Link href={`/rca/${classId}`} className="text-xs shrink-0 print:hidden" style={{ color: "#3f7ea6" }}>Full page →</Link>
      </div>
      <p className="text-sm mb-3" style={{ color: "#3f7ea6" }}>
        {block}{room && <span style={{ color: "#8a9a7c" }}> · {room}</span>}
      </p>

      {!content ? (
        <p className="text-sm" style={{ color: "#8a9a7c" }}>No lesson content on file for this class yet.</p>
      ) : (
        <PacedLesson classId={classId} content={content} weekday={weekday} />
      )}
    </div>
  );
}
