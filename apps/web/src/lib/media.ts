/**
 * Minimal HTMLMediaElement surface the playback engine needs. Keeping
 * the engine decoupled from the concrete element lets a future phase
 * plug in non-<audio> players (e.g. an embedded YouTube player).
 */
export interface MediaLike {
  currentTime: number;
  duration: number;
  playbackRate: number;
  paused: boolean;
  play(): void | Promise<void>;
  pause(): void;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
