"use client";

import { useState, useRef, useEffect } from "react";
import { formatMarkdown } from "@/lib/sanitize-markdown";
import { ethicsTopics } from "@/lib/ethics-questions";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Generate 5 T/F questions on Human Action",
  "Is it true that Socrates denies incontinence?",
  "Explain vincible vs invincible ignorance — which removes culpability?",
  "Quiz me on antecedent vs consequent passions",
  "What's the difference between choice and consent?",
  "Is the Emotive Theory accepted or rejected in this course?",
];

export default function EthicsChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("ethics-tutor-chat");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    try { localStorage.setItem("ethics-tutor-chat", JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ethics-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      const STREAM_TIMEOUT = 30000;
      while (reader) {
        const readPromise = reader.read();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Stream timeout")), STREAM_TIMEOUT)
        );
        const { done, value } = await Promise.race([readPromise, timeoutPromise]);
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages([
                  ...newMessages,
                  { role: "assistant", content: assistantContent },
                ]);
              } else if (parsed.error) {
                setMessages([
                  ...newMessages,
                  { role: "assistant", content: "Sorry, something went wrong. Please try again." },
                ]);
              }
            } catch {
              // skip parse errors
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    try { localStorage.removeItem("ethics-tutor-chat"); } catch {}
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Ethics — T/F Exam Prep
        </span>
        <button
          onClick={clearChat}
          className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
          style={{ color: "var(--muted)" }}
          title="Clear chat"
          aria-label="Clear chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--accent-light)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--accent)" }}>
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>
              Ethics Study Assistant
            </h2>
            <p className="text-sm max-w-md mb-5" style={{ color: "var(--muted)" }}>
              Focused on T/F exam prep — ask for practice questions, check if a statement is true or false, or clarify any term or distinction.
            </p>

            {/* Topic filter chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-5 max-w-lg">
              {ethicsTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(topicFilter === t ? null : t)}
                  className="text-xs px-3 py-1 rounded-full transition-colors"
                  style={{
                    background: topicFilter === t ? "var(--accent)" : "var(--surface)",
                    color: topicFilter === t ? "#fff" : "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(
                    topicFilter ? prompt.replace(/on [\w &]+$/, `on ${topicFilter}`) : prompt
                  )}
                  className="text-left text-sm p-3.5 rounded-xl transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    background: "var(--surface)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                  style={{
                    background: m.role === "user" ? "var(--user-bubble)" : "var(--assistant-bubble)",
                    color: m.role === "user" ? "#fff" : "var(--foreground)",
                  }}
                >
                  {m.role === "assistant" ? (
                    <div className="prose" dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ background: "var(--assistant-bubble)" }}>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--accent)", animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="shrink-0 border-t p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask about any ethics topic, or request T/F practice questions..."
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--background)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="self-end rounded-xl px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-30"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
        <p className="text-center text-xs mt-2" style={{ color: "var(--muted)" }}>
          Answers grounded in your Ethics course notes
        </p>
      </div>
    </div>
  );
}
