// Per-frame YIN output is already accurate to a tiny fraction of a cent (see
// scripts/mt-guitar-dsp-test.ts) — but a continuous mic feed still has single-frame glitches
// (a stray noise spike, the pick attack transient, a frame that briefly locks onto a
// harmonic). A tuner that flickers between readings FEELS imprecise even when each reading
// is individually fine. This stabilizer is what actually delivers "rock solid" on screen:
// median-smooth a short rolling window, auto-correct clean octave misdetections back in line
// with recent history, and require two consecutive agreeing frames before adopting a real
// jump (debounced) — so one glitchy frame gets held/ignored instead of flashing on screen,
// while a genuine note change (a real second string struck) still lands within ~2 frames,
// imperceptibly fast at any real polling rate.
const WINDOW = 6; // ~6 consecutive valid frames — a few dozen ms at typical rAF rates
const OUTLIER_REJECT_CENTS = 65; // wider than realistic vibrato/bend within that span
const OCTAVE_TOLERANCE_CENTS = 50;
const JUMP_CONFIRM_TOLERANCE_CENTS = 30; // how close two "candidate" frames must agree

function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export type PitchStabilizer = {
  /** Feed one frame's raw YIN frequency (or null for silence/no-pitch). Returns the
   *  stabilized frequency to display, or null if there's nothing to show yet. */
  push(freq: number | null): number | null;
  reset(): void;
};

export function createPitchStabilizer(): PitchStabilizer {
  let history: number[] = [];
  let candidate: { freq: number } | null = null;

  return {
    push(freq) {
      if (freq === null) {
        candidate = null;
        if (history.length > 0) history = history.slice(1); // drop oldest, don't hard-reset on one silent frame
        return history.length ? median(history) : null;
      }

      if (history.length > 0) {
        const med = median(history);
        const cents = 1200 * Math.log2(freq / med);

        if (Math.abs(cents) > OUTLIER_REJECT_CENTS) {
          const distFromOctave = Math.abs(Math.abs(cents) - 1200);
          if (distFromOctave < OCTAVE_TOLERANCE_CENTS) {
            // Clean octave relationship to recent history — almost certainly a one-frame
            // octave misdetection, not a real pitch change. Correct it in place.
            freq = cents > 0 ? freq / 2 : freq * 2;
            candidate = null;
          } else if (candidate && Math.abs(1200 * Math.log2(freq / candidate.freq)) < JUMP_CONFIRM_TOLERANCE_CENTS) {
            // A second consecutive frame agreeing with the pending candidate — this is a
            // real jump (different string/note). Commit: start a fresh window on it.
            history = [];
            candidate = null;
          } else {
            // First frame of a possible jump — could be a genuine note change or a one-off
            // glitch. Hold the old display for now and wait for a confirming second frame.
            candidate = { freq };
            return median(history);
          }
        } else {
          candidate = null;
        }
      }

      history.push(freq);
      if (history.length > WINDOW) history.shift();
      return median(history);
    },
    reset() {
      history = [];
      candidate = null;
    },
  };
}
