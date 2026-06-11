import { formatTime } from "../lib/media";

interface Props {
  duration: number;
  start: number;
  end: number;
  onChange: (start: number, end: number) => void;
}

const MIN_GAP = 0.2;

/** Double-thumb range slider to mark the loop start and end times. */
export function LoopSlider({ duration, start, end, onChange }: Props) {
  const max = Math.max(duration, MIN_GAP);
  const leftPct = (start / max) * 100;
  const widthPct = ((end - start) / max) * 100;

  return (
    <div>
      <div className="relative h-5">
        {/* Track */}
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-zinc-700" />
        {/* Selected segment */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-400"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <input
          type="range"
          className="loop-range"
          min={0}
          max={max}
          step={0.05}
          value={start}
          aria-label="Loop start"
          onChange={(e) => onChange(Math.min(Number(e.target.value), end - MIN_GAP), end)}
        />
        <input
          type="range"
          className="loop-range"
          min={0}
          max={max}
          step={0.05}
          value={end}
          aria-label="Loop end"
          onChange={(e) => onChange(start, Math.max(Number(e.target.value), start + MIN_GAP))}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-xs text-zinc-400">
        <span>A · {formatTime(start)}</span>
        <span>B · {formatTime(end)}</span>
      </div>
    </div>
  );
}
