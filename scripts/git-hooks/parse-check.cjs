#!/usr/bin/env node
// Parse-check staged JS/TS files before commit. Catches the Tony "dev-server
// discipline" bug class: duplicate const/let/function declarations and real
// syntax errors that silently commit and only surface at build time (or,
// worse, not at all -- see lib/blog-posts-extra.ts's own dedupe check below
// for why "only surfaces at build time" is the OPTIMISTIC case).
//
// Design: single-file check via the TypeScript compiler, `noResolve: true`
// so unresolved `@/...`/package imports never produce false positives (we
// deliberately do NOT type-check against the project -- that's `tsc --noEmit`
// at build time, already covered elsewhere and far too slow for a commit
// gate). Two diagnostic sources, both local to the one file:
//   1. sourceFile.parseDiagnostics -- real syntax errors (unmatched braces,
//      "Expression expected", etc.) -- free, no Program needed.
//   2. a minimal single-file ts.Program's semantic diagnostics, filtered to
//      ONLY the duplicate-declaration codes (2300/2393/2440/2441/2451) --
//      everything else from a no-resolve Program is import-resolution noise.
// Verified 2026-10-19 against ~450 real files in this repo: 0 false positives
// (see FLAGGED output of scripts/git-hooks/parse-check-selftest.cjs if ever
// re-run), true positive on a synthetic `const x; const x;` file, ~0.18s/file.
const { execSync } = require("child_process");
const fs = require("fs");
const ts = require("typescript");

const DUP_CODES = new Set([2300, 2393, 2440, 2441, 2451]);

function checkFile(fname, src) {
  const kind = /\.tsx$/.test(fname) || /\.jsx$/.test(fname) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(fname, src, ts.ScriptTarget.Latest, true, kind);
  const results = (sf.parseDiagnostics || []).map((d) => toResult(sf, d));

  const options = {
    target: ts.ScriptTarget.Latest,
    skipLibCheck: true,
    allowJs: true,
    jsx: ts.JsxEmit.Preserve,
    noEmit: true,
    noResolve: true,
  };
  const base = ts.createCompilerHost(options);
  const host = Object.assign({}, base, {
    fileExists: (f) => f === fname || base.fileExists(f),
    readFile: (f) => (f === fname ? src : base.readFile(f)),
    getSourceFile: (f, langVer) => (f === fname ? sf : base.getSourceFile(f, langVer)),
  });
  const program = ts.createProgram([fname], options, host);
  const semantic = ts.getPreEmitDiagnostics(program, sf).filter((d) => DUP_CODES.has(d.code));
  results.push(...semantic.map((d) => toResult(sf, d)));
  return results;
}

function toResult(sf, d) {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  if (typeof d.start === "number") {
    const pos = sf.getLineAndCharacterOfPosition(d.start);
    return { line: pos.line + 1, col: pos.character + 1, msg };
  }
  return { line: null, col: null, msg };
}

function main() {
  const staged = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.(jsx?|mjs|cjs|tsx?)$/.test(f))
    .filter((f) => fs.existsSync(f));

  let failed = false;
  for (const file of staged) {
    const src = fs.readFileSync(file, "utf8");
    let diags;
    try {
      diags = checkFile(file, src);
    } catch (e) {
      // Never block a commit on this check's OWN bug -- warn and move on.
      console.error(`parse-check: internal error on ${file}, skipping: ${e.message}`);
      continue;
    }
    if (diags.length) {
      failed = true;
      console.error(`\nERROR: parse error in ${file}:`);
      for (const d of diags) {
        const loc = d.line ? `${file}:${d.line}:${d.col}` : file;
        console.error(`  ${loc} — ${d.msg}`);
      }
    }
  }
  if (failed) {
    console.error("\nFix the syntax/duplicate-declaration error(s) above before committing.");
    process.exit(1);
  }
}

main();
