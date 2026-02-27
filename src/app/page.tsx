"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { questions } from "@/lib/questions";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Mode = "study" | "quiz";

export default function Home() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}

function ChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("study");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confidence, setConfidence] = useState<Record<number, "got-it" | "shaky" | "no-clue">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle ?q= param from glossary links
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      sendMessage(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load confidence from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-confidence");
      if (saved) setConfidence(JSON.parse(saved));
    } catch {}
  }, []);

  function setConfidenceLevel(qId: number, level: "got-it" | "shaky" | "no-clue") {
    setConfidence((prev) => {
      const next = { ...prev };
      if (next[qId] === level) {
        delete next[qId];
      } else {
        next[qId] = level;
      }
      localStorage.setItem("meta-tutor-confidence", JSON.stringify(next));
      return next;
    });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      // Include user-added notes for context
      let userNotes: { title: string; content: string }[] = [];
      try {
        const saved = localStorage.getItem("meta-tutor-user-notes");
        if (saved) {
          userNotes = JSON.parse(saved).map((n: { title: string; content: string }) => ({
            title: n.title,
            content: n.content,
          }));
        }
      } catch {}

      // Include primary source texts
      let sources: { title: string; author: string; content: string }[] = [];
      try {
        const savedSources = localStorage.getItem("meta-tutor-sources");
        if (savedSources) {
          sources = JSON.parse(savedSources).map((s: { title: string; author: string; content: string }) => ({
            title: s.title,
            author: s.author,
            content: s.content,
          }));
        }
      } catch {}

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, mode, userNotes, sources }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
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
        {
          role: "assistant",
          content: "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function selectQuestion(q: (typeof questions)[0]) {
    setInput(q.text);
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 md:static flex flex-col w-80 h-full border-r transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            Exam Questions
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {questions.map((q) => {
            const conf = confidence[q.id];
            return (
              <div key={q.id} className="group">
                <button
                  onClick={() => selectQuestion(q)}
                  className="w-full text-left p-3 rounded-lg text-sm transition-colors"
                  style={{ color: "var(--muted)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div className="flex items-start gap-2">
                    <span className="font-medium shrink-0" style={{ color: "var(--foreground)" }}>
                      Q{q.id}.
                    </span>
                    <span className="flex-1">
                      {q.text.length > 80 ? q.text.slice(0, 80) + "..." : q.text}
                    </span>
                    {conf && (
                      <span
                        className="shrink-0 w-2.5 h-2.5 rounded-full mt-1"
                        style={{
                          background:
                            conf === "got-it" ? "var(--success)" : conf === "shaky" ? "var(--warning)" : "var(--error)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {q.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--accent-light)",
                          color: "var(--accent)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
                {/* Confidence buttons */}
                <div className="flex gap-1 px-3 pb-2">
                  {(["got-it", "shaky", "no-clue"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfidenceLevel(q.id, level)}
                      className="text-xs px-2 py-0.5 rounded-full transition-all"
                      style={{
                        background:
                          conf === level
                            ? level === "got-it"
                              ? "var(--success)"
                              : level === "shaky"
                              ? "var(--warning)"
                              : "var(--error)"
                            : "var(--background)",
                        color:
                          conf === level
                            ? "#fff"
                            : "var(--muted)",
                        border: `1px solid ${
                          conf === level
                            ? "transparent"
                            : "var(--border)"
                        }`,
                      }}
                    >
                      {level === "got-it" ? "Got it" : level === "shaky" ? "Shaky" : "No clue"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Confidence summary */}
        {Object.keys(confidence).length > 0 && (
          <div
            className="p-3 border-t text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--success)" }}>
                {Object.values(confidence).filter((v) => v === "got-it").length} got it
              </span>
              <span style={{ color: "var(--warning)" }}>
                {Object.values(confidence).filter((v) => v === "shaky").length} shaky
              </span>
              <span style={{ color: "var(--error)" }}>
                {Object.values(confidence).filter((v) => v === "no-clue").length} no clue
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Chat toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b shrink-0"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="flex rounded-full overflow-hidden text-xs font-medium"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
              }}
            >
              <button
                onClick={() => setMode("study")}
                className="px-3.5 py-1.5 transition-all rounded-full"
                style={{
                  background: mode === "study" ? "var(--accent)" : "transparent",
                  color: mode === "study" ? "#fff" : "var(--muted)",
                }}
              >
                Study
              </button>
              <button
                onClick={() => setMode("quiz")}
                className="px-3.5 py-1.5 transition-all rounded-full"
                style={{
                  background: mode === "quiz" ? "var(--accent)" : "transparent",
                  color: mode === "quiz" ? "#fff" : "var(--muted)",
                }}
              >
                Quiz
              </button>
            </div>
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
              style={{ color: "var(--muted)" }}
              title="Clear chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "var(--accent-light)" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ color: "var(--accent)" }}
                >
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                Welcome to Meta Tutor
              </h2>
              <p className="text-sm max-w-md mb-6" style={{ color: "var(--muted)" }}>
                Pick a question from the sidebar or type your own. Toggle between
                Study mode (explanations) and Quiz mode (tests your understanding).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                {[
                  "Explain the Divided Line in simple terms",
                  "What's the difference between form and matter?",
                  "Help me understand act and potency",
                  "Quiz me on Aristotle's categories",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-sm p-3.5 rounded-xl transition-colors"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      background: "var(--surface)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--surface)")
                    }
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={{
                      background:
                        m.role === "user"
                          ? "var(--user-bubble)"
                          : "var(--assistant-bubble)",
                      color: m.role === "user" ? "#fff" : "var(--foreground)",
                    }}
                  >
                    {m.role === "assistant" ? (
                      <div
                        className="prose"
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(m.content),
                        }}
                      />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div
                    className="rounded-2xl rounded-bl-md px-4 py-3"
                    style={{ background: "var(--assistant-bubble)" }}
                  >
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
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
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
              placeholder={
                mode === "quiz"
                  ? "Pick a topic to get quizzed on..."
                  : "Ask about any metaphysics topic..."
              }
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
              className="self-end rounded-xl px-4 py-3 text-sm font-medium transition-opacity disabled:opacity-30"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs mt-2" style={{ color: "var(--muted)" }}>
            {mode === "quiz" ? "Quiz Mode" : "Study Mode"} — Answers grounded in your course notes
          </p>
        </div>
      </main>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Line breaks
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
