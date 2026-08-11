// Synthesized sound effects via the Web Audio API — no audio files to bundle, zero cost,
// zero network. Short oscillator tones distinguishing move types, matching the cues
// every chess app has (move/capture/check/castle/promote/game-end) without shipping assets.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, durationMs: number, delayMs = 0, type: OscillatorType = "sine", gain = 0.08) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(audio.destination);
  const start = audio.currentTime + delayMs / 1000;
  osc.start(start);
  g.gain.exponentialRampToValueAtTime(0.001, start + durationMs / 1000);
  osc.stop(start + durationMs / 1000 + 0.02);
}

export type SoundEvent = "move" | "capture" | "check" | "castle" | "promote" | "gameEnd" | "click" | "wrong";

export function playSound(event: SoundEvent, enabled: boolean) {
  if (!enabled) return;
  switch (event) {
    case "move": tone(420, 70); break;
    case "capture": tone(300, 90, 0, "square", 0.06); break;
    case "check": tone(660, 90); tone(880, 100, 60); break;
    case "castle": tone(420, 60); tone(520, 70, 50); break;
    case "promote": tone(520, 80); tone(660, 80, 60); tone(880, 120, 120); break;
    case "gameEnd": tone(300, 150); tone(240, 200, 140); break;
    case "click": tone(500, 40, 0, "triangle", 0.05); break;
    case "wrong": tone(180, 180, 0, "sawtooth", 0.05); break;
  }
}
