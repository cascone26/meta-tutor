"use client";

import { useState } from "react";
import ChatInterface from "@/components/veritas/ChatInterface";
import PageHeader from "@/components/veritas/PageHeader";

const OPPONENT_TYPES = [
  { id: "atheist", label: "Atheist / Agnostic", icon: "🧪" },
  { id: "protestant", label: "Protestant", icon: "✝️" },
  { id: "muslim", label: "Muslim", icon: "☪️" },
  { id: "orthodox", label: "Orthodox", icon: "☦️" },
  { id: "secular", label: "Secular / Progressive", icon: "🏛️" },
];

export default function DebateSimulator() {
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);

  if (!selectedOpponent) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader
          title="Debate Simulator"
          subtitle="Practice defending the faith against live AI opponents"
          icon="⚔️"
        />
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 text-sm text-stone-400">
              Choose an opponent type. They will challenge your Catholic positions in real time — expect real pushback, serious objections, and intellectual rigor. No easy victories.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {OPPONENT_TYPES.map((opponent) => (
                <button
                  key={opponent.id}
                  onClick={() => setSelectedOpponent(opponent.id)}
                  className="rounded-xl border border-stone-800 bg-stone-900/50 px-6 py-4 text-left transition-all hover:border-amber-600 hover:bg-stone-900"
                >
                  <div className="mb-2 text-2xl">{opponent.icon}</div>
                  <div className="font-medium text-stone-100">{opponent.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const opponent = OPPONENT_TYPES.find((o) => o.id === selectedOpponent);
  if (!opponent) return null;

  const welcomeMessages: Record<string, string> = {
    atheist: `You are now debating a committed atheist.

They accept nothing on faith. Every claim you make will be scrutinized through the lens of naturalism and empiricism. They will push you on the problem of evil, the implausibility of miracles, the unreliability of Scripture, and the lack of physical evidence for God.

They are intelligent and well-read. They know your best arguments and have thought about them. This is not a debate you will "win" easily — it is a test of whether you can articulate and defend the faith under real pressure.

Defend what you believe. Use reason, Scripture, Aquinas, and the Fathers. Hold your ground.`,

    protestant: `You are now debating a sincere Protestant evangelical.

They believe in Jesus and the Bible. But they reject papal authority, Sacred Tradition, the Magisterium, and much of Catholic sacramental theology. They will challenge you on sola scriptura, the nature of authority, the cult of Mary, purgatory, indulgences, and priesthood.

They see themselves as more biblical than you. They will cite Scripture and ask why the Catholics "added" doctrines. This is a debate about which tradition correctly inherits the apostolic faith.

Present the case for the Catholic Church with Scripture, Tradition, and Aquinas. Show how Catholicism is the fulfillment, not the corruption, of Christianity.`,

    muslim: `You are now debating a devout Muslim.

They accept monotheism and the prophetic tradition. But they reject the Trinity, the Incarnation, and the divinity of Jesus. They will argue from pure monotheism: "God is one; Jesus is a creature; the Quran is God's final word."

They see Christian theology as a corruption of Abraham's faith. They know Christian arguments and can dismantle them with logic and their own Scripture citations.

You must defend the Trinity and the Incarnation rationally — show how they are the perfection of monotheism, not its violation. Use Aquinas, the Church Fathers, and reason alongside Scripture.`,

    orthodox: `You are now debating an Orthodox Christian.

They accept most of Catholic doctrine. The split is institutional and sacramental: Rome's primacy, the Filioque, clerical celibacy, purgatory, indulgences, the Immaculate Conception. They see Rome as a sister that became corrupted or ambitious.

They will challenge you on papal authority — "Where is this in the Fathers?" They will defend their own practices as more ancient and more faithful.

You must show why Rome's authority is not a corruption but a development that preserves unity and truth. Use the Fathers carefully — they knew Rome had a special role.`,

    secular: `You are now debating a secular progressive who is sympathetic to Christianity but skeptical of dogma.

They accept human dignity, compassion, and social justice. But they see rigid doctrine as oppressive, outdated, and in tension with modern morality. They will challenge you on sexual ethics, gender, capital punishment, economic justice, and "blind faith."

They will argue that your faith conflicts with human rights and progressive values. They see themselves as more moral than the institutional Church.

You must show that Catholic teaching is not oppressive but liberating — that natural law and Catholic social doctrine are the true foundation for human flourishing, not obstacles to it.`,
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={`Debating: ${opponent.label}`}
        subtitle="Stay in character. Defend your faith."
        icon={opponent.icon}
      />
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          endpoint={`/api/veritas-simulator-${opponent.id}`}
          placeholder="State your position or respond to their arguments..."
          welcomeMessage={welcomeMessages[opponent.id]}
        />
      </div>
      <div className="border-t border-stone-800 bg-stone-950 px-4 py-2">
        <button
          onClick={() => setSelectedOpponent(null)}
          className="text-xs text-stone-500 hover:text-amber-500"
        >
          ← Change opponent
        </button>
      </div>
    </div>
  );
}
