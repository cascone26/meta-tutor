"use client";

import { useState } from "react";

type Node = {
  id: string;
  label: string;
  category: string;
  x: number;
  y: number;
  description: string;
};

type Edge = {
  from: string;
  to: string;
  label?: string;
};

const nodes: Node[] = [
  // Central
  { id: "metaphysics", label: "Metaphysics", category: "core", x: 400, y: 300, description: "The study of being as being — the most fundamental inquiry into the nature of reality." },

  // Plato branch
  { id: "plato", label: "Plato", category: "plato", x: 150, y: 150, description: "Developed the theory of Forms: reality is divided between the visible realm of appearances and the intelligible realm of perfect, eternal Forms." },
  { id: "forms", label: "Theory of Forms", category: "plato", x: 60, y: 280, description: "The eternal, unchanging archetypes (eidos) of which physical things are imperfect copies. Accessible through reason, not the senses." },
  { id: "divided-line", label: "Divided Line", category: "plato", x: 50, y: 180, description: "Four levels of reality: Eikasia (illusion) → Pistis (belief) → Dianoia (mathematical reasoning) → Noesis (pure intelligence)." },
  { id: "cave", label: "Allegory of the Cave", category: "plato", x: 180, y: 50, description: "Illustrates the journey from ignorance (shadows) to enlightenment (the Good). Maps onto the Divided Line's four stages." },
  { id: "participation", label: "Participation", category: "plato", x: 60, y: 380, description: "Physical things participate in the Forms — this is why they have the properties they do." },

  // Aristotle branch
  { id: "aristotle", label: "Aristotle", category: "aristotle", x: 650, y: 150, description: "Rejected separated Forms. Developed hylomorphism, the categories, syllogistic logic, and the method of 'saving the appearances.'" },
  { id: "syllogism", label: "Syllogistic Logic", category: "aristotle", x: 750, y: 60, description: "Deductive reasoning with two premises and a conclusion. Subject + Copula + Predicate. Valid forms include Barbara, Celarent, etc." },
  { id: "categories", label: "Categories of Being", category: "aristotle", x: 770, y: 180, description: "10 categories: substance, quantity, quality, relation, place, time, position, state, action, passion." },
  { id: "saving", label: "Saving the Appearances", category: "aristotle", x: 730, y: 280, description: "Aristotle's methodology: verify claims against common experience. Theories must account for what we actually observe." },

  // Thomistic branch
  { id: "thomism", label: "Thomism", category: "thomism", x: 400, y: 500, description: "St. Thomas Aquinas synthesized Aristotle with Christian theology. Emphasizes act/potency, form/matter, substance/accident." },
  { id: "hylomorphism", label: "Form & Matter", category: "thomism", x: 220, y: 480, description: "All material beings are composed of substantial form (what it is) and prime matter (pure potentiality). Neither exists alone." },
  { id: "act-potency", label: "Act & Potency", category: "thomism", x: 580, y: 480, description: "Act = what a thing actually is. Potency = what it can become. Explains change: the transition from potency to act." },
  { id: "substance-accident", label: "Substance & Accident", category: "thomism", x: 400, y: 600, description: "Substance exists in itself. Accidents (color, size, etc.) exist in a substance. Connected to act/potency." },
  { id: "transcendentals", label: "Transcendentals", category: "thomism", x: 230, y: 600, description: "Properties of every being: One, True, Good. Every being must be one (unified), true (intelligible), and good (desirable)." },

  // Principles
  { id: "pnc", label: "Non-Contradiction", category: "principles", x: 550, y: 370, description: "A thing cannot both be and not be in the same respect at the same time. Foundation of all metaphysics." },
  { id: "intelligibility", label: "Intelligibility of Being", category: "principles", x: 250, y: 370, description: "All being is knowable by the intellect. Complementary to the innate human drive to know." },

  // Concepts
  { id: "analogy", label: "Analogous Concepts", category: "concepts", x: 600, y: 600, description: "Concepts applied in partly same, partly different senses. Essential for metaphysics — 'being' is said analogously of substance and accident." },
];

const edges: Edge[] = [
  { from: "metaphysics", to: "plato", label: "founder" },
  { from: "metaphysics", to: "aristotle", label: "systematizer" },
  { from: "metaphysics", to: "thomism", label: "synthesis" },
  { from: "plato", to: "divided-line" },
  { from: "plato", to: "cave" },
  { from: "plato", to: "forms" },
  { from: "forms", to: "participation" },
  { from: "divided-line", to: "cave", label: "maps to" },
  { from: "aristotle", to: "syllogism" },
  { from: "aristotle", to: "categories" },
  { from: "aristotle", to: "saving" },
  { from: "plato", to: "aristotle", label: "criticizes" },
  { from: "aristotle", to: "thomism", label: "builds on" },
  { from: "thomism", to: "hylomorphism" },
  { from: "thomism", to: "act-potency" },
  { from: "thomism", to: "substance-accident" },
  { from: "thomism", to: "transcendentals" },
  { from: "act-potency", to: "substance-accident", label: "grounds" },
  { from: "metaphysics", to: "pnc", label: "built on" },
  { from: "metaphysics", to: "intelligibility", label: "built on" },
  { from: "hylomorphism", to: "transcendentals" },
  { from: "thomism", to: "analogy" },
  { from: "categories", to: "substance-accident", label: "primary" },
];

const categoryColors: Record<string, string> = {
  core: "#7c6b9a",
  plato: "#6b8fbf",
  aristotle: "#bf8f6b",
  thomism: "var(--success)",
  principles: "#c4737a",
  concepts: "#9a8a6b",
};

export default function MapPage() {
  const [selected, setSelected] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const connectedNodes = hoveredNode
    ? new Set(
        edges
          .filter((e) => e.from === hoveredNode || e.to === hoveredNode)
          .flatMap((e) => [e.from, e.to])
      )
    : null;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="px-4 py-4 shrink-0">
        <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
          Concept Map
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          How the major ideas connect. Tap a node to learn more.
        </p>
        <div className="flex gap-3 mt-3 flex-wrap">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <svg
          viewBox="0 0 800 680"
          className="w-full h-full min-w-[600px]"
          style={{ minHeight: "500px" }}
        >
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodes.find((n) => n.id === edge.from)!;
            const to = nodes.find((n) => n.id === edge.to)!;
            const isHighlighted =
              !connectedNodes ||
              (connectedNodes.has(edge.from) && connectedNodes.has(edge.to));
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={i} opacity={isHighlighted ? 1 : 0.15}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--muted)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHighlighted =
              !connectedNodes || connectedNodes.has(node.id);
            const isSelected = selected?.id === node.id;
            const color = categoryColors[node.category] || "var(--accent)";
            return (
              <g
                key={node.id}
                onClick={() => setSelected(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: "pointer" }}
                opacity={isHighlighted ? 1 : 0.2}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.category === "core" ? 28 : 22}
                  fill={color}
                  opacity={isSelected ? 1 : 0.85}
                  stroke={isSelected ? "var(--foreground)" : "none"}
                  strokeWidth="2"
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={node.category === "core" ? "10" : "8.5"}
                  fontWeight="500"
                  fill="#fff"
                >
                  {node.label.length > 14
                    ? node.label.split(/[\s&]/)[0]
                    : node.label}
                </text>
                {node.label.length > 14 && (
                  <text
                    x={node.x}
                    y={node.y + 11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    fontWeight="500"
                    fill="#fff"
                  >
                    {node.label.split(/[\s&]/).slice(1).join(" ")}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="shrink-0 p-4 border-t"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: categoryColors[selected.category] }}
                />
                <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  {selected.label}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs hover:opacity-60"
                style={{ color: "var(--muted)" }}
              >
                Close
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {selected.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
