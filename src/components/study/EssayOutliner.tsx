"use client";

import { useState, useEffect } from "react";
import { questions } from "@/lib/questions";
import { getCustomQuestions, CustomQuestion } from "@/lib/custom-questions";

type OutlineSection = {
  heading: string;
  content: string;
};

type Outline = {
  questionId: string;
  thesis: string;
  sections: OutlineSection[];
  conclusion: string;
  lastSaved: string;
};

export default function EssayOutliner({ onBack }: { onBack: () => void }) {
  const [allQuestions, setAllQuestions] = useState<{ id: string; text: string }[]>([]);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [outlines, setOutlines] = useState<Record<string, Outline>>({});

  useEffect(() => {
    const custom = getCustomQuestions();
    const all = [
      ...questions.map((q) => ({ id: String(q.id), text: q.text })),
      ...custom.map((q) => ({ id: q.id, text: q.text })),
    ];
    setAllQuestions(all);
    try {
      const saved = localStorage.getItem("meta-tutor-outlines");
      if (saved) setOutlines(JSON.parse(saved));
    } catch {}
  }, []);

  function selectQuestion(id: string) {
    setSelectedQ(id);
    if (outlines[id]) {
      setOutline(outlines[id]);
    } else {
      setOutline({
        questionId: id,
        thesis: "",
        sections: [
          { heading: "Point 1", content: "" },
          { heading: "Point 2", content: "" },
          { heading: "Point 3", content: "" },
        ],
        conclusion: "",
        lastSaved: "",
      });
    }
  }

  function save() {
    if (!outline || !selectedQ) return;
    const updated = {
      ...outline,
      lastSaved: new Date().toLocaleString(),
    };
    const newOutlines = { ...outlines, [selectedQ]: updated };
    setOutline(updated);
    setOutlines(newOutlines);
    localStorage.setItem("meta-tutor-outlines", JSON.stringify(newOutlines));
  }

  function addSection() {
    if (!outline) return;
    setOutline({
      ...outline,
      sections: [...outline.sections, { heading: `Point ${outline.sections.length + 1}`, content: "" }],
    });
  }

  function removeSection(i: number) {
    if (!outline) return;
    setOutline({
      ...outline,
      sections: outline.sections.filter((_, j) => j !== i),
    });
  }

  function updateSection(i: number, field: "heading" | "content", value: string) {
    if (!outline) return;
    const sections = [...outline.sections];
    sections[i] = { ...sections[i], [field]: value };
    setOutline({ ...outline, sections });
  }

  function exportText(): string {
    if (!outline) return "";
    const q = allQuestions.find((q) => q.id === selectedQ);
    let text = `ESSAY OUTLINE: ${q?.text || ""}\n\n`;
    text += `THESIS: ${outline.thesis}\n\n`;
    outline.sections.forEach((s, i) => {
      text += `${i + 1}. ${s.heading}\n${s.content}\n\n`;
    });
    text += `CONCLUSION: ${outline.conclusion}\n`;
    return text;
  }

  function handleExport() {
    const text = exportText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outline-q${selectedQ}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    if (!outline) return;
    const q = allQuestions.find((q) => q.id === selectedQ);
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    printWin.document.write(`<!DOCTYPE html><html><head><title>Essay Outline</title>
      <style>
        body{font-family:system-ui,sans-serif;max-width:650px;margin:0 auto;padding:40px 20px;color:#2d2d2d}
        h1{font-size:16px;color:#7c6b9a;margin-bottom:16px}
        .question{background:#f8f7f4;padding:12px;border-radius:8px;font-size:14px;margin-bottom:20px;border-left:3px solid #7c6b9a}
        h2{font-size:14px;margin-top:20px;color:#2d2d2d} h3{font-size:13px;color:#7c6b9a;margin:12px 0 4px}
        p{font-size:13px;line-height:1.6;margin:4px 0}
        .section{margin:16px 0;padding:12px;background:#f8f7f4;border-radius:8px}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>Essay Outline</h1>
      <div class="question">${q?.text || ""}</div>
      <h2>Thesis</h2><p>${outline.thesis || "<em>Not written yet</em>"}</p>
      ${outline.sections.map((s, i) => `<div class="section"><h3>${i + 1}. ${s.heading}</h3><p>${s.content || "<em>No content</em>"}</p></div>`).join("")}
      <h2>Conclusion</h2><p>${outline.conclusion || "<em>Not written yet</em>"}</p>
    </body></html>`);
    printWin.document.close();
    setTimeout(() => printWin.print(), 300);
  }

  // Question picker
  if (!selectedQ) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center px-4 py-3 shrink-0">
          <button onClick={onBack} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--foreground)" }}>Essay Outliner</h2>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Pick a question to build a structured outline before writing your full answer.
            </p>
            <div className="space-y-2">
              {allQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => selectQuestion(q.id)}
                  className="w-full text-left rounded-xl p-3.5 text-sm transition-all"
                  style={{ background: "var(--surface)", border: `1px solid ${outlines[q.id] ? "var(--accent)" : "var(--border)"}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = outlines[q.id] ? "var(--accent)" : "var(--border)")}
                >
                  <div className="flex items-center gap-2">
                    {outlines[q.id] && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                    )}
                    <span style={{ color: "var(--foreground)" }}>{q.text.slice(0, 120)}{q.text.length > 120 ? "..." : ""}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = allQuestions.find((q) => q.id === selectedQ);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={() => setSelectedQ(null)} className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Questions
        </button>
        <div className="flex gap-2">
          {outline?.lastSaved && (
            <span className="text-xs self-center" style={{ color: "var(--muted)" }}>Saved {outline.lastSaved}</span>
          )}
          <button onClick={save} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}>
            Save
          </button>
          <button onClick={handleExport} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "var(--surface)", color: "var(--accent)", border: "1px solid var(--border)" }}>
            .txt
          </button>
          <button onClick={handleExportPdf} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "var(--accent)", color: "#fff" }}>
            PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--accent)" }}>Question</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{question?.text}</p>
          </div>

          {/* Thesis */}
          <div className="mb-4">
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--foreground)" }}>
              Thesis Statement
            </label>
            <textarea
              value={outline?.thesis || ""}
              onChange={(e) => outline && setOutline({ ...outline, thesis: e.target.value })}
              placeholder="What is your main argument or position?"
              rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            />
          </div>

          {/* Body sections */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                Body Points
              </label>
              <button onClick={addSection} className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                + Add point
              </button>
            </div>
            <div className="space-y-3">
              {outline?.sections.map((section, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => updateSection(i, "heading", e.target.value)}
                      className="text-sm font-medium outline-none bg-transparent flex-1"
                      style={{ color: "var(--foreground)" }}
                    />
                    {(outline?.sections.length || 0) > 1 && (
                      <button onClick={() => removeSection(i)} className="text-xs hover:opacity-60" style={{ color: "var(--muted)" }}>
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(i, "content", e.target.value)}
                    placeholder="Key arguments, evidence, examples, references..."
                    rows={3}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y"
                    style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--foreground)" }}>
              Conclusion
            </label>
            <textarea
              value={outline?.conclusion || ""}
              onChange={(e) => outline && setOutline({ ...outline, conclusion: e.target.value })}
              placeholder="Summarize your argument and restate your thesis..."
              rows={2}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
