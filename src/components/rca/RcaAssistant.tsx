"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getRcaClass } from "@/lib/rca";
import { BirdIcon } from "./NatureIcons";

type Message = { role: "user" | "assistant"; content: string };

// Persistent, always-available assistant for the whole /rca umbrella — lives in
// rca/layout.tsx so it survives navigation between the landing page and classes.
// Grounding is re-derived from the current page each time a message is sent, so
// switching classes mid-conversation naturally shifts context without losing history.
export default function RcaAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const slug = pathname.startsWith("/rca/") ? pathname.split("/")[2] : undefined;
  const cls = slug ? getRcaClass(slug) : undefined;
  const subjectId = cls?.id || "general";
  const subjectLabel = cls?.name || "all RCA classes";

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Both this panel and RcaNotes can be open at once — they anchor near the
  // same corner, so this panel (the rightmost of the two buttons) always
  // broadcasts its own open state; RcaNotes listens and shifts itself left
  // to sit beside this one instead of underneath it. Plain window event (same
  // pattern as EXPLAIN_DIFFERENTLY_EVENT elsewhere in the RCA station) rather
  // than lifting shared state into the layout.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rca-panel-change", { detail: { source: "assistant", open } }));
  }, [open]);

  function toggleOpen() {
    setOpen((v) => !v);
  }

  async function send(content: string) {
    if (!content.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: content.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/rca-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, subjectId }),
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
  }

  // /rca/today is a deliberately distraction-free work-day reference page
  // (Jacob, 2026-08-17: "no distractions, anything i could need if i need
  // quick peeks or reminders") — none of the floating tools belong there,
  // same reasoning as the old isHubShellRoute guard for Cris's course chrome.
  if (pathname === "/rca/today") return null;

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-30 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ width: 52, height: 52, background: "#3f7ea6", color: "#fff" }}
      >
        <BirdIcon size={22} />
      </button>

      {open && (
        <div
          className="fixed bottom-[76px] right-5 z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden"
          style={{ width: "min(360px, calc(100vw - 2.5rem))", maxHeight: "70vh", background: "#fbf8f0", border: "1px solid #d9e4d3" }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#e8f2f8", borderBottom: "1px solid #d9e4d3" }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#2f5e7a" }}>Lesson assistant</p>
              <p className="text-xs" style={{ color: "#6b8e6a" }}>Grounded in {subjectLabel}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "#6b8e6a" }} aria-label="Close">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 120 }}>
            {messages.length === 0 && (
              <p className="text-sm" style={{ color: "#8a9a7c" }}>
                Ask about pacing, activities, or anything you need to prep — I&apos;ll follow whatever class page you&apos;re on.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className="text-sm" style={{ color: m.role === "user" ? "#2f3a2a" : "#3a5a3a" }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide mr-1" style={{ color: "#8a9a7c" }}>
                  {m.role === "user" ? "You" : "Assistant"}
                </span>
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #d9e4d3" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
              placeholder="Ask the assistant…"
              className="flex-1 rounded-lg px-3 py-2 text-sm"
              style={{ background: "#fff", border: "1px solid #d9e4d3", color: "#2f3a2a" }}
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "#6b8e5a", color: "#fff" }}
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
