"use client";

import { useState, useRef, useEffect } from "react";
import { recordStudySession } from "@/lib/streaks";

type Message = { role: "user" | "assistant"; content: string };

const debateTopics = [
  { id: 1, title: "Plato's Forms exist as a separate realm", side: "for", philosopher: "Plato" },
  { id: 2, title: "Forms can only exist within material substances", side: "for", philosopher: "Aristotle" },
  { id: 3, title: "Prime matter can exist independently of form", side: "for", philosopher: "Metaphysics" },
  { id: 4, title: "The principle of non-contradiction is self-evident and cannot be proved", side: "for", philosopher: "Thomism" },
  { id: 5, title: "Materialistic reductionism can fully explain reality", side: "for", philosopher: "Positions" },
  { id: 6, title: "Radical monism — all plurality is illusion", side: "for", philosopher: "Positions" },
  { id: 7, title: "Analogy is necessary for metaphysical concepts (univocity fails)", side: "for", philosopher: "Concepts" },
  { id: 8, title: "Potency is a real principle, not merely a logical concept", side: "for", philosopher: "Thomism" },
  { id: 9, title: "The human soul is the substantial form of the body", side: "for", philosopher: "Thomism" },
  { id: 10, title: "Effect-to-cause reasoning is more valuable than cause-to-effect in metaphysics", side: "for", philosopher: "Aristotle" },
];

export default function Debate({ onBack }: { onBack: () => void }) {
  const [topic, setTopic] = useState<typeof debateTopics[0] | null>(null);
  const [userSide, setUserSide] = useState<"for" | "against">("for");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function startDebate(t: typeof debateTopics[0], side: "for" | "against") {
    setTopic(t);
    setUserSide(side);
    setMessages([]);
    setLoading(true);
    recordStudySession();

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t.title, aiSide: side === "for" ? "against" : "for", messages: [] }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.argument }]);
    } catch {
      setMessages([{ role: "assistant", content: "I'll argue the opposite position. Make your opening argument." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !topic || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.title, aiSide: userSide === "for" ? "against" : "for", messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.argument }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "That's an interesting point. However, consider this counter-argument..." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!topic) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={onBack} className="text-sm" style={{ color: "var(--muted)" }}>&larr; Back</button>
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Debate</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Pick a position. The AI argues the opposite. Defend your understanding.
          </p>

          <div className="space-y-2">
            {debateTopics.map((t) => (
              <div key={t.id} className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>{t.philosopher}</span>
                </div>
                <p className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>{t.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startDebate(t, "for")}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "#6ab07018", color: "#6ab070", border: "1px solid #6ab07040" }}
                  >Argue FOR</button>
                  <button
                    onClick={() => startDebate(t, "against")}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "#c96b6b18", color: "#c96b6b", border: "1px solid #c96b6b40" }}
                  >Argue AGAINST</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setTopic(null)} className="text-sm" style={{ color: "var(--muted)" }}>&larr;</button>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{topic.title}</h2>
              <p className="text-xs">
                <span style={{ color: userSide === "for" ? "#6ab070" : "#c96b6b" }}>You: {userSide}</span>
                <span style={{ color: "var(--muted)" }}> vs </span>
                <span style={{ color: userSide === "for" ? "#c96b6b" : "#6ab070" }}>AI: {userSide === "for" ? "against" : "for"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="rounded-xl px-3.5 py-2.5 max-w-[85%] text-sm" style={{ background: msg.role === "user" ? "var(--user-bubble)" : "var(--assistant-bubble)", color: msg.role === "user" ? "#fff" : "var(--foreground)", lineHeight: 1.6 }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-3.5 py-2.5 text-sm" style={{ background: "var(--assistant-bubble)", color: "var(--muted)" }}>Thinking...</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Make your argument..."
            rows={1}
            className="flex-1 rounded-lg px-3 py-2 text-sm resize-none"
            style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} className="px-4 py-2 rounded-lg text-sm font-medium shrink-0" style={{ background: input.trim() ? "var(--accent)" : "var(--border)", color: input.trim() ? "#fff" : "var(--muted)" }}>Send</button>
        </div>
      </div>
    </div>
  );
}
