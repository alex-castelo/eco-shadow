import type { Transcript } from "@echoshadow/core";
import { useMemo } from "react";

interface Props {
  transcript: Transcript | undefined;
  currentTime: number;
}

export function SubtitleBar({ transcript, currentTime }: Props) {
  const activeSegment = useMemo(() => {
    if (!transcript?.segments?.length) return null;
    let result = null;
    for (const seg of transcript.segments) {
      if (seg.start <= currentTime && seg.end >= currentTime) result = seg;
    }
    return result;
  }, [transcript, currentTime]);

  const segmentWords = useMemo(() => {
    if (!activeSegment || !transcript?.words?.length) return [];
    return transcript.words.filter(
      (w) => w.start >= activeSegment.start - 0.05 && w.end <= activeSegment.end + 0.05
    );
  }, [activeSegment, transcript?.words]);

  const activeWordIndex = useMemo(() => {
    if (segmentWords.length === 0) return -1;
    let lo = 0;
    let hi = segmentWords.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (segmentWords[mid].start <= currentTime) {
        found = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    if (found === -1) return -1;
    return currentTime <= segmentWords[found].end + 0.15 ? found : -1;
  }, [segmentWords, currentTime]);

  if (!activeSegment) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-center border-t border-zinc-700 bg-black px-6">
      <p className="text-center text-2xl">
        {segmentWords.length > 0 ? (
          segmentWords.map((w, i) => (
            <span
              key={w.start}
              className={i === activeWordIndex ? "font-semibold text-emerald-400" : "text-zinc-200"}
            >
              {w.word}{" "}
            </span>
          ))
        ) : (
          <span className="text-zinc-200">{activeSegment.text}</span>
        )}
      </p>
    </div>
  );
}
