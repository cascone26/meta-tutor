"use client";

import { useState, useRef, useEffect } from "react";
import { glossary, categories } from "@/lib/glossary";
import { recordStudySession } from "@/lib/streaks";

type Message = { role: "user" | "assistant"; content: string };

export default function SocraticDialogue({ onBack }: { onBack: () => void }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const pool = selectedCat ? glossary.filter((g) => g.category === selectedCat) : glossary;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function pickTopic(term?: string) {
    const t = term || pool[Math.floor(Math.random() * pool.length)].term;
    setTopic(t);
    setMessages([]);
    setInput("");
    recordStudySession();

    // Start the Socratic questioning
    startDialogue(t);
  }

  async function startDialogue(term: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/socratic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, messages: [] }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.question }]);
    } catch {
      setMessages([{ role: "assistant", content: "Let's begin. What can you tell me about this concept?" }]);
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
      const res = await fetch("/api/socratic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: topic, messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.question }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Interesting. Can you elaborate on that further?" }]);
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
            <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>Socratic Dialogue</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            The AI only asks questions — never explains. You must reason your way to the answer.
          </p>

          <div className="flex gap-1.5 flex-wrap mb-4">
            <button onClick={() => setSelectedCat(null)} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: !selectedCat ? "var(--accent)" : "var(--surface)", color: !selectedCat ? "#fff" : "var(--muted)", border: `1px solid ${!selectedCat ? "var(--accent)" : "var(--border)"}` }}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCat(cat)} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: selectedCat === cat ? "var(--accent)" : "var(--surface)", color: selectedCat === cat ? "#fff" : "var(--muted)", border: `1px solid ${selectedCat === cat ? "var(--accent)" : "var(--border)"}` }}>{cat}</button>
            ))}
          </div>

          <div className="rounded-xl p-5 mb-4 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>Pick a concept or let Socrates choose.</p>
            <button onClick={() => pickTopic()} className="px-5 py-2 rounded-lg text-sm font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
              Random topic
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {pool.slice(0, 20).map((g) => (
              <button
                key={g.term}
                onClick={() => pickTopic(g.term)}
                className="text-left rounded-lg p-2.5 text-xs transition-all"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {g.term}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setTopic(null)} className="text-sm" style={{ color: "var(--muted)" }}>&larr;</button>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{topic}</h2>
              <p className="text-xs" style={{ color: "var(--accent)" }}>Socratic Dialogue</p>
            </div>
          </div>
          <button onClick={() => pickTopic()} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>New topic</button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="rounded-xl px-3.5 py-2.5 max-w-[85%] text-sm"
                style={{
                  background: msg.role === "user" ? "var(--user-bubble)" : "var(--assistant-bubble)",
                  color: msg.role === "user" ? "#fff" : "var(--foreground)",
                  lineHeight: 1.6,
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-3.5 py-2.5 text-sm" style={{ background: "var(--assistant-bubble)", color: "var(--muted)" }}>
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Reason through your answer..."
            rows={1}
            className="flex-1 rounded-lg px-3 py-2 text-sm resize-none"
            style={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-lg text-sm font-medium shrink-0"
            style={{ background: input.trim() ? "var(--accent)" : "var(--border)", color: input.trim() ? "#fff" : "var(--muted)" }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}
