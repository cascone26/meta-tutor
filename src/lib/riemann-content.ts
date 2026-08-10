// Self-paced "zero to real understanding" curriculum on the Riemann Hypothesis.
// Uses the same generic Lesson/SubjectContent schema as the RCA subjects, but this
// station isn't RCA/teaching-prep — it's Jacob's own study track, so it's self-paced
// (no weekly-teaching-schedule interpolation) rather than date-driven.
import type { SubjectContent } from "@/lib/rca-content/types";

export const riemannContent: SubjectContent = {
  overview:
    "12 lessons, zero background required. Each one builds directly on the last — read them in order the first " +
    "time through. Goal: by the end, you can state what the Riemann Hypothesis actually claims, why it's stated " +
    "that way, and why mathematicians care, in your own words.",
  lessons: [
    {
      n: 1,
      sections: [
        {
          label: "Big picture",
          text:
            "Primes (2, 3, 5, 7, 11, 13, ...) are the \"atoms\" of arithmetic — every whole number greater than 1 " +
            "factors into primes in exactly one way (the Fundamental Theorem of Arithmetic). But despite being the " +
            "most basic objects in number theory, nobody has ever found a simple formula that produces them in order.",
        },
        {
          label: "The mystery",
          text:
            "Unlike squares (1, 4, 9, 16, ...) or triangular numbers, primes have no predictable spacing. 2 and 3 " +
            "differ by 1; 7 and 11 differ by 4; there are twin primes (like 17 and 19) even very far out, but also " +
            "huge stretches with no primes at all. The gaps look almost random.",
        },
        {
          label: "The reframe",
          text:
            "Mathematicians gave up trying to predict individual primes and asked a different question instead: " +
            "roughly how many primes are there below a given number X? That turns a hopeless problem (predict this " +
            "one number) into a tractable one (predict a density) — and it's the question this whole course builds toward.",
        },
        {
          label: "Where RH fits",
          text:
            "The Riemann Hypothesis, at heart, is a precision claim about exactly how good our best guess for " +
            "\"how many primes below X\" can be. It's not about finding primes — it's about how tightly we can bound our approximation of them.",
        },
      ],
    },
    {
      n: 2,
      sections: [
        {
          label: "Core idea",
          text:
            "Define π(x) = the number of primes ≤ x. So π(10) = 4 (the primes 2, 3, 5, 7), and π(100) = 25. This " +
            "function π(x) — how many primes exist up to a point — is the object everything in this course is ultimately about.",
        },
        {
          label: "The Prime Number Theorem",
          text:
            "Proved in 1896 (Hadamard and de la Vallée Poussin, independently): π(x) is approximately x / ln(x) for " +
            "large x. Gauss guessed this as a teenager decades earlier. A refined version uses the \"logarithmic " +
            "integral\" Li(x), which tracks π(x) even more closely.",
        },
        {
          label: "Worked example",
          text:
            "At x = 1,000,000: the actual count is π(x) = 78,498. The simple estimate x/ln(x) ≈ 72,382 — off by " +
            "about 8%. The better estimate Li(x) ≈ 78,628 — off by only about 130, a tiny fraction of a percent.",
        },
        {
          label: "The open question",
          text:
            "The Prime Number Theorem tells you primes thin out roughly like 1/ln(x) as numbers get bigger — but it " +
            "says nothing about exactly how far Li(x) can drift from the true π(x) at any given point. That error " +
            "term — how big the gap between guess and truth can possibly get — is exactly where the Riemann Hypothesis lives.",
        },
      ],
    },
    {
      n: 3,
      sections: [
        {
          label: "Core idea",
          text:
            "In the 1730s, Euler found a strange and beautiful identity: the sum of 1/n^s over every whole number n " +
            "(for s > 1) equals a product over every prime p of 1/(1 − p^−s). This is the Euler product.",
        },
        {
          label: "Why it's strange",
          text:
            "The left side — a sum over all integers — doesn't mention primes at all. The right side is built " +
            "entirely FROM primes. Their equality means every fact you can extract from that sum secretly encodes a " +
            "fact about how primes are distributed.",
        },
        {
          label: "The intuition (not the full proof)",
          text:
            "Expand 1/(1 − p^−s) as 1 + p^−s + p^−2s + p^−3s + ... for each prime p. Multiplying these expansions " +
            "together, for every prime, reconstructs every whole number exactly once — because every whole number " +
            "has exactly one prime factorization. That's the mechanism behind the identity.",
        },
        {
          label: "Why it matters",
          text:
            "This sum, Σ 1/n^s, is exactly the object that becomes the Riemann zeta function once Riemann generalizes " +
            "s from a real number to a complex one — which is the move that makes everything else in this course possible.",
        },
      ],
    },
    {
      n: 4,
      sections: [
        {
          label: "Core idea",
          text:
            "A complex number is s = a + bi, where i² = −1. Picture it as a point on a 2D plane: a is the \"real " +
            "part\" (horizontal axis), b is the \"imaginary part\" (vertical axis).",
        },
        {
          label: "Why bother",
          text:
            "Real numbers alone can't reveal certain patterns. Letting s roam over the whole complex plane turns " +
            "zeta from a single curve (a 1D graph) into a full 2D landscape — and that landscape has structure that's " +
            "completely invisible if you only ever look along the real-number line.",
        },
        {
          label: "Notation you'll see",
          text:
            "Re(s) means the real part of s, Im(s) the imaginary part. When people say \"the critical line Re(s) = " +
            "1/2,\" they mean the vertical line made of every complex number whose real part is exactly 1/2 — an " +
            "infinite vertical line, not a single point.",
        },
        {
          label: "What you don't need",
          text:
            "You don't need to already be fluent in complex analysis to follow this course. Just get comfortable " +
            "with: a complex number is a 2D point, and a function of it can be pictured as a landscape stretched over that plane.",
        },
      ],
    },
    {
      n: 5,
      sections: [
        {
          label: "Core idea",
          text:
            "Riemann's 1859 paper defined ζ(s) = Σ (n=1 to ∞) 1/n^s for complex s, and showed the Euler product from " +
            "Lesson 3 still holds — but only when Re(s) > 1. Outside that region, the sum doesn't converge (it never " +
            "settles on a finite value).",
        },
        {
          label: "The problem",
          text:
            "That means the formula is completely useless for Re(s) ≤ 1 — which is precisely the region Riemann most wanted to explore.",
        },
        {
          label: "The fix, previewed",
          text:
            "Riemann showed ζ can be extended to a function defined almost everywhere else in the complex plane " +
            "(everywhere except a single point, s = 1) using a different expression entirely — one that agrees with " +
            "the sum wherever the sum is valid, but keeps making sense where the sum breaks down. That extension " +
            "technique is called analytic continuation, and it's the subject of the next lesson.",
        },
        {
          label: "Why it matters",
          text:
            "This extended zeta function — not the simple sum — is the one the Riemann Hypothesis is actually about. " +
            "The sum only tells half the story.",
        },
      ],
    },
    {
      n: 6,
      sections: [
        {
          label: "Core idea",
          text:
            "Picture a function's graph as a piece of paper with a formula that's only defined on part of it. " +
            "Analytic continuation is the (surprisingly rigid) mathematical fact that for a well-behaved " +
            "(\"analytic,\" meaning complex-differentiable) function, there's often exactly one way to extend that " +
            "graph beyond where the original formula works — no guessing, no ambiguity.",
        },
        {
          label: "An everyday analogy",
          text:
            "It's like recognizing a song from its first few notes. A pattern that's smooth enough has, in a precise " +
            "sense, only one way it could continue and still be smooth.",
        },
        {
          label: "What Riemann actually did",
          text:
            "He found an alternate expression for zeta, valid across the whole complex plane except at s = 1 (where " +
            "zeta genuinely blows up to infinity — a \"pole\"). This continuation exactly matches Σ 1/n^s wherever " +
            "Re(s) > 1, but also gives real, finite values everywhere else.",
        },
        {
          label: "Why it matters",
          text:
            "This is what makes a question like \"what is ζ(−1)?\" meaningful. The famous result ζ(−1) = −1/12 is a " +
            "real, provable value of this continued function — it is NOT the divergent sum \"1 + 2 + 3 + ...\", which " +
            "is a popular-math misconception worth flagging explicitly.",
        },
      ],
    },
    {
      n: 7,
      sections: [
        {
          label: "Core idea",
          text:
            "Riemann proved zeta obeys a functional equation — a precise formula relating ζ(s) to ζ(1 − s), letting " +
            "you compute zeta at s if you know it at 1 − s, and vice versa, via a kind of reflection centered on the point s = 1/2.",
        },
        {
          label: "Why this matters immediately",
          text:
            "It means Re(s) = 1/2 is structurally special — it's the axis of symmetry for the whole function. " +
            "Anything true \"on average\" about zeta's behavior naturally organizes itself around that line.",
        },
        {
          label: "The critical strip",
          text:
            "The Euler product already shows zeta has no zeros when Re(s) > 1. The functional equation mirrors that " +
            "fact onto Re(s) < 0. So every interesting zero — every nontrivial one — has to live in the strip between " +
            "them: 0 < Re(s) < 1. This region is called the critical strip.",
        },
        {
          label: "Why it matters",
          text: "The Riemann Hypothesis is entirely a claim about exactly where, within this strip, zeros are allowed to sit.",
        },
      ],
    },
    {
      n: 8,
      sections: [
        {
          label: "Core idea",
          text: "A \"zero\" of zeta is a value of s where ζ(s) = 0. There are two completely different families of them.",
        },
        {
          label: "Trivial zeros",
          text:
            "These sit at s = −2, −4, −6, −8, ... (the negative even integers). They fall directly out of the " +
            "functional equation and are fully understood and fully predictable. \"Trivial\" means \"not the " +
            "interesting ones\" here — not that they're unimportant to know about.",
        },
        {
          label: "Nontrivial zeros",
          text:
            "Every other zero, and all of them live inside the critical strip 0 < Re(s) < 1. Unlike the trivial " +
            "zeros, there's no formula for these — they have to be located/approximated one at a time, and their " +
            "positions are deeply tied to how primes are distributed.",
        },
        {
          label: "Why it matters",
          text:
            "Every nontrivial zero found so far — trillions of them, computed to extreme precision — has Re(s) " +
            "exactly equal to 1/2. The Riemann Hypothesis says that isn't a coincidence: it says ALL of them do, with no exceptions, ever.",
        },
      ],
    },
    {
      n: 9,
      sections: [
        {
          label: "The statement",
          text:
            "\"All nontrivial zeros of the Riemann zeta function have real part exactly 1/2.\" That's the entire " +
            "hypothesis — deceptively short for a problem that's been open since 1859.",
        },
        {
          label: "Restated visually",
          text:
            "Picture the critical strip as a vertical band running from Re(s) = 0 to Re(s) = 1. RH claims every " +
            "nontrivial zero sits exactly on the center line, Re(s) = 1/2 — not 0.49999, not 0.50001, exactly 1/2, every single time.",
        },
        {
          label: "What's actually proven (not hypothesis — proven fact)",
          text:
            "Infinitely many zeros are proven to lie on the critical line (Hardy, 1914). A proven positive " +
            "proportion of all zeros lie on it (later work pushed this fraction higher over the decades). The first " +
            "many trillions of zeros, checked by computer, all lie exactly on it, with zero exceptions found. None of " +
            "this proves ALL of them do — that remaining gap is exactly what keeps RH open.",
        },
        {
          label: "Common confusion",
          text:
            "RH is not about finding more primes, and it's not a claim that primes are \"random.\" It's a precise " +
            "geometric claim about where specific complex numbers (zeta's zeros) are located.",
        },
      ],
    },
    {
      n: 10,
      sections: [
        {
          label: "Core idea",
          text:
            "Riemann derived an explicit formula connecting zeta's zeros directly to π(x), the prime-counting " +
            "function from Lesson 2. Each nontrivial zero contributes a specific correction \"wave\" to the smooth Li(x) approximation.",
        },
        {
          label: "The stakes if RH is true",
          text:
            "Those correction waves are as small and well-behaved as they can possibly be — meaning Li(x) is " +
            "essentially the best possible approximation to π(x), with an error bound far tighter than anything currently provable without assuming RH.",
        },
        {
          label: "The stakes if RH is false",
          text:
            "Even one stray zero off the critical line would mean the error between Li(x) and the true π(x) could, " +
            "in principle, behave far more wildly and unpredictably than currently observed.",
        },
        {
          label: "Beyond primes",
          text:
            "Variants and consequences of RH underlie conjectural bounds across number theory and computational " +
            "complexity. Many published theorems today are proven \"conditional on RH\" — meaning they're correct if " +
            "RH is true, and are effectively waiting on this exact result. This is why RH is one of the seven " +
            "Millennium Prize Problems ($1M from the Clay Institute) and is widely considered the single most " +
            "important open problem in mathematics.",
        },
      ],
    },
    {
      n: 11,
      sections: [
        {
          label: "Core idea",
          text:
            "RH has resisted every attack since 1859, despite enormous effort from some of the best mathematicians " +
            "in history — Hadamard, de la Vallée Poussin, Hardy, Littlewood, Selberg, Levinson, Conrey, and many others.",
        },
        {
          label: "What's been chipped away",
          text:
            "The proportion of zeros provably on the line has climbed slowly over the decades (Levinson pushed it " +
            "above 1/3, Conrey above 2/5). Computational verification now covers an enormous number of zeros with " +
            "zero exceptions found. \"Zero-density\" theorems bound how far astray zeros could possibly wander even if RH turns out to be false.",
        },
        {
          label: "What hasn't worked",
          text:
            "No one has found a single counterexample (a zero proven to be off the line), and no one has found a " +
            "complete proof. Either one would instantly become one of the most famous results in the history of mathematics.",
        },
        {
          label: "Why it's still open",
          text:
            "RH sits at the intersection of analysis, algebra, and number theory in a way that seems to demand " +
            "genuinely new mathematical ideas, not just harder computation — nearly every \"obvious\" strategy from " +
            "the last century has been tried and has fallen short of a full proof.",
        },
      ],
    },
    {
      n: 12,
      sections: [
        {
          label: "Where you are now",
          text:
            "You now have the real shape of the problem: primes, ζ(s), analytic continuation, the critical strip, " +
            "and what \"on the line\" actually means. That's most of what's needed to follow serious expository " +
            "writing on RH — and a real foundation if you ever want to go deeper into the actual mathematics.",
        },
        {
          label: "Natural next steps",
          text:
            "If you want to go further: (1) complex analysis basics — contour integration and residues, the actual " +
            "toolkit behind analytic continuation; (2) a real proof of the Prime Number Theorem; (3) Riemann's " +
            "original 1859 paper in translation — it's short (about 8 pages) and genuinely readable with the " +
            "background you now have.",
        },
        {
          label: "A note on scope",
          text:
            "This station deliberately stayed at the conceptual level. Real fluency with the machinery — deriving " +
            "the explicit formula, working with L-functions, contour-integral proofs — is graduate-level material. " +
            "Use the assistant below to go as deep as you want on any single lesson.",
        },
        {
          label: "The goal, achieved",
          text:
            "Zero to a real conceptual understanding of what the Riemann Hypothesis actually says and why it " +
            "matters — that was the point of this station. From here it's depth, not breadth.",
        },
      ],
    },
  ],
};
