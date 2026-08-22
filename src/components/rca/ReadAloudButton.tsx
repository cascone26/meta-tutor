"use client";

import { useState, useEffect } from "react";

// Reads whatever's actually rendered inside the target element via the
// browser's built-in speech synthesis — no server call, no API cost, and it
// always matches what's on screen (including the pacing-corrected lesson
// content) since it reads the live DOM rather than re-deriving the data.
// For the drive-in / hands-free-morning-review use case.
export default function ReadAloudButton({ targetId }: { targetId: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const el = document.getElementById(targetId);
    const text = el?.innerText?.trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs px-3 py-1.5 rounded-full border shrink-0"
      style={{ borderColor: "#bcd6e6", color: "#2f5e7a", background: "rgba(255,255,255,0.55)" }}
    >
      {speaking ? "Stop ■" : "Read aloud →"}
    </button>
  );
}
