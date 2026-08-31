"use client";

import { useEffect, useRef, useState } from "react";
import { formatMarkdown } from "@/lib/sanitize-markdown";

// Same floating-panel pattern as RcaAssistant (src/components/rca/RcaAssistant.tsx) —
// persistent bottom-right circle, opens a chat panel, streams from a Claude-backed
// route. This one is chess-specific: it's the real coach, distinct from the "Hint"
// button (which just draws an arrow to the engine's best move). The coach is given
// ground-truth engine context per move but is instructed to teach toward the answer
// via questions rather than state it immediately.
export type CoachContext = {
  fenBefore: string;
  san: string;
  moveNumber: number;
  color: "w" | "b";
  phase: string;
  classification: string;
  cpLoss: number | null;
  bestMoveSan?: string | null;
  openingName?: string | null;
};

type Message = { role: "user" | "assistant"; content: string };

function contextKey(c: CoachContext | null): string {
  return c ? `${c.moveNumber}-${c.color}-${c.san}` : "general";
}

export default function CoachChat({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: CoachContext | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const activeKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Fresh flagged move (or first open in general mode) -> reset the thread and have
  // the coach open with a question, not a lecture.
  useEffect(() => {
    if (!open) return;
    const key = contextKey(context);
    if (activeKeyRef.current === key) return;
    activeKeyRef.current = key;
    setMessages([]);
    if (context) {
      send(`I just played ${context.san} on move ${context.moveNumber}. Help me understand what happened.`, context, []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, context]);

  async function send(content: string, ctxForApi: CoachContext | null = context, baseMessages: Message[] = messages) {
    if (!content.trim() || loading) return;
    const next = [...baseMessages, { role: "user" as const, content: content.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chess-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: ctxForApi }),
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
              console.error("Coach stream error:", parsed.error);
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

  if (!open) return null;

  return (
    <div
      className="fixed bottom-[76px] right-5 z-30 flex flex-col rounded-2xl shadow-xl overflow-hidden"
      style={{ width: "min(360px, calc(100vw - 2.5rem))", maxHeight: "70vh", background: "#182620", border: "1px solid #24382c" }}
    >
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#0f1a14", borderBottom: "1px solid #24382c" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#e0e8e2" }}>Chess coach</p>
          <p className="text-xs" style={{ color: "#8fae9a" }}>
            {context ? `Talking through move ${context.moveNumber} (${context.san})` : "Ask about anything on the board"}
          </p>
        </div>
        <button onClick={onClose} className="text-sm" style={{ color: "#8fae9a" }} aria-label="Close">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 120 }}>
        {messages.length === 0 && (
          <p className="text-sm" style={{ color: "#6f8a79" }}>
            Ask about the position, an opening idea, or a mistake you want to understand — I&apos;ll ask questions and help
            you work it out rather than just hand you the answer.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="text-sm" style={{ color: m.role === "user" ? "#e0e8e2" : "#9fd4ac" }}>
            <span className="text-[10px] font-semibold uppercase tracking-wide mr-1" style={{ color: "#6f8a79" }}>
              {m.role === "user" ? "You" : "Coach"}
            </span>
            {m.role === "assistant" ? (
              <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }} />
            ) : (
              <span className="whitespace-pre-wrap">{m.content}</span>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 p-3" style={{ borderTop: "1px solid #24382c" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
          placeholder="Ask the coach…"
          className="flex-1 rounded-lg px-3 py-2 text-sm"
          style={{ background: "#0f1a14", border: "1px solid #24382c", color: "#e0e8e2" }}
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ background: "#3f6b4f", color: "#fff" }}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
