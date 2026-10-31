"use client";

import { useState, useRef, useEffect } from "react";
import { linkCitations, escapeHtml } from "@/lib/veritas/citations";
import GlossaryTooltip from "@/components/veritas/GlossaryTooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  endpoint: string;
  placeholder?: string;
  welcomeMessage?: string;
}

export default function ChatInterface({
  endpoint,
  placeholder = "Ask anything...",
  welcomeMessage,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
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

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
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
              className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "ml-8 bg-amber-500/10 text-amber-100"
                  : "mr-8 border border-stone-800 bg-stone-900/50 text-stone-300"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                  Veritas
                </div>
              )}
              {msg.role === "assistant" ? (
                <div
                  className="whitespace-pre-wrap [&_a]:text-amber-500 [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{
                    __html: linkCitations(escapeHtml(msg.content)),
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
