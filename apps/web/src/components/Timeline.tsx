import { useEffect, useRef, useState } from "react";
import type { LoopRegion } from "../hooks/usePlaybackEngine";
import { clamp } from "../lib/media";

interface Props {
  blob: Blob;
  duration: number;
  currentTime: number;
  loop: LoopRegion | null;
  loopEnabled: boolean;
  onSeek: (time: number) => void;
}

const BAR_COUNT = 200;

/**
 * Visual timeline rendering the decoded waveform of the audio blob.
 * Click anywhere to seek.
 */
export function Timeline({ blob, duration, currentTime, loop, loopEnabled, onSeek }: Props) {
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const ctx = new AudioContext();

    blob
      .arrayBuffer()
      .then((buf) => ctx.decodeAudioData(buf))
      .then((audio) => {
        if (cancelled) return;
        const channel = audio.getChannelData(0);
        const blockSize = Math.floor(channel.length / BAR_COUNT);
        const result: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let max = 0;
          const offset = i * blockSize;
          for (let j = 0; j < blockSize; j += 32) {
            const v = Math.abs(channel[offset + j] ?? 0);
            if (v > max) max = v;
          }
          result.push(max);
        }
        const peak = Math.max(...result, 0.01);
        setPeaks(result.map((v) => v / peak));
      })
      .catch(() => setPeaks(null))
      .finally(() => ctx.close());

    return () => {
      cancelled = true;
    };
  }, [blob]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    onSeek(frac * duration);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (duration <= 0) return;
    const step = duration * 0.05;
    if (e.key === "ArrowRight") onSeek(clamp(currentTime + step, 0, duration));
    if (e.key === "ArrowLeft") onSeek(clamp(currentTime - step, 0, duration));
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const loopLeftPct = loop && duration > 0 ? (loop.start / duration) * 100 : 0;
  const loopWidthPct = loop && duration > 0 ? ((loop.end - loop.start) / duration) * 100 : 0;

  const bars = peaks ?? Array.from({ length: BAR_COUNT }, () => 0.45);

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuenow={currentTime}
      aria-valuemin={0}
      aria-valuemax={duration}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="relative h-24 w-full cursor-pointer overflow-hidden rounded-lg bg-zinc-900 select-none"
      title="Click to seek"
    >
      {/* Loop region highlight */}
      {loop && (
        <div
          className={`absolute inset-y-0 ${loopEnabled ? "bg-emerald-500/20" : "bg-zinc-500/10"}`}
          style={{ left: `${loopLeftPct}%`, width: `${loopWidthPct}%` }}
        />
      )}

      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center gap-px px-1">
        {bars.map((v, i) => {
          const barPct = ((i + 0.5) / bars.length) * 100;
          const played = barPct <= progressPct;
          return (
            <div
              key={`bar-${i}`}
              className={`flex-1 rounded-sm ${played ? "bg-emerald-400" : "bg-zinc-600"}`}
              style={{ height: `${Math.max(v * 90, 4)}%` }}
            />
          );
        })}
      </div>

      {/* Playhead */}
      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${progressPct}%` }} />
    </div>
  );
}
