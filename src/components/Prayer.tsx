"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div
        className="fixed inset-0"
        style={{ background: "rgba(44, 40, 37, 0.5)", backdropFilter: "blur(8px)" }}
      />
      <div
        className="relative z-10 rounded-2xl p-8 w-full max-w-md"
        style={{
          background: "var(--prayer-bg)",
          border: "1px solid var(--prayer-border)",
          boxShadow: "var(--shadow-lg), 0 0 80px rgba(184, 150, 58, 0.06)",
        }}
      >
        <div className="flex justify-center mb-4">
          <Image
            src="/chi-rho.png"
            alt=""
            width={36}
            height={36}
            className="opacity-30 dark:invert dark:opacity-20"
          />
        </div>

        <div className="text-center mb-5">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-1.5"
            style={{ color: "var(--prayer)", letterSpacing: "0.15em" }}
          >
            Before you begin
          </p>
          <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Prayer of St. Thomas Aquinas
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Before Study</p>
        </div>

        <div
          className="rounded-xl p-5 mb-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--prayer-border)",
          }}
        >
          <p
            className="text-sm italic leading-[1.85] text-center whitespace-pre-line"
            style={{ color: "var(--foreground)" }}
          >
            {prayer}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={dismiss}
            className="px-8 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--prayer)", color: "#fff" }}
          >
            Begin studying
          </button>
          <button
            onClick={disablePrayer}
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            Don&apos;t show this again
          </button>
        </div>
      </div>
    </div>
  );
}
