"use client";

import { useState, useEffect, useRef } from "react";
import CustomQuestions from "@/components/CustomQuestions";

type UserNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesPage() {
  const [builtInNotes, setBuiltInNotes] = useState("");
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [activeTab, setActiveTab] = useState<"course" | "my-notes" | "questions">("course");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load built-in notes
  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => setBuiltInNotes(d.notes))
      .catch(() => {});
  }, []);

  // Load user notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meta-tutor-user-notes");
      if (saved) setUserNotes(JSON.parse(saved));
    } catch {}
  }, []);

  function saveUserNotes(notes: UserNote[]) {
    setUserNotes(notes);
    localStorage.setItem("meta-tutor-user-notes", JSON.stringify(notes));
  }

  function addNote() {
    if (!newContent.trim()) return;
    const note: UserNote = {
      id: Date.now().toString(),
      title: newTitle.trim() || "Untitled Notes",
      content: newContent.trim(),
      createdAt: new Date().toLocaleDateString(),
    };
    saveUserNotes([note, ...userNotes]);
    setNewTitle("");
    setNewContent("");
    setAdding(false);
  }

  function updateNote(id: string) {
    saveUserNotes(
      userNotes.map((n) =>
        n.id === id ? { ...n, title: newTitle, content: newContent } : n
      )
    );
    setEditingId(null);
    setNewTitle("");
    setNewContent("");
  }

  function deleteNote(id: string) {
    saveUserNotes(userNotes.filter((n) => n.id !== id));
  }

  function startEdit(note: UserNote) {
    setEditingId(note.id);
    setNewTitle(note.title);
    setNewContent(note.content);
    setAdding(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      setNewContent(text);
      setAdding(true);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const filteredBuiltIn = search
    ? builtInNotes
        .split("\n")
        .filter((line) => line.toLowerCase().includes(search.toLowerCase()))
        .join("\n")
    : builtInNotes;

  const filteredUserNotes = userNotes.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Notes
          </h1>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.text"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-70"
              style={{
                background: "var(--surface)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
              }}
            >
              Upload file
            </button>
            <button
              onClick={() => {
                setAdding(true);
                setEditingId(null);
                setNewTitle("");
                setNewContent("");
              }}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              + Add notes
            </button>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          Your course notes and any notes you add. Added notes are also used by the tutor when answering.
        </p>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-3"
          style={{
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("course")}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              background: activeTab === "course" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "course" ? "#fff" : "var(--muted)",
              border: `1px solid ${activeTab === "course" ? "transparent" : "var(--border)"}`,
            }}
          >
            Course Notes
          </button>
          <button
            onClick={() => setActiveTab("my-notes")}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              background: activeTab === "my-notes" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "my-notes" ? "#fff" : "var(--muted)",
              border: `1px solid ${activeTab === "my-notes" ? "transparent" : "var(--border)"}`,
            }}
          >
            My Notes {userNotes.length > 0 && `(${userNotes.length})`}
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              background: activeTab === "questions" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "questions" ? "#fff" : "var(--muted)",
              border: `1px solid ${activeTab === "questions" ? "transparent" : "var(--border)"}`,
            }}
          >
            Questions
          </button>
        </div>

        {/* Add/Edit form */}
        {(adding || editingId) && (
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g., Chapter 5 Notes, Lecture 10/2...)"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none mb-2"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste your notes here..."
              rows={10}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y mb-3 font-mono"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setAdding(false);
                  setEditingId(null);
                  setNewTitle("");
                  setNewContent("");
                }}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => (editingId ? updateNote(editingId) : addNote())}
                disabled={!newContent.trim()}
                className="text-xs px-4 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                }}
              >
                {editingId ? "Save changes" : "Add notes"}
              </button>
            </div>
          </div>
        )}

        {/* Course notes view */}
        {activeTab === "course" && (
          <div
            className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              maxHeight: "60vh",
              overflow: "auto",
            }}
          >
            {filteredBuiltIn || "Loading notes..."}
          </div>
        )}

        {/* User notes view */}
        {activeTab === "my-notes" && (
          <div className="space-y-3">
            {filteredUserNotes.length === 0 && !adding && (
              <div className="text-center py-12">
                <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                  No notes yet
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Add notes by pasting text or uploading a .txt file. They&apos;ll be used by the tutor too.
                </p>
              </div>
            )}
            {filteredUserNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <h3 className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                      {note.title}
                    </h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Added {note.createdAt} &middot; {note.content.length} chars
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(note)}
                      className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
                      style={{ color: "var(--muted)" }}
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
                      style={{ color: "#c96b6b" }}
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className="px-4 pb-3 text-sm leading-relaxed whitespace-pre-wrap font-mono"
                  style={{
                    color: "var(--muted)",
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  {note.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom questions tab */}
        {activeTab === "questions" && (
          <CustomQuestions />
        )}
      </div>
    </div>
  );
}
