import { useCallback, useEffect, useRef, useState } from "react";
import { pickBestVoice } from "../lib/voices";
import { useVoices } from "./useVoices";

interface UseTTSOptions {
  text: string;
  voiceName: string;
  rate: number;
}

export function useTTS({ text, voiceName, rate }: UseTTSOptions) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voices = useVoices();

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Pick the most natural available voice. If the user's saved voice isn't
    // present in this browser, this auto-falls back to the best alternative
    // instead of the robotic system default.
    const voice = pickBestVoice(voices, voiceName);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, voiceName, rate, voices]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, cancel, speaking };
}
