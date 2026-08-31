// No DOMPurify/jsdom — used to depend on isomorphic-dompurify, but that package eagerly
// constructs a JSDOM instance at MODULE IMPORT time (not lazily on first .sanitize() call),
// and Next.js still executes "use client" component bodies during its SSR pass (not just
// effects). Any component importing this file at all — e.g. RcaAssistant.tsx, whose
// pre-populated first message calls formatMarkdown() synchronously in render — pulled
// jsdom into the server bundle. Found live 2026-08-31: a Turbopack/jsdom transitive-
// dependency ESM interop break (html-encoding-sniffer requiring an ESM-only @exodus/bytes
// module) took down every /rca/[slug] page with a 500 in production. A lazy require()
// guarded behind a client-only check did NOT fix it either — Turbopack still eagerly
// evaluated it as part of the root server chunk regardless of the runtime branch.
//
// The actual fix: don't need a sanitizer at all. Escape raw angle brackets/ampersands in
// the input FIRST, so any literal HTML in the source text becomes inert entities. Only
// AFTER that do our own fixed regex replacements run, and they only ever introduce the
// exact tags written in the code below (never derived from input content) — so the output
// can only ever contain this fixed, closed tag set, by construction, identically to what
// DOMPurify's ALLOWED_TAGS was already restricting to. Same behavior, server and client,
// no branching, no jsdom dependency.
export function formatMarkdown(text: string): string {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return escaped
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
    .replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Line breaks
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
