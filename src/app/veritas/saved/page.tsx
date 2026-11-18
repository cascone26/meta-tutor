"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/veritas/PageHeader";
import { getNotes, deleteNote, type VeritasNote } from "@/lib/veritas/notes";
import { renderMarkdown } from "@/lib/veritas/markdown";
import { escapeHtml } from "@/lib/veritas/citations";

interface SavedArgument {
  id: string;
  topic: string;
  opponent: string;
  argument: string;
  sources: string;
  createdAt: string;
}

export default function SavedPage() {
  const [tab, setTab] = useState<"arguments" | "notes">("arguments");
  const [arguments_, setArguments] = useState<SavedArgument[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newOpponent, setNewOpponent] = useState("");
  const [newArgument, setNewArgument] = useState("");
  const [newSources, setNewSources] = useState("");
  const [notes, setNotes] = useState<VeritasNote[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("veritas-saved-arguments");
    if (stored) {
      try {
        setArguments(JSON.parse(stored));
      } catch {}
    }
    setNotes(getNotes());
  }, []);

  const removeNote = (id: string) => {
    deleteNote(id);
    setNotes(getNotes());
  };

  const filteredNotes = notes.filter((n) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return n.text.toLowerCase().includes(s) || n.source.toLowerCase().includes(s);
  });

  const save = (updated: SavedArgument[]) => {
    setArguments(updated);
    localStorage.setItem("veritas-saved-arguments", JSON.stringify(updated));
  };

  const addArgument = () => {
    if (!newTopic.trim() || !newArgument.trim()) return;
    const entry: SavedArgument = {
      id: Date.now().toString(),
      topic: newTopic.trim(),
      opponent: newOpponent.trim(),
      argument: newArgument.trim(),
      sources: newSources.trim(),
      createdAt: new Date().toISOString(),
    };
    save([entry, ...arguments_]);
    setNewTopic("");
    setNewOpponent("");
    setNewArgument("");
    setNewSources("");
    setShowForm(false);
  };

  const deleteArgument = (id: string) => {
    save(arguments_.filter((a) => a.id !== id));
  };

  const filtered = arguments_.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.topic.toLowerCase().includes(s) ||
      a.opponent.toLowerCase().includes(s) ||
      a.argument.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex h-app flex-col">
      <PageHeader
        title="Saved"
        subtitle="Your personal library of saved arguments and chat notes"
        icon="💾"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 pt-3">
          <div className="mb-3 flex gap-1 border-b border-stone-800">
            <button
              onClick={() => setTab("arguments")}
              className={`px-3 pb-2 text-sm font-medium transition-colors ${
                tab === "arguments" ? "border-b-2 border-amber-500 text-amber-400" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              Arguments
            </button>
            <button
              onClick={() => setTab("notes")}
              className={`px-3 pb-2 text-sm font-medium transition-colors ${
                tab === "notes" ? "border-b-2 border-amber-500 text-amber-400" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              Chat Notes {notes.length > 0 && `(${notes.length})`}
            </button>
          </div>
        </div>
        <div className="sticky top-[45px] z-10 border-b border-stone-800 bg-stone-950 px-6 py-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "arguments" ? "Search arguments..." : "Search chat notes..."}
              className="flex-1 rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
            />
            {tab === "arguments" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-stone-100 hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              {showForm ? "Cancel" : "+ New"}
            </button>
            )}
          </div>
          <p className="text-[10px] text-stone-600">
            {tab === "arguments" ? `${filtered.length} saved arguments` : `${filteredNotes.length} chat notes`}
          </p>
        </div>

        {tab === "notes" ? (
          <div className="px-6 py-4">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-stone-500">No saved chat notes yet.</p>
                <p className="mt-1 text-xs text-stone-600">
                  Highlight any text in Ask Aquinas, a debate, or a response, or click ✎ Save on an
                  answer, to keep it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-stone-800 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-amber-600">{n.source}</span>
                      <span className="text-[10px] text-stone-600">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className="text-sm leading-relaxed text-stone-300 [&_a]:text-amber-500 [&_a:hover]:underline"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(escapeHtml(n.text)) }}
                    />
                    <button
                      onClick={() => removeNote(n.id)}
                      className="mt-2 text-[10px] text-red-600 hover:text-red-400"
                    >
                      Delete Note
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        <div className="px-6 py-4 space-y-4">
          {showForm && (
            <div className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-amber-400">New Argument</h3>
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Topic (e.g., Sola Scriptura)"
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
              />
              <input
                value={newOpponent}
                onChange={(e) => setNewOpponent(e.target.value)}
                placeholder="Opponent type (e.g., Protestant, Atheist)"
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
              />
              <textarea
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder="Your argument..."
                rows={4}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700 resize-none"
              />
              <input
                value={newSources}
                onChange={(e) => setNewSources(e.target.value)}
                placeholder="Sources (e.g., ST I, q.2; John 6:53; CCC 1376)"
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
              />
              <button
                onClick={addArgument}
                disabled={!newTopic.trim() || !newArgument.trim()}
                className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-stone-100 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Argument
              </button>
            </div>
          )}

          {filtered.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <p className="text-sm text-stone-500">No saved arguments yet.</p>
              <p className="text-xs text-stone-600 mt-1">
                Save arguments from debates or create new ones here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-stone-800 transition-colors hover:border-stone-700"
                >
                  <button
                    onClick={() =>
                      setExpanded(expanded === a.id ? null : a.id)
                    }
                    className="w-full px-4 py-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-stone-200">
                        {a.topic}
                      </span>
                      <span className="text-[10px] text-stone-600">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {a.opponent && (
                      <p className="mt-0.5 text-xs text-amber-600">
                        vs. {a.opponent}
                      </p>
                    )}
                  </button>
                  {expanded === a.id && (
                    <div className="border-t border-stone-800 px-4 py-4 space-y-3">
                      <div>
                        <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                          Argument
                        </h4>
                        <p className="text-sm text-stone-300 whitespace-pre-wrap">
                          {a.argument}
                        </p>
                      </div>
                      {a.sources && (
                        <div>
                          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                            Sources
                          </h4>
                          <p className="text-sm font-mono text-stone-400">
                            {a.sources}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => deleteArgument(a.id)}
                        className="text-[10px] text-red-600 hover:text-red-400"
                      >
                        Delete Argument
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
