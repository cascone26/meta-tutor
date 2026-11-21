// Plays a clean reference pitch through the speaker — pure audio OUTPUT, no mic/permission
// needed, so it works even before the tuner's mic flow has started. A short, self-contained
// AudioContext per play call (these are infrequent button presses, not a hot loop) with a
// gentle attack/release envelope so it doesn't click.
export function playReferenceTone(frequency: number, durationSec = 1.3) {
  if (typeof window === "undefined") return;
  const AudioCtxCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtxCtor();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.3, now + 0.03);
  gain.gain.setValueAtTime(0.3, now + durationSec - 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.05);
  osc.onended = () => ctx.close().catch(() => {});
}
