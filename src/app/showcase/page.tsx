import type { Metadata } from "next";
import Image from "next/image";

const TITLE = "Meta Tutor — a multi-subject AI learning platform";
const DESCRIPTION =
  "A real, working AI tutoring platform I built and run solo — chess engine integration, adaptive Latin, AI chat grounded in real course notes, and a multi-contributor production setup. Screenshots of the actual live app, since it's login-gated.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

function Shot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="mb-14">
      <div className="rounded-xl overflow-hidden border border-white/10">
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={800}
          className="w-full h-auto"
        />
      </div>
      <figcaption className="text-sm text-slate-400 mt-3 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0d] text-[#eceae6] px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16">
          <p className="text-sm font-medium text-blue-400 tracking-wide mb-3">
            Case study — why there&rsquo;s no login link above
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Meta Tutor
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">
            A multi-subject AI learning platform I built and run solo — chess with a
            real Stockfish engine, adaptive comprehensible-input Latin, and an AI chat
            layer grounded in actual course notes, all sharing one progress-tracking
            architecture. It&rsquo;s a real production app with real daily users (me, my
            co-teaching cousin, our students&rsquo; parents via the RCA section) — which is
            also exactly why it&rsquo;s login-gated to two whitelisted Google accounts, not
            open to the public. This page exists so you can see it without needing an
            account: real screenshots of the real running app, plus the engineering
            story behind the two things that made it production-grade this month.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://builtsimple.dev/jacob-cascone"
              className="rounded-lg border border-white/15 hover:border-white/30 transition-colors px-5 py-2.5 text-sm font-semibold"
            >
              ← Back to portfolio
            </a>
            <a
              href="https://github.com/cascone26/meta-tutor"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 hover:border-white/30 transition-colors px-5 py-2.5 text-sm font-semibold"
            >
              Source on GitHub ↗
            </a>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase mb-6">
            The app
          </h2>
          <Shot
            src="/showcase/hub.png"
            alt="Meta Tutor subject hub"
            caption="The hub — every subject is its own adapter plugged into one shared progress-tracking and AI-chat layer, not a copy-pasted feature per subject."
          />
          <Shot
            src="/showcase/chess.png"
            alt="Chess module with a real Stockfish engine"
            caption="Chess — a real Stockfish engine running client-side (zero server cost), live move-quality classification, puzzle mode, full board customization, wired into the same cross-subject progress system as everything else."
          />
          <Shot
            src="/showcase/latin-lab.png"
            alt="Latin Lab adaptive comprehensible-input course"
            caption="Latin Lab — a comprehensible-input Latin course where comprehension checks are AI-generated per attempt and get harder as accuracy climbs, with FSRS spaced-repetition vocabulary review instead of a fixed schedule."
          />
          <Shot
            src="/showcase/ethics.png"
            alt="Ethics T/F exam prep AI chat"
            caption="Ethics — AI chat tuned for T/F exam prep, answers grounded in real course notes (not generic LLM knowledge), plus an 85-question study quiz and a 48-term glossary. Built by my cousin Cris as the first real contribution from another engineer on this codebase."
          />
        </section>

        <section className="mb-20">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase mb-6">
            The deploy pipeline was actually broken — root-caused and fixed
          </h2>
          <div className="text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              Cris couldn&rsquo;t test his first real PR against production: sign-in
              failed, and he had no way to know why from his own machine. I treated that
              as a real incident, not a shrug.
            </p>
            <p>
              Root cause: this GitHub repo was connected to{" "}
              <span className="text-white font-medium">three separate Vercel projects
              across three different accounts</span>, left over from a prior
              account-migration — and the one I actually had API/CLI access to had{" "}
              <span className="text-white font-medium">no Git repository linked at
              all</span>. Its real secrets (auth, OAuth, database) were also scoped to
              Production only, never Preview — so even a working preview deploy would
              have had broken sign-in regardless.
            </p>
            <p>Fixed in one pass:</p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  Connected the correct GitHub repo to the one project I could actually
                  manage, so pushes auto-deploy for real.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  Copied every Production-only secret (auth, Google OAuth, database)
                  into the Preview environment too.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  Verified end-to-end with a real deploy, not just a green checkmark —
                  confirmed the live URL actually resolves the right routes instead of
                  erroring.
                </span>
              </li>
            </ul>
            <p>
              Still genuinely open: Google&rsquo;s OAuth redirect-URI allowlist is
              Console-UI-only — no API path exists for a standard web client, confirmed
              by trying. That one needs a two-minute manual click, logged honestly as
              open rather than silently assumed fixed.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase mb-6">
            Built for a second engineer, not just myself
          </h2>
          <div className="text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              When my cousin joined to build his own section, the actual goal was
              narrower than &ldquo;add a collaborator&rdquo;: make it so he{" "}
              <span className="text-white font-medium">cannot break production</span>,
              without blocking either of us.
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  A GitHub ruleset requires a PR on <code className="text-slate-400">main</code> —
                  zero required approvals, so I&rsquo;m never blocked soloing, but every
                  change gets a CI run and an isolated Vercel preview URL.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  CI runs a real typecheck + build gate on every PR, against the actual
                  production environment variables — not a mocked config that could pass
                  while the real deploy fails.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">›</span>
                <span>
                  Lane separation by convention: every subject is its own top-level
                  route with its own component and content folders, so two people&rsquo;s
                  files never physically collide — documented in this repo&rsquo;s own{" "}
                  <code className="text-slate-400">CLAUDE.md</code> for whoever (human or
                  AI-assisted) touches it next.
                </span>
              </li>
            </ul>
            <p>
              First real PR from the second contributor merged clean through that exact
              pipeline — CI gate, preview URL, no production incident.
            </p>
          </div>
        </section>

        <footer className="pt-10 border-t border-white/10 text-sm text-slate-500">
          Built and operated solo by Jacob Cascone ·{" "}
          <a
            href="https://builtsimple.dev/jacob-cascone"
            className="underline hover:text-slate-300"
          >
            full portfolio
          </a>
        </footer>
      </div>
    </main>
  );
}
