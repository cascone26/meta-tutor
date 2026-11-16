"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { DOUBT_TRACKS } from "@/data/veritas/doubt-tracks";

export default function VeritasDount() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedTrack = selected ? DOUBT_TRACKS.find((t) => t.slug === selected) : null;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="When You Doubt"
        subtitle="Pastoral guidance for ten common struggles"
        icon="🙏"
      />
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="px-6 py-4">
            <div className="mb-4 text-sm text-stone-500">
              Pick a struggle. Read the opening. Work through the readings and practice.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {DOUBT_TRACKS.map((track) => (
                <button
                  key={track.slug}
                  onClick={() => setSelected(track.slug)}
                  className="rounded-lg border border-stone-800 bg-stone-900 p-4 text-left transition-colors hover:border-stone-700 hover:bg-stone-800"
                >
                  <h3 className="font-semibold text-stone-100">{track.label}</h3>
                  <p className="mt-1 text-xs text-stone-500">{track.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : selectedTrack ? (
          <div className="space-y-6 px-6 py-4">
            <div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-amber-600 hover:text-amber-500"
              >
                ← Back to all
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-stone-100">{selectedTrack.label}</h2>
              <p className="mt-2 text-sm text-stone-400">{selectedTrack.description}</p>
            </div>

            <div className="space-y-2 rounded-lg bg-stone-900 border border-stone-800 p-4">
              <div className="text-xs uppercase text-stone-600">The Answer</div>
              <p className="text-sm leading-relaxed text-stone-300">{selectedTrack.opening}</p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-stone-200">Readings</h3>
              <ul className="space-y-2">
                {selectedTrack.readings.map((reading, i) => (
                  <li key={i} className="text-sm text-stone-400">
                    • {reading}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-stone-200">Scripture</h3>
              <ul className="space-y-2">
                {selectedTrack.scripture.map((verse, i) => (
                  <li key={i} className="text-sm text-stone-400">
                    • {verse}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-stone-200">What to Do</h3>
              <div className="rounded-lg bg-stone-900 border border-stone-800 p-4">
                <p className="text-sm text-stone-400">{selectedTrack.practice}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-stone-200">A Saint Who Walked This Road</h3>
              <div className="rounded-lg bg-stone-900 border border-stone-800 p-4">
                <p className="font-medium text-stone-200">{selectedTrack.saint.name}</p>
                <p className="mt-2 text-sm text-stone-400">{selectedTrack.saint.why}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
