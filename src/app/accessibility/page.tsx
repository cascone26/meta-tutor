import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Meta Tutor's commitment to web accessibility and WCAG 2.2 AA compliance.",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Accessibility Statement</h1>
        <p className="text-slate-300 mb-8">Meta Tutor is committed to ensuring digital accessibility for all learners.</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Commitment</h2>
            <p className="text-slate-300">We are committed to providing educational tools that are accessible to learners with diverse abilities and needs. We aim to comply with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standard.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Standards Compliance</h2>
            <ul className="text-slate-300 space-y-2 list-disc list-inside">
              <li>WCAG 2.2 Level AA compliance</li>
              <li>Keyboard navigation support for all interactive elements</li>
              <li>Color contrast ratios meet 4.5:1 standard for normal text</li>
              <li>Respect for user motion preferences (prefers-reduced-motion)</li>
              <li>Semantic HTML structure for screen readers</li>
              <li>Alt text for all images</li>
              <li>Properly labeled form fields</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Accessibility Features</h2>
            <ul className="text-slate-300 space-y-2 list-disc list-inside">
              <li>Full keyboard navigation without requiring mouse</li>
              <li>Screen reader compatible interface</li>
              <li>Readable fonts with adequate line spacing and text sizing</li>
              <li>Animations and transitions respect prefers-reduced-motion preferences</li>
              <li>Clear focus indicators on all interactive elements</li>
              <li>Proper heading hierarchy for document structure</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Known Limitations</h2>
            <p className="text-slate-300 mb-2">We are continually working to improve the accessibility of Meta Tutor. If you encounter an accessibility issue, please contact us so we can address it promptly.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
            <p className="text-slate-300">If you experience any accessibility issues on Meta Tutor, please reach out and describe the issue and the page where it occurred.</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">Last updated: September 2026</p>
        </div>
      </div>
    </main>
  );
}
