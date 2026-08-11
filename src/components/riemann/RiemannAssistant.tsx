"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ZeroLineIcon } from "./ZeroLineIcon";
import { EXPLAIN_DIFFERENTLY_EVENT } from "./RiemannLessonViewer";

const PROGRESS_KEY = "riemann-lesson-progress";

type Message = { role: "user" | "assistant"; content: string };

// Persistent floating assistant for the /riemann station — lives in riemann/layout.tsx.
// Re-reads the current lesson number from localStorage each send, same "re-derive fresh"
// pattern as RcaAssistant re-deriving subjectId from the pathname.
export default function RiemannAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;
    const lessonN = Number(localStorage.getItem(PROGRESS_KEY)) || 1;
    const next = [...messages, { role: "user" as const, content: content.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/riemann-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lessonN }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages([...next, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              setMessages([...next, { role: "assistant", content: assistantContent }]);
            } else if (parsed.error) {
              setMessages([...next, { role: "assistant", content: "Something went wrong — try again." }]);
            }
          } catch {
            // partial chunk, skip
          }
        }
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went wrong — try again." }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  useEffect(() => {
    function onExplainDifferently() {
      setOpen(true);
      send("Can you explain this lesson's core idea a different way — a new analogy or angle? The current explanation isn't clicking.");
    }
    window.addEventListener(EXPLAIN_DIFFERENTLY_EVENT, onExplainDifferently);
    return () => window.removeEventListener(EXPLAIN_DIFFERENTLY_EVENT, onExplainDifferently);
  }, [send]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-30 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ width: 52, height: 52, background: "#c9a24d", color: "#141a2e" }}
      >
        <ZeroLineIcon size={22} />
      </button>

      {open && (
        <div
          className="fixed bottom-[76px] right-5 z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden"
          style={{ width: "min(360px, calc(100vw - 2.5rem))", maxHeight: "70vh", background: "#1c2440", border: "1px solid #2a3358" }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#232c52", borderBottom: "1px solid #2a3358" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#e0c07a" }}>RH tutor</p>
              <p className="text-xs" style={{ color: "#8b93c4" }}>Grounded in your current lesson</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "#8b93c4" }} aria-label="Close">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 120 }}>
            {messages.length === 0 && (
              <p className="text-sm" style={{ color: "#8b93c4" }}>
                Ask about anything on the current lesson, or go deeper on something earlier — I&apos;ll follow whatever lesson you&apos;re on.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className="text-sm" style={{ color: m.role === "user" ? "#e6e6f0" : "#cdd2ec" }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide mr-1" style={{ color: "#8b93c4" }}>
                  {m.role === "user" ? "You" : "Tutor"}
                </span>
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #2a3358" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
              placeholder="Ask the tutor…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "#141a2e", border: "1px solid #2a3358", color: "#e6e6f0" }}
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "#4a5a9a", color: "#fff" }}
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
