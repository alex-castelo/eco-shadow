// Heuristics for picking the most natural-sounding voice the browser offers.
//
// The Web Speech API exposes a wildly different voice pool per browser/OS, and
// the *default* voice is almost always an old formant-synthesis ("robotic")
// one. These helpers rank the available voices so we can prefer the modern
// neural / cloud voices each platform ships (Google on Chrome, "… Online
// (Natural)" on Edge, "… (Enhanced/Premium)" on Apple).

const QUALITY_KEYWORDS: { pattern: RegExp; score: number }[] = [
  { pattern: /\bnatural\b/i, score: 100 }, // Microsoft "… Online (Natural)"
  { pattern: /\bneural\b/i, score: 100 },
  { pattern: /\bgoogle\b/i, score: 90 }, // Chrome cloud voices
  { pattern: /\bpremium\b/i, score: 80 }, // Apple premium
  { pattern: /\benhanced\b/i, score: 75 }, // Apple enhanced
  { pattern: /\bsiri\b/i, score: 70 }, // Apple Siri voices (good quality)
  { pattern: /\bonline\b/i, score: 40 },
];

// Apple novelty / legacy voices that sound notably worse — push them down.
const LOW_QUALITY =
  /\b(compact|eloquence|albert|bad news|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|reed|rocko|sandy|shelley|flo|eddy|fred|junior|kathy|ralph|deranged|good news|hysterical|pipe organ)\b/i;

/**
 * Score a voice by likely naturalness. Higher is better.
 * Negative scores mark voices we'd rather avoid.
 */
export function scoreVoice(voice: SpeechSynthesisVoice): number {
  let score = 0;
  for (const { pattern, score: s } of QUALITY_KEYWORDS) {
    if (pattern.test(voice.name)) score += s;
  }
  // Cloud / network voices (localService === false) are generally higher
  // fidelity than the bundled offline ones.
  if (!voice.localService) score += 20;
  if (LOW_QUALITY.test(voice.name)) score -= 200;
  return score;
}

/** A voice is "recommended" if our heuristics think it's clearly natural. */
export function isRecommendedVoice(voice: SpeechSynthesisVoice): boolean {
  return scoreVoice(voice) >= 40;
}

function langMatches(voiceLang: string, target: string): boolean {
  // Compare primary subtag only ("en-US" ~ "en-GB" ~ "en").
  return voiceLang.toLowerCase().split("-")[0] === target.toLowerCase().split("-")[0];
}

/**
 * Resolve which voice to actually speak with.
 * - If the user explicitly picked a voice and it's available, honor it.
 * - Otherwise auto-pick the highest-scoring voice, preferring the browser's
 *   UI language so the default isn't a robotic foreign-language voice.
 */
export function pickBestVoice(
  voices: SpeechSynthesisVoice[],
  preferredName: string,
  uiLang: string = typeof navigator !== "undefined" ? navigator.language : "en-US"
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  if (preferredName) {
    const exact = voices.find((v) => v.name === preferredName);
    if (exact) return exact;
    // Fall through to auto-pick if the saved voice isn't available in this
    // browser (e.g. a Chrome "Google …" voice opened in Firefox).
  }

  const sameLang = voices.filter((v) => langMatches(v.lang, uiLang));
  const pool = sameLang.length > 0 ? sameLang : voices;

  return pool.reduce((best, v) => (scoreVoice(v) > scoreVoice(best) ? v : best), pool[0]);
}

/**
 * Voices sorted for a settings dropdown: recommended first (best score),
 * then the rest alphabetically.
 */
export function sortVoicesForPicker(voices: SpeechSynthesisVoice[]): {
  recommended: SpeechSynthesisVoice[];
  others: SpeechSynthesisVoice[];
} {
  const recommended = voices
    .filter(isRecommendedVoice)
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));
  const others = voices
    .filter((v) => !isRecommendedVoice(v))
    .sort((a, b) => a.name.localeCompare(b.name));
  return { recommended, others };
}
