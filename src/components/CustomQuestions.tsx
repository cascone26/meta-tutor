"use client";

import { useState, useEffect } from "react";
import { getCustomQuestions, saveCustomQuestions, CustomQuestion } from "@/lib/custom-questions";

export default function CustomQuestions() {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [topics, setTopics] = useState("");

  useEffect(() => {
    setQuestions(getCustomQuestions());
  }, []);

  function save(qs: CustomQuestion[]) {
    setQuestions(qs);
    saveCustomQuestions(qs);
  }

  function addQuestion() {
    if (!text.trim()) return;
    const q: CustomQuestion = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      topics: topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toLocaleDateString(),
    };
    save([q, ...questions]);
    resetForm();
  }

  function updateQuestion(id: string) {
    save(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              text: text.trim(),
              topics: topics
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            }
          : q
      )
    );
    resetForm();
  }

  function deleteQuestion(id: string) {
    save(questions.filter((q) => q.id !== id));
  }

  function startEdit(q: CustomQuestion) {
    setEditingId(q.id);
    setText(q.text);
    setTopics(q.topics.join(", "));
    setAdding(false);
  }

  function resetForm() {
    setAdding(false);
    setEditingId(null);
    setText("");
    setTopics("");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          Custom Study Questions ({questions.length})
        </h3>
        <button
          onClick={() => { setAdding(true); setEditingId(null); setText(""); setTopics(""); }}
          className="text-xs px-3 py-1.5 rounded-full font-medium"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          + Add question
        </button>
      </div>

      {(adding || editingId) && (
        <div
          className="rounded-xl p-4 mb-3"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your study question..."
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y mb-2"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          />
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Topics (comma-separated, e.g., Plato, Forms, Cave)"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none mb-3"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={resetForm} className="text-xs px-3 py-1.5 rounded-full" style={{ color: "var(--muted)" }}>Cancel</button>
            <button
              onClick={() => (editingId ? updateQuestion(editingId) : addQuestion())}
              disabled={!text.trim()}
              className="text-xs px-4 py-1.5 rounded-full font-medium disabled:opacity-40"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 && !adding && (
        <p className="text-xs text-center py-4" style={{ color: "var(--muted)" }}>
          No custom questions yet. Add your own to study with.
        </p>
      )}

      <div className="space-y-1.5">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-xl px-4 py-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm leading-relaxed mb-1" style={{ color: "var(--foreground)" }}>
              {q.text}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {q.topics.map((t) => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(q)} className="p-1 hover:opacity-60" style={{ color: "var(--muted)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button onClick={() => deleteQuestion(q.id)} className="p-1 hover:opacity-60" style={{ color: "#c96b6b" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
