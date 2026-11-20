// YIN pitch detection (de Cheveigne & Kawahara, 2002) — monophonic fundamental-frequency
// estimation off a raw time-domain buffer. Used for the tuner (single plucked string).
// No external deps on purpose: this runs every animation frame in the browser, and a
// well-known ~40-line algorithm is easier to trust/tune than pulling in a pitch-detection
// package for one function.

export type PitchResult = {
  frequency: number;
  /** YIN's own confidence proxy — lower is a cleaner periodic signal, 0 is perfect. */
  clarity: number;
};

export function detectPitchYin(buffer: Float32Array, sampleRate: number, threshold = 0.15): PitchResult | null {
  const halfBufferSize = Math.floor(buffer.length / 2);
  const yinBuffer = new Float32Array(halfBufferSize);

  // Step 1-2: difference function + cumulative mean normalized difference function.
  let runningSum = 0;
  yinBuffer[0] = 1;
  for (let tau = 1; tau < halfBufferSize; tau++) {
    let sum = 0;
    for (let i = 0; i < halfBufferSize; i++) {
      const delta = buffer[i] - buffer[i + tau];
      sum += delta * delta;
    }
    runningSum += sum;
    yinBuffer[tau] = runningSum === 0 ? 1 : (sum * tau) / runningSum;
  }

  // Step 3: absolute threshold — first dip below threshold, walked to its local minimum.
  let tauEstimate = -1;
  for (let tau = 2; tau < halfBufferSize; tau++) {
    if (yinBuffer[tau] < threshold) {
      while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) tau++;
      tauEstimate = tau;
      break;
    }
  }
  if (tauEstimate === -1) return null; // no sufficiently periodic signal — silence or noise

  // Step 4: parabolic interpolation around the minimum for sub-sample precision.
  const x0 = tauEstimate < 1 ? tauEstimate : tauEstimate - 1;
  const x2 = tauEstimate + 1 < halfBufferSize ? tauEstimate + 1 : tauEstimate;
  let betterTau = tauEstimate;
  if (x0 !== tauEstimate && x2 !== tauEstimate) {
    const s0 = yinBuffer[x0], s1 = yinBuffer[tauEstimate], s2 = yinBuffer[x2];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (denom !== 0) betterTau = tauEstimate + (s2 - s0) / denom;
  }

  if (betterTau <= 0) return null;
  return { frequency: sampleRate / betterTau, clarity: yinBuffer[tauEstimate] };
}

/** RMS amplitude of a time-domain buffer, for a simple "is anything being played" gate. */
export function rms(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}

// Guitar's usable range is ~70Hz (low E, slightly detuned) to ~1200Hz (high fretted notes).
// Rejecting outside that band kills most octave errors and room-noise rumble.
export const MIN_GUITAR_HZ = 70;
export const MAX_GUITAR_HZ = 1300;
export const SILENCE_RMS = 0.01;
