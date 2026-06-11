import type { Transcript } from "@echoshadow/core";
import { useEffect, useMemo, useRef } from "react";

interface Props {
  transcript: Transcript;
  currentTime: number;
  onSeekWord: (time: number) => void;
}

/**
 * Karaoke view: renders every word and highlights the one currently
 * playing. Clicking a word seeks the player to it.
 */
export function TranscriptPanel({ transcript, currentTime, onSeekWord }: Props) {
  const { words, text } = transcript;
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeIndex = useMemo(() => {
    if (words.length === 0) return -1;
    // Binary search for the last word whose start <= currentTime.
    let lo = 0;
    let hi = words.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (words[mid].start <= currentTime) {
        found = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (found === -1) return -1;
    return currentTime <= words[found].end + 0.15 ? found : -1;
  }, [words, currentTime]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeIndex triggers scroll, activeRef is stable
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  if (words.length === 0) {
    return (
      <p className="max-h-64 overflow-y-auto leading-relaxed whitespace-pre-wrap text-zinc-300">
        {text}
      </p>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto leading-loose">
      {words.map((w, i) => (
        <button
          key={w.start}
          type="button"
          ref={i === activeIndex ? activeRef : undefined}
          onClick={() => onSeekWord(w.start)}
          className={`rounded px-0.5 transition-colors ${
            i === activeIndex
              ? "bg-emerald-400 font-semibold text-emerald-950"
              : i < activeIndex
                ? "text-zinc-500 hover:text-emerald-300"
                : "text-zinc-200 hover:text-emerald-300"
          }`}
        >
          {w.word}{" "}
        </button>
      ))}
    </div>
  );
}
