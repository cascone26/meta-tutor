/**
 * Tiny markdown-to-HTML renderer for AI chat/response text. Claude's raw output uses
 * **bold**, # headers, --- rules, and - lists, which were previously dumped straight
 * into `whitespace-pre-wrap` — every marker and every blank line showed up literally
 * (Jacob: "a lot of *** or --- or spaces"). This renders the common subset into real
 * HTML instead of pulling in a full markdown library (unified/remark/rehype) just for
 * chat bubbles.
 *
 * Call AFTER escapeHtml + linkCitations — those already insert raw `<a>` tags into the
 * string, and nothing here escapes or touches tag markup, only plain-text line/inline
 * patterns, so the citation links pass through untouched.
 */

function inlineFormat(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="rounded bg-stone-800 px-1.5 py-0.5 text-[0.85em] text-amber-300">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(?<![a-zA-Z0-9*])\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<![a-zA-Z0-9_])_([^_\n]+)_(?!_)/g, "<em>$1</em>");
}

const HR_RE = /^\s*([-*_])\s*(?:\1\s*){2,}$/;
const HEADER_RE = /^(#{1,4})\s+(.*)$/;
const UL_RE = /^\s*[-*+]\s+(.*)$/;
const OL_RE = /^\s*\d+[.)]\s+(.*)$/;

export function renderMarkdown(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let paragraphBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    const marker = listType === "ol" ? "list-decimal" : "list-disc";
    out.push(`<${tag} class="${marker} space-y-1 pl-5 my-2">${listBuffer.join("")}</${tag}>`);
    listBuffer = [];
    listType = null;
  };

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    out.push(`<p class="my-2 first:mt-0 last:mb-0">${paragraphBuffer.map(inlineFormat).join("<br/>")}</p>`);
    paragraphBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    if (HR_RE.test(line)) {
      flushParagraph();
      flushList();
      out.push('<hr class="my-4 border-stone-800" />');
      continue;
    }

    const headerMatch = line.match(HEADER_RE);
    if (headerMatch) {
      flushParagraph();
      flushList();
      const level = Math.min(headerMatch[1].length + 2, 4);
      out.push(`<h${level} class="vg-serif mt-4 mb-1.5 font-semibold text-stone-100 first:mt-0">${inlineFormat(headerMatch[2])}</h${level}>`);
      continue;
    }

    const ulMatch = line.match(UL_RE);
    if (ulMatch) {
      flushParagraph();
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(`<li>${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = line.match(OL_RE);
    if (olMatch) {
      flushParagraph();
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(`<li>${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    flushList();
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  flushList();

  return out.join("");
}
