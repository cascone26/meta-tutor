// Converts a real Latin word into a spelling a real Italian neural TTS voice
// (edge-tts it-IT-*) will read correctly under ECCLESIASTICAL (Church Latin)
// pronunciation — the system RCA actually teaches, not classical.
//
// This works because ecclesiastical Latin's sound rules mostly ARE Italian's
// sound rules (they're the same language family, and Italian directly
// inherited most of them): c/g soften before e/i exactly like Italian, v=/v/
// like Italian, gn=/ɲ/ like Italian, double consonants are held like Italian.
// The only real gaps between "spell it like Latin" and "spell it like
// Italian" are: Latin's ae/oe diphthongs (Italian doesn't have them — they
// collapse to a single "e" sound ecclesiastically) and Latin's "ti + vowel"
// affricate (which Italian spells with "zi", not "ti" — this is literally
// the same sound change that turned Latin "gratia" into Italian "grazia").
// Fix those two gaps in the spelling fed to the TTS engine and a real
// Italian voice does the rest correctly, because it already knows real
// Italian phonotactics — no hand-guessed English-orthography respelling
// (the previous approach) required or reliable.
export function toEcclesiasticalTtsSpelling(latin: string): string {
  let s = latin
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip macrons — TTS doesn't use vowel length, only spelling
  s = s.replace(/ae/g, "e").replace(/oe/g, "e");
  // "ti" + vowel, not preceded by s/t/x (those keep a hard t): grātia -> gratsia (native
  // Italian "zi" spelling triggers the correct affricate automatically).
  s = s.replace(/(^|[^stx])ti([aeiou])/gi, "$1zi$2");
  return s;
}
