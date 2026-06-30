import { useEffect, useState } from "react";

/**
 * Reliably loads the browser's speech-synthesis voices.
 *
 * `speechSynthesis.getVoices()` returns `[]` on first call in Chrome/Firefox
 * because voices load asynchronously. The canonical signal is the
 * `voiceschanged` event — but it doesn't always fire (Safari, and Chrome when
 * voices are already cached), so we also poll briefly as a fallback.
 */
export function useVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() =>
    typeof window !== "undefined" && window.speechSynthesis
      ? window.speechSynthesis.getVoices()
      : []
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    const load = () => {
      const next = synth.getVoices();
      if (next.length > 0) setVoices(next);
      return next.length > 0;
    };

    load();
    synth.addEventListener("voiceschanged", load);

    // Fallback polling for browsers that never fire `voiceschanged`.
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (load() || attempts >= 10) window.clearInterval(timer);
    }, 250);

    return () => {
      synth.removeEventListener("voiceschanged", load);
      window.clearInterval(timer);
    };
  }, []);

  return voices;
}
