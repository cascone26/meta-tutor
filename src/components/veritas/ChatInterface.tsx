"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { linkCitations, escapeHtml } from "@/lib/veritas/citations";
import { renderMarkdown } from "@/lib/veritas/markdown";
import { saveNote } from "@/lib/veritas/notes";
import { takePendingQuestion } from "@/lib/veritas/ask-handoff";
import GlossaryTooltip from "@/components/veritas/GlossaryTooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  endpoint: string;
  placeholder?: string;
  welcomeMessage?: string;
  chatLabel?: string;
}

const ENDPOINT_LABELS: Record<string, string> = {
  "/api/veritas-chat": "Ask Aquinas",
  "/api/veritas-simulator-atheist": "Debate: Atheist",
  "/api/veritas-simulator-protestant": "Debate: Protestant",
  "/api/veritas-simulator-muslim": "Debate: Muslim",
  "/api/veritas-simulator-orthodox": "Debate: Orthodox",
  "/api/veritas-simulator-secular": "Debate: Secular",
};

export default function ChatInterface({
  endpoint,
  placeholder = "Ask anything...",
  welcomeMessage,
  chatLabel,
}: ChatInterfaceProps) {
  const label = chatLabel ?? ENDPOINT_LABELS[endpoint] ?? "Veritas";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [selectionBtn, setSelectionBtn] = useState<{ x: number; y: number; text: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pending = takePendingQuestion();
    if (pending) {
      setInput(pending);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (el) {
          el.style.height = "auto";
          el.style.height = Math.min(el.scrollHeight, 150) + "px";
        }
      });
    }
    inputRef.current?.focus();
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to get response");

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
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantContent += parsed.text;
              setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            } else if (parsed.error) {
              assistantContent = "Sorry, something went wrong. Please try again.";
              setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // skip parse errors on partial chunks
          }
        }
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "An error occurred. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleSaveMessage = (i: number, content: string) => {
    saveNote(content, label);
    setSavedIndex(i);
    setTimeout(() => setSavedIndex((cur) => (cur === i ? null : cur)), 1500);
  };

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || !selection || selection.rangeCount === 0 || !messagesRef.current?.contains(selection.anchorNode)) {
      setSelectionBtn(null);
      return;
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const containerRect = messagesRef.current.getBoundingClientRect();
    setSelectionBtn({ x: rect.left + rect.width / 2 - containerRect.left, y: rect.top - containerRect.top, text });
  }, []);

  const handleSaveSelection = () => {
    if (!selectionBtn) return;
    saveNote(selectionBtn.text, label);
    setSelectionBtn(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto px-4 py-6" ref={messagesRef} onMouseUp={handleMouseUp}>
        {selectionBtn && (
          <button
            onClick={handleSaveSelection}
            style={{ left: selectionBtn.x, top: selectionBtn.y }}
            className="absolute z-20 -translate-x-1/2 -translate-y-full rounded-full border border-amber-600/40 bg-stone-900 px-3 py-1 text-xs font-medium text-amber-400 shadow-lg transition-all hover:bg-stone-800"
          >
            ✎ Save highlight
          </button>
        )}
        {messages.length === 0 && welcomeMessage && (
          <div className="mx-auto max-w-2xl rounded-xl border border-stone-800 bg-stone-900/50 p-6 text-sm text-stone-400">
            <div className="whitespace-pre-wrap">
              <GlossaryTooltip text={welcomeMessage} />
            </div>
          </div>
        )}
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`group relative rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "ml-8 bg-amber-500/10 text-amber-100"
                  : "mr-8 border border-stone-800 bg-stone-900/50 text-stone-300"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  Veritas
                  {msg.content && (
                    <button
                      onClick={() => handleSaveMessage(i, msg.content)}
                      className="normal-case tracking-normal text-stone-600 opacity-0 transition-opacity hover:text-amber-500 group-hover:opacity-100"
                      title="Save this answer to your notes"
                    >
                      {savedIndex === i ? "✓ Saved" : "✎ Save"}
                    </button>
                  )}
                </div>
              )}
              {msg.role === "assistant" ? (
                <div
                  className="[&_a]:text-amber-500 [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(linkCitations(escapeHtml(msg.content))),
                  }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="mr-8 rounded-xl border border-stone-800 bg-stone-900/50 px-4 py-3 text-sm text-stone-500">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                Veritas
              </div>
              <span className="animate-pulse">Thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-800 bg-stone-950 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            style={{ maxHeight: "150px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 150) + "px";
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-amber-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
