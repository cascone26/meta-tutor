"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/veritas/PageHeader";

interface SavedArgument {
  id: string;
  topic: string;
  opponent: string;
  argument: string;
  sources: string;
  createdAt: string;
}

export default function SavedPage() {
  const [arguments_, setArguments] = useState<SavedArgument[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newOpponent, setNewOpponent] = useState("");
  const [newArgument, setNewArgument] = useState("");
  const [newSources, setNewSources] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("veritas-saved-arguments");
    if (stored) {
      try {
        setArguments(JSON.parse(stored));
      } catch {}
    }
  }, []);

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
        title="Saved Arguments"
        subtitle="Your personal library of apologetics arguments"
        icon="💾"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-stone-800 bg-stone-950 px-6 py-3 space-y-2">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search arguments..."
              className="flex-1 rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-sm text-stone-200 placeholder-stone-600 outline-none focus:border-amber-700"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-stone-100 hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              {showForm ? "Cancel" : "+ New"}
            </button>
          </div>
          <p className="text-[10px] text-stone-600">
            {filtered.length} saved arguments
          </p>
        </div>

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
      </div>
    </div>
  );
}
