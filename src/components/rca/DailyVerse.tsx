import { LeafIcon } from "./NatureIcons";

// Short, traditional Catholic prayers and Scripture verses — public domain /
// traditional texts, not curriculum content, so no copyright concern. Picked
// deterministically by day-of-year so it's the same all day and changes daily,
// without needing any storage or server state.
const ENTRIES: { text: string; ref: string }[] = [
  { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23" },
  { text: "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end.", ref: "Glory Be" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "The fear of the Lord is the beginning of knowledge, but fools despise wisdom and instruction.", ref: "Proverbs 1:7" },
  { text: "Come, Holy Spirit, fill the hearts of Thy faithful, and kindle in them the fire of Thy love.", ref: "Prayer to the Holy Spirit" },
  { text: "This is the day that the Lord has made; let us rejoice and be glad in it.", ref: "Psalm 118:24" },
  { text: "Teach me knowledge and good judgment, for I trust your commands.", ref: "Psalm 119:66" },
  { text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord.", ref: "Grace Before Meals" },
  { text: "Whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely — think about such things.", ref: "Philippians 4:8" },
  { text: "Angel of God, my guardian dear, to whom His love commits me here, ever this day be at my side, to light and guard, to rule and guide.", ref: "Guardian Angel Prayer" },
  { text: "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.", ref: "Matthew 19:14" },
  { text: "In all your ways acknowledge Him, and He shall direct your paths.", ref: "Proverbs 3:6" },
];

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export default function DailyVerse() {
  const entry = ENTRIES[dayOfYear(new Date()) % ENTRIES.length];
  return (
    <div
      className="rounded-2xl px-5 py-3.5 mb-4 flex items-start gap-3"
      style={{ background: "rgba(253,250,244,0.8)", border: "1px solid #e8d9a0", backdropFilter: "blur(10px)" }}
    >
      <LeafIcon size={15} style={{ color: "#b8963a", marginTop: 3, flexShrink: 0 }} />
      <p className="text-sm italic leading-relaxed" style={{ color: "#5c6b52" }}>
        &ldquo;{entry.text}&rdquo; <span className="not-italic" style={{ color: "#b8963a" }}>— {entry.ref}</span>
      </p>
    </div>
  );
}
