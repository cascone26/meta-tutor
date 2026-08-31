// isomorphic-dompurify eagerly constructs a JSDOM instance at MODULE IMPORT time (not on
// first .sanitize() call) — see node_modules/isomorphic-dompurify/dist/index.js:49-50.
// Next.js still executes "use client" component bodies during its SSR pass (not just
// effects), so any component importing this file at all — e.g. RcaAssistant.tsx, whose
// pre-populated first message calls formatMarkdown() synchronously in render — pulls
// jsdom into the server bundle too. Found live 2026-08-31: a Turbopack/jsdom transitive-
// dependency ESM interop break (html-encoding-sniffer requiring an ESM-only @exodus/bytes
// module) took down every /rca/[slug] page with a 500 in production, purely from this
// import existing at module top level. Fix: never statically import isomorphic-dompurify —
// lazily require() it only inside the client branch below, so the server bundle never
// evaluates jsdom at all. Server-side, escape raw angle brackets in the input first, then
// build HTML only from our own fixed regex replacements (a closed, trusted tag set we
// generate ourselves) — safe by construction without needing a sanitizer. Client-side
// behavior (real DOMPurify, real browser DOM) is unchanged.
export function formatMarkdown(text: string): string {
  const isServer = typeof window === "undefined";
  const source = isServer ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : text;

  const html = source
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold, italic, underline (double-underscore, doesn't collide with the
    // single/double-asterisk bold+italic syntax above)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    // Code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Line breaks
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");

  if (isServer) return html; // already safe by construction — see comment above

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("isomorphic-dompurify") as typeof import("isomorphic-dompurify");
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "strong", "em", "u", "s", "code", "blockquote", "ul", "ol", "li", "br", "p"],
    ALLOWED_ATTR: [],
  });
}
