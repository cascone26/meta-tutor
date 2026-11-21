import { Song } from "@/lib/guitar/songs";
import { chordById } from "@/lib/guitar/chords-data";
import ChordDiagram from "./ChordDiagram";

/** A readable lead-sheet style view of a song's structure — chord symbols grouped by
 *  section, plus a reference strip of every chord shape used. This is the "notes/sheet"
 *  complement to Play-Along's live metronome-driven mode: something to read before (or
 *  instead of) playing along in real time. */
export default function ChordSheet({ song }: { song: Song }) {
  const uniqueChordIds = [...new Set(song.progression)];

  return (
    <div className="max-w-md mx-auto px-5 py-6">
      <h2 className="text-lg font-semibold mb-1 text-center" style={{ color: "var(--g-text)" }}>{song.title}</h2>
      <p className="text-xs mb-5 text-center" style={{ color: "var(--g-muted)" }}>
        Key of {song.key} · {song.bpm} BPM · {song.beatsPerMeasure}/4 time · {song.difficulty}
      </p>

      {song.sections.map((section, i) => (
        <div key={i} className="g-card p-4 mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--g-muted)" }}>{section.label}</p>
          <div className="flex flex-wrap gap-2">
            {section.chords.map((chordId, j) => (
              <span
                key={j}
                className="text-sm font-bold px-3 py-1.5 rounded-lg"
                style={{ background: "var(--g-accent-wash)", color: "var(--g-accent-dark)", border: "1px solid var(--g-border)" }}
              >
                {chordId}
              </span>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs mt-5 mb-3" style={{ color: "var(--g-muted)" }}>{song.notes}</p>

      <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--g-muted)" }}>Chords used</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {uniqueChordIds.map((id) => {
          const chord = chordById(id);
          if (!chord) return null;
          return (
            <div key={id} className="text-center">
              <ChordDiagram chord={chord} size={0.75} />
              <p className="text-xs mt-0.5" style={{ color: "var(--g-text)" }}>{chord.display}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
