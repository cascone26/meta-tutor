"use client";

import { useState, useEffect } from "react";

const KEY = "meta-tutor-show-prayer";

const prayer = `Creator of all things,
true Source of light and wisdom,
origin of all being,
graciously let a ray of Your light penetrate
the darkness of my understanding.

Take from me the double darkness
in which I have been born,
an obscurity of sin and ignorance.

Give me a keen understanding,
a retentive memory, and
the ability to grasp things correctly and fundamentally.

Grant me the talent of being exact in my explanations
and the ability to express myself
with thoroughness and charm.

Point out the beginning,
direct the progress,
and help in the completion.

I ask this through Jesus Christ our Lord.

Amen.`;

export default function Prayer() {
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const pref = localStorage.getItem(KEY);
    if (pref === "false") {
      setEnabled(false);
      return;
    }
    // Show once per session
    const shown = sessionStorage.getItem("meta-tutor-prayer-shown");
    if (!shown) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem("meta-tutor-prayer-shown", "true");
  }

  function disablePrayer() {
    localStorage.setItem(KEY, "false");
    setEnabled(false);
    setShow(false);
  }

  if (!show || !enabled) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative z-10 rounded-xl p-6 w-full max-w-md shadow-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="text-center mb-4">
          <p className="text-xs font-medium tracking-wider uppercase mb-1" style={{ color: "var(--accent)" }}>
            Before you begin
          </p>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Prayer of St. Thomas Aquinas
          </h2>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Before Study</p>
        </div>

        <div
          className="rounded-lg p-4 mb-4"
          style={{ background: "var(--background)", border: "1px solid var(--border)" }}
        >
          <p
            className="text-sm italic leading-relaxed text-center whitespace-pre-line"
            style={{ color: "var(--foreground)" }}
          >
            {prayer}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={dismiss}
            className="px-6 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Begin studying
          </button>
          <button
            onClick={disablePrayer}
            className="text-xs"
            style={{ color: "var(--muted)" }}
          >
            Don&apos;t show this again
          </button>
        </div>
      </div>
    </div>
  );
}
