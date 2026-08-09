"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function RcaLessonChat({ subjectId, subjectName }: { subjectId: string; subjectName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            // skip parse errors on partial chunks
          }
        }
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went wrong — try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl p-4" style={{ background: "#1a2138", border: "1px solid #2a3350" }}>
      <h2 className="text-sm font-semibold mb-2">Lesson prep assistant</h2>
      <p className="text-xs mb-3" style={{ color: "#8a8060" }}>
        Grounded in {subjectName}&apos;s curriculum context. Ask about pacing, activities, or how to explain something.
      </p>

      {messages.length > 0 && (
        <div className="space-y-3 mb-3 max-h-80 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="text-sm" style={{ color: m.role === "user" ? "#eee6cf" : "#c7bd97" }}>
              <span className="text-xs font-semibold uppercase tracking-wide mr-1" style={{ color: "#7d7455" }}>
                {m.role === "user" ? "You" : "Assistant"}
              </span>
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
          placeholder="e.g. help me prep this week's lesson"
          className="flex-1 rounded-lg px-3 py-2 text-sm"
          style={{ background: "#12182a", border: "1px solid #2a3350", color: "#eee6cf" }}
          disabled={loading}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          style={{ background: "#c9a227", color: "#12182a" }}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
