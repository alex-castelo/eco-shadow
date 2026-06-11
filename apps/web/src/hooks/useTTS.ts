import { useCallback, useEffect, useRef, useState } from "react";

interface UseTTSOptions {
  text: string;
  voiceName: string;
  rate: number;
}

export function useTTS({ text, voiceName, rate }: UseTTSOptions) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    if (voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.name === voiceName);
      utterance.voice = match ?? null;
    }
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, voiceName, rate]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { speak, cancel, speaking };
}
