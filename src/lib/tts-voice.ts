"use client";

// Shared browser TTS voice picker — used by AudioReview and the new
// PhonogramAudioQuiz. Before this, every SpeechSynthesisUtterance was built
// with zero voice set, which just falls back to whatever the OS/browser
// picks as its absolute default — often a low-quality or oddly-accented
// voice, with no way for Jacob to change it. Jacov, 2026-08-24: "the
// phonagram voice needs to change." This gives a real picker (persisted) and
// a sane default (prefers an enhanced/"natural"-labeled US English voice
// when one is installed, since those are audibly clearer than the
// compact/robotic default voices most OSes also ship).
const STORAGE_KEY = "meta-tutor-tts-voice-uri";

export function getSavedVoiceURI(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveVoiceURI(uri: string) {
  try {
    localStorage.setItem(STORAGE_KEY, uri);
  } catch {}
}

// Voice lists load asynchronously on most browsers (voiceschanged event) —
// callers should call this after that's fired at least once, or poll briefly.
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
}

// Ranks candidate voices so a good one is picked by default without the user
// having to know to change anything: explicit user choice first, then
// "enhanced"/"natural"/"premium"-labeled voices (higher quality on most
// platforms), then any US English voice, then any English voice at all.
export function pickDefaultVoice(): SpeechSynthesisVoice | null {
  const voices = getEnglishVoices();
  if (voices.length === 0) return null;

  const savedUri = getSavedVoiceURI();
  if (savedUri) {
    const saved = voices.find((v) => v.voiceURI === savedUri);
    if (saved) return saved;
  }

  const isEnhanced = (v: SpeechSynthesisVoice) => /natural|enhanced|premium|neural/i.test(v.name);
  const isUS = (v: SpeechSynthesisVoice) => v.lang.toLowerCase() === "en-us";

  return (
    voices.find((v) => isEnhanced(v) && isUS(v)) ??
    voices.find(isEnhanced) ??
    voices.find(isUS) ??
    voices[0]
  );
}

export function speakWithVoice(text: string, opts: { rate?: number; voice?: SpeechSynthesisVoice | null; onEnd?: () => void } = {}): SpeechSynthesisUtterance {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts.rate ?? 1;
  const voice = opts.voice ?? pickDefaultVoice();
  if (voice) utter.voice = voice;
  if (opts.onEnd) utter.onend = () => opts.onEnd?.();
  window.speechSynthesis.speak(utter);
  return utter;
}
