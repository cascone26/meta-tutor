"use client";

import { useState } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { linkCitations, escapeHtml } from "@/lib/veritas/citations";

const OPPONENT_TYPES = [
  { id: "atheist", label: "Atheist / Agnostic", icon: "🧪" },
  { id: "protestant", label: "Protestant", icon: "✝️" },
  { id: "muslim", label: "Muslim", icon: "☪️" },
  { id: "orthodox", label: "Orthodox", icon: "☦️" },
  { id: "secular", label: "Secular / Progressive", icon: "🏛️" },
  { id: "spiritual", label: "Spiritual but Not Religious", icon: "🌿" },
];

const TOPIC_SUGGESTIONS = [
  "The Problem of Evil",
  "Sola Scriptura",
  "The Real Presence (Eucharist)",
  "Papal Authority",
  "The Trinity",
  "Abortion and Natural Law",
  "Mary's Immaculate Conception",
  "Purgatory",
  "Praying to Saints",
  "Science vs. Religion",
  "Same-Sex Marriage",
  "The Crusades",
  "Priestly Celibacy",
  "Faith vs. Works",
  "Biblical Inerrancy",
  "God's Existence (Five Ways)",
];

export default function DebatePrep() {
  const [topic, setTopic] = useState("");
  const [opponent, setOpponent] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!topic.trim() || !opponent || loading) return;
    setLoading(true);
    setResponse("");

    try {
      const opponentLabel = OPPONENT_TYPES.find((o) => o.id === opponent)?.label ?? opponent;
      const res = await fetch("/api/veritas-debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Topic: ${topic.trim()}\nOpponent: ${opponentLabel}` }],
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              content += parsed.text;
              setResponse(content);
            }
          } catch {
            // skip parse errors on partial chunks
          }
        }
      }
    } catch {
      setResponse("Error generating response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Debate Prep"
        subtitle="Get a full briefing on any topic against any opponent type"
        icon="🎯"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-stone-300">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What topic are you debating?"
              className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-600"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TOPIC_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="rounded-md border border-stone-800 px-2 py-0.5 text-[11px] text-stone-500 hover:border-amber-700 hover:text-amber-400"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-stone-300">Opponent Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {OPPONENT_TYPES.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOpponent(o.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                    opponent === o.id
                      ? "border-amber-600 bg-amber-600/10 text-amber-400"
                      : "border-stone-800 text-stone-400 hover:border-stone-600"
                  }`}
                >
                  <span className="mr-1.5">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !topic.trim() || !opponent}
            className="mb-6 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-40"
          >
            {loading ? "Preparing Briefing..." : "Generate Debate Prep"}
          </button>

          {response && (
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                Debate Briefing
              </div>
              <div
                className="whitespace-pre-wrap text-sm leading-relaxed text-stone-300 [&_a]:text-amber-500 [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: linkCitations(escapeHtml(response)) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
